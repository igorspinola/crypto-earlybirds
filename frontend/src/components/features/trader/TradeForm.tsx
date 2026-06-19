"use client";

import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ApiError,
  type ApiCryptocurrency,
  type ApiWallet,
  buyCryptocurrency,
  sellCryptocurrency,
} from "@/lib/api";
import { formatBrl } from "@/lib/mock-coins";

type Side = "buy" | "sell";

type TradeFormProps = {
  cryptocurrencies: ApiCryptocurrency[];
  wallet: ApiWallet;
};

export function TradeForm({ cryptocurrencies, wallet }: TradeFormProps) {
  const router = useRouter();
  const [side, setSide] = useState<Side>("buy");
  const [selectedId, setSelectedId] = useState<string>(
    cryptocurrencies[0]?.id ?? "",
  );
  const [qty, setQty] = useState<string>("1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const selected = cryptocurrencies.find((coin) => coin.id === selectedId);
  const quantity = useMemo(() => parseDecimal(qty), [qty]);
  const unitPrice = selected ? Number(selected.currentPrice) : 0;
  const total = (quantity ?? 0) * unitPrice;
  const balance = Number(wallet.balanceBRL);
  const heldQuantity =
    selected &&
    Number(
      wallet.holdings.find((h) => h.cryptocurrencyId === selected.id)
        ?.quantity ?? "0",
    );

  const availableSupply = selected ? Number(selected.availableSupply) : 0;
  const insufficientCash = side === "buy" && total > balance;
  const insufficientSupply =
    side === "buy" && (quantity ?? 0) > availableSupply;
  const insufficientHolding =
    side === "sell" && (quantity ?? 0) > (heldQuantity ?? 0);
  const cannotSubmit =
    !selected ||
    quantity === null ||
    quantity <= 0 ||
    insufficientCash ||
    insufficientSupply ||
    insufficientHolding ||
    isSubmitting;
  const missingCash = total - balance;

  const clearFeedback = () => {
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const handleSubmit = async () => {
    if (!selected || quantity === null) return;
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);
    try {
      const operation =
        side === "buy" ? buyCryptocurrency : sellCryptocurrency;
      const transaction = await operation({
        cryptocurrencyId: selected.id,
        quantity,
      });
      setSubmitSuccess(
        `${side === "buy" ? "Compra" : "Venda"} de ${transaction.quantity} ${
          transaction.cryptocurrency.symbol
        } por ${formatBrl(Number(transaction.totalBRL))} realizada.`,
      );
      setQty("");
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : "Não foi possível concluir a operação",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cryptocurrencies.length === 0) {
    return (
      <div className="rounded-2xl bg-brand-blue-dark/60 p-5 text-sm text-white/70 ring-1 ring-white/10">
        Nenhuma criptomoeda cadastrada ainda.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-brand-blue-dark/60 p-5 ring-1 ring-white/10 backdrop-blur-sm md:p-6">
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-black/30 p-1">
        <button
          type="button"
          onClick={() => {
            setSide("buy");
            clearFeedback();
          }}
          className={`rounded-lg py-2.5 font-display text-sm font-medium transition-colors ${
            side === "buy" ? "bg-emerald-500 text-white" : "text-white/60"
          }`}
        >
          Comprar
        </button>
        <button
          type="button"
          onClick={() => {
            setSide("sell");
            clearFeedback();
          }}
          className={`rounded-lg py-2.5 font-display text-sm font-medium transition-colors ${
            side === "sell" ? "bg-red-500 text-white" : "text-white/60"
          }`}
        >
          Vender
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-medium uppercase tracking-wide text-white/60">
          Criptomoeda
        </label>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              clearFeedback();
            }}
            className="min-w-0 flex-1 appearance-none border-none bg-transparent text-base font-medium text-white outline-none"
          >
            {cryptocurrencies.map((coin) => (
              <option
                key={coin.id}
                value={coin.id}
                className="bg-brand-blue-dark text-white"
              >
                {coin.symbol} — {coin.name}
              </option>
            ))}
          </select>
          <span className="shrink-0 text-sm text-white/40">⌄</span>
        </div>
      </div>

      <Field
        label="Quantidade"
        right={selected?.symbol ?? ""}
        value={qty}
        onChange={(v) => {
          setQty(sanitizeDecimal(v));
          clearFeedback();
        }}
        helper={
          selected
            ? `Disponível: ${formatNumber(
                side === "sell"
                  ? (heldQuantity ?? 0)
                  : Number(selected.availableSupply),
              )} ${selected.symbol}`
            : undefined
        }
      />

      <Field
        label="Preço unitário"
        right="BRL"
        value={formatBrl(unitPrice)}
        readOnly
      />

      <div className="flex flex-col gap-1 rounded-xl bg-gradient-to-br from-brand-blue-light/30 to-brand-blue-dark/80 p-4 ring-1 ring-white/10">
        <span className="text-xs text-white/60">Valor Total</span>
        <span className="font-display text-xl font-bold text-emerald-400 md:text-2xl">
          {formatBrl(total)}
        </span>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={cannotSubmit}
        className={`rounded-xl px-6 py-3 font-display text-base font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:py-3.5 ${
          side === "buy" ? "bg-emerald-500" : "bg-red-500"
        }`}
      >
        {isSubmitting
          ? "Processando..."
          : side === "buy"
            ? "Comprar"
            : "Vender"}
      </button>

      {insufficientCash && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs md:text-sm">
          <div className="flex items-center gap-2 font-display font-bold text-red-400">
            <CircleAlert className="h-4 w-4" />
            SALDO INSUFICIENTE
          </div>
          <p className="text-white/80">
            Você não possui saldo o suficiente para realizar esta operação.
            Adicione pelo menos {formatBrl(missingCash)} para continuar.
          </p>
          <Link
            href="/deposito"
            className="inline-flex w-fit items-center rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-500 px-4 py-2 font-display text-sm font-medium text-white"
          >
            Depositar
          </Link>
        </div>
      )}

      {insufficientHolding && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-white/80 md:text-sm">
          Você não possui {selected?.symbol} suficiente para vender essa
          quantidade.
        </div>
      )}

      {insufficientSupply && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-white/80 md:text-sm">
          Quantidade indisponível. Há apenas {formatNumber(availableSupply)}{" "}
          {selected?.symbol} no mercado.
        </div>
      )}

      {submitError && (
        <p className="text-sm text-red-400">{submitError}</p>
      )}
      {submitSuccess && (
        <p className="text-sm text-emerald-300">{submitSuccess}</p>
      )}
    </div>
  );
}

function Field({
  label,
  right,
  value,
  onChange,
  readOnly,
  helper,
}: {
  label: string;
  right: string;
  value: string | number;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  helper?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-medium uppercase tracking-wide text-white/60">
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
        <input
          value={value}
          readOnly={readOnly}
          inputMode={readOnly ? undefined : "decimal"}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className="min-w-0 flex-1 border-none bg-transparent text-base font-medium text-white outline-none placeholder:text-white/40"
        />
        <span className="flex shrink-0 items-center gap-1 text-sm text-white/80">
          {right}
        </span>
      </div>
      {helper && <span className="text-[11px] text-white/40">{helper}</span>}
    </div>
  );
}

function sanitizeDecimal(value: string) {
  const trimmed = value.replace(/[^\d.,]/g, "");
  const firstSep = trimmed.search(/[.,]/);
  if (firstSep === -1) return trimmed;
  return (
    trimmed.slice(0, firstSep + 1) +
    trimmed.slice(firstSep + 1).replace(/[.,]/g, "")
  );
}

function parseDecimal(value: string): number | null {
  if (!value) return null;
  const normalized = value.replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 8 }).format(
    value,
  );
}
