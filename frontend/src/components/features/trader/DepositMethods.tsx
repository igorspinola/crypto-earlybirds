"use client";

import { QRCodeSVG } from "qrcode.react";
import { Barcode, Check, Copy, QrCode, Receipt, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  ApiError,
  type ApiDeposit,
  createDeposit,
  type DepositMethod,
  type DepositStatus,
  listDeposits,
} from "@/lib/api";
import { formatBrl } from "@/lib/mock-coins";

type Method = "pix" | "boleto";

const METHOD_API: Record<Method, DepositMethod> = {
  pix: "PIX",
  boleto: "BOLETO",
};

export function DepositMethods() {
  const [method, setMethod] = useState<Method>("pix");
  const [amount, setAmount] = useState("100");
  const [currentDeposit, setCurrentDeposit] = useState<ApiDeposit | null>(null);
  const [history, setHistory] = useState<ApiDeposit[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amountNumber = useMemo(() => parseDecimal(amount), [amount]);
  const isAmountValid = amountNumber !== null && amountNumber > 0;

  useEffect(() => {
    let active = true;
    listDeposits()
      .then((list) => {
        if (active) setHistory(list);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setHistoryLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!currentDeposit || currentDeposit.status !== "PENDING") return;

    const id = currentDeposit.id;
    const interval = setInterval(async () => {
      try {
        const list = await listDeposits();
        setHistory(list);
        const updated = list.find((deposit) => deposit.id === id);
        if (updated && updated.status !== "PENDING") {
          setCurrentDeposit(updated);
        }
      } catch {
        // ignora erro transitório do polling
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentDeposit]);

  const handleSubmit = async () => {
    if (!isAmountValid || amountNumber === null) {
      setSubmitError("Informe um valor válido");
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const deposit = await createDeposit({
        amountBRL: amountNumber,
        method: METHOD_API[method],
      });
      setCurrentDeposit(deposit);
      const list = await listDeposits();
      setHistory(list);
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : "Não foi possível gerar a cobrança",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCurrentDeposit(null);
    setSubmitError(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-sm font-medium text-white/80 md:text-base">
          1. Escolha o método de depósito
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <MethodCard
            active={method === "pix"}
            onClick={() => {
              setMethod("pix");
              handleReset();
            }}
            Icon={Zap}
            title="Pix"
            description="Depósito instantâneo. Aprovação em segundos."
          />
          <MethodCard
            active={method === "boleto"}
            onClick={() => {
              setMethod("boleto");
              handleReset();
            }}
            Icon={Receipt}
            title="Boleto bancário"
            description="Compensação até 3 dias úteis. Disponível em apenas dias úteis."
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-sm font-medium text-white/80 md:text-base">
          2. Detalhes do depósito
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <AmountCard
            amount={amount}
            onChange={(value) => {
              setAmount(value);
              handleReset();
            }}
            amountNumber={amountNumber}
            method={method}
            onSubmit={handleSubmit}
            disabled={!isAmountValid || isSubmitting || !!currentDeposit}
            isSubmitting={isSubmitting}
            error={submitError}
            hasDeposit={!!currentDeposit}
            onReset={handleReset}
          />

          {currentDeposit ? (
            method === "pix" ? (
              <PixPanel deposit={currentDeposit} />
            ) : (
              <BoletoPanel deposit={currentDeposit} />
            )
          ) : (
            <EmptyPanel method={method} />
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-sm font-medium text-white/80 md:text-base">
          Histórico de entrada
        </h2>
        <HistoryTable rows={history} loading={historyLoading} />
      </section>
    </div>
  );
}

function MethodCard({
  active,
  onClick,
  Icon,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  Icon: typeof Zap;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-2 rounded-2xl p-4 text-left ring-1 transition-colors ${
        active
          ? "bg-cyan-500/15 ring-cyan-400"
          : "bg-brand-blue-dark/60 ring-white/10 hover:ring-white/30"
      }`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          active ? "bg-cyan-400/20 text-cyan-300" : "bg-white/10 text-white/70"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="font-display text-sm font-medium text-white md:text-base">
        {title}
      </span>
      <span className="text-xs text-white/60">{description}</span>
    </button>
  );
}

function AmountCard({
  amount,
  onChange,
  amountNumber,
  method,
  onSubmit,
  disabled,
  isSubmitting,
  error,
  hasDeposit,
  onReset,
}: {
  amount: string;
  onChange: (value: string) => void;
  amountNumber: number | null;
  method: Method;
  onSubmit: () => void;
  disabled: boolean;
  isSubmitting: boolean;
  error: string | null;
  hasDeposit: boolean;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-brand-blue-dark/60 p-4 ring-1 ring-white/10 backdrop-blur-sm">
      <label className="text-[11px] font-medium uppercase tracking-wide text-white/60">
        Valor do depósito
      </label>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
        <input
          inputMode="decimal"
          value={amount}
          onChange={(e) => onChange(sanitizeAmount(e.target.value))}
          disabled={hasDeposit}
          className="min-w-0 flex-1 border-none bg-transparent text-base font-medium text-white outline-none disabled:opacity-60"
          placeholder="0,00"
        />
        <span className="text-sm text-white/60">BRL</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[11px] text-white/40">Você receberá:</span>
        <span className="font-display text-2xl font-bold text-emerald-400 md:text-3xl">
          {amountNumber !== null ? formatBrl(amountNumber) : "—"}
        </span>
        <span className="text-[11px] text-white/40">
          {method === "pix" ? "Saldo instantâneo" : "Saldo pendente"}
        </span>
      </div>

      {hasDeposit ? (
        <button
          type="button"
          onClick={onReset}
          className="mt-1 rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/5"
        >
          Gerar novo depósito
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled}
          className="mt-1 rounded-xl bg-gradient-to-r from-violet-500 to-brand-blue-light px-4 py-2 text-sm font-medium text-white shadow-lg transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Gerando..." : "Gerar cobrança"}
        </button>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function EmptyPanel({ method }: { method: Method }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center gap-2 rounded-2xl bg-brand-blue-dark/60 p-6 text-center ring-1 ring-white/10 backdrop-blur-sm">
      {method === "pix" ? (
        <QrCode className="h-8 w-8 text-white/30" />
      ) : (
        <Barcode className="h-8 w-8 text-white/30" />
      )}
      <p className="text-sm text-white/60">
        Informe o valor e clique em &quot;Gerar cobrança&quot; para receber a{" "}
        {method === "pix" ? "chave Pix" : "linha do boleto"}.
      </p>
    </div>
  );
}

function PixPanel({ deposit }: { deposit: ApiDeposit }) {
  const code = deposit.pixQrCode ?? "";
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-brand-blue-dark/60 p-4 ring-1 ring-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <QrCode className="h-4 w-4 text-cyan-300" />
          <span className="font-display text-sm font-medium">Pix</span>
        </div>
        <StatusBadge status={deposit.status} />
      </div>
      <p className="text-[11px] text-white/60">
        Escaneie o QR Code com o app do seu banco ou copie e cole o código Pix
        abaixo.
      </p>
      <div className="flex items-center justify-center rounded-xl bg-white p-4">
        {code ? (
          <QRCodeSVG value={code} size={168} level="M" />
        ) : (
          <span className="text-xs text-black/60">QR indisponível</span>
        )}
      </div>
      <CopyField label="Código Pix" value={code} />
    </div>
  );
}

function BoletoPanel({ deposit }: { deposit: ApiDeposit }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-brand-blue-dark/60 p-4 ring-1 ring-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Barcode className="h-4 w-4 text-cyan-300" />
          <span className="font-display text-sm font-medium">
            Boleto bancário
          </span>
        </div>
        <StatusBadge status={deposit.status} />
      </div>
      <p className="text-[11px] text-white/60">
        Abra a fatura no Asaas para visualizar o código de barras e a linha
        digitável.
      </p>
      {deposit.asaasInvoiceUrl ? (
        <a
          href={deposit.asaasInvoiceUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-gradient-to-r from-violet-500 to-brand-blue-light px-4 py-3 text-center text-sm font-medium text-white shadow-lg transition-opacity hover:opacity-90"
        >
          Abrir boleto
        </a>
      ) : (
        <p className="text-xs text-amber-300">
          Boleto ainda indisponível, aguarde alguns segundos.
        </p>
      )}
    </div>
  );
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // navegadores sem clipboard simplesmente ignoram
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-white/40">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/80">
        <span className="min-w-0 flex-1 truncate">{value || "—"}</span>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!value}
          className="flex h-6 w-6 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 disabled:opacity-40"
          aria-label="Copiar"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-300" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: DepositStatus }) {
  const label =
    status === "PAID" ? "Aprovado" : status === "CANCELED" ? "Cancelado" : "Pendente";
  const cls =
    status === "PAID"
      ? "bg-emerald-400/10 text-emerald-300"
      : status === "CANCELED"
        ? "bg-red-400/10 text-red-300"
        : "bg-amber-400/10 text-amber-300";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ${cls}`}
    >
      {label}
    </span>
  );
}

function HistoryTable({
  rows,
  loading,
}: {
  rows: ApiDeposit[];
  loading: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-brand-blue-dark/60 p-4 ring-1 ring-white/10 backdrop-blur-sm">
      <table className="w-full min-w-[420px] text-left text-xs">
        <thead>
          <tr className="text-white/50">
            <th className="pb-2 font-medium">Data</th>
            <th className="pb-2 font-medium">Método</th>
            <th className="pb-2 font-medium">Valor</th>
            <th className="pb-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading ? (
            <tr>
              <td colSpan={4} className="py-4 text-center text-white/50">
                Carregando...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-4 text-center text-white/50">
                Nenhum depósito ainda.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="text-white/90">
                <td className="py-2 text-white/60">
                  {formatDate(row.createdAt)}
                </td>
                <td className="py-2 font-medium">
                  {row.method === "PIX" ? "PIX" : "Boleto"}
                </td>
                <td className="py-2">{formatBrl(Number(row.amountBRL))}</td>
                <td className="py-2">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function sanitizeAmount(value: string) {
  const trimmed = value.replace(/[^\d.,]/g, "");
  const firstComma = trimmed.indexOf(",");
  if (firstComma === -1) return trimmed;
  return (
    trimmed.slice(0, firstComma + 1) +
    trimmed.slice(firstComma + 1).replace(/[,]/g, "")
  );
}

function parseDecimal(value: string): number | null {
  if (!value) return null;
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}
