"use client";

import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { formatBrl } from "@/lib/mock-coins";

type Side = "buy" | "sell";

const UNIT_PRICE = 340520;
const AVAILABLE_BRL = 0;

export function TradeForm() {
  const [side, setSide] = useState<Side>("buy");
  const [qty, setQty] = useState(120);

  const total = qty * UNIT_PRICE;
  const insufficient = side === "buy" && total > AVAILABLE_BRL;
  const missing = total - AVAILABLE_BRL;

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-brand-blue-dark/60 p-5 ring-1 ring-white/10 backdrop-blur-sm md:p-6">
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-black/30 p-1">
        <button
          type="button"
          onClick={() => setSide("buy")}
          className={`rounded-lg py-2.5 font-display text-sm font-medium transition-colors ${
            side === "buy" ? "bg-emerald-500 text-white" : "text-white/60"
          }`}
        >
          Comprar
        </button>
        <button
          type="button"
          onClick={() => setSide("sell")}
          className={`rounded-lg py-2.5 font-display text-sm font-medium transition-colors ${
            side === "sell" ? "bg-red-500 text-white" : "text-white/60"
          }`}
        >
          Vender
        </button>
      </div>

      <Field
        label="Quantidade"
        right="BTC"
        rightHint
        value={qty}
        onChange={(v) => setQty(Math.max(0, Number(v) || 0))}
        helper="Disponível: 50.000"
      />

      <Field
        label="Preço unitário"
        right="BRL"
        value={formatBrl(UNIT_PRICE)}
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
        disabled={insufficient}
        className="rounded-xl bg-emerald-500 px-6 py-3 font-display text-base font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:py-3.5"
      >
        {side === "buy" ? "Comprar" : "Vender"}
      </button>

      {insufficient && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs md:text-sm">
          <div className="flex items-center gap-2 font-display font-bold text-red-400">
            <CircleAlert className="h-4 w-4" />
            SALDO INSUFICIENTE
          </div>
          <p className="text-white/80">
            Você não possui saldo o suficiente para realizar esta operação.
            Adicione pelo menos {formatBrl(missing)} para continuar.
          </p>
          <Link
            href="/deposito"
            className="inline-flex w-fit items-center rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-500 px-4 py-2 font-display text-sm font-medium text-white"
          >
            Depositar
          </Link>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  right,
  rightHint,
  value,
  onChange,
  readOnly,
  helper,
}: {
  label: string;
  right: string;
  rightHint?: boolean;
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
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className="min-w-0 flex-1 border-none bg-transparent text-base font-medium text-white outline-none placeholder:text-white/40"
        />
        <span className="flex shrink-0 items-center gap-1 text-sm text-white/80">
          {right}
          {rightHint && <span className="text-white/40">⌄</span>}
        </span>
      </div>
      {helper && <span className="text-[11px] text-white/40">{helper}</span>}
    </div>
  );
}
