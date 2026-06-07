"use client";

import { Barcode, QrCode, Receipt, Zap } from "lucide-react";
import { useState } from "react";
import { formatBrl } from "@/lib/mock-coins";

type Method = "pix" | "boleto";

const PIX_CODE = "127ipx2123128dh23900a121393";
const BARCODE_LINES = Array.from({ length: 70 }, (_, i) => i % 3 !== 0);

export function DepositMethods() {
  const [method, setMethod] = useState<Method>("pix");
  const [amount, setAmount] = useState("R$ 340.520,00");

  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-sm font-medium text-white/80 md:text-base">
          1. Escolha o método de depósito
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <MethodCard
            active={method === "pix"}
            onClick={() => setMethod("pix")}
            Icon={Zap}
            title="Pix"
            description="Depósito instantâneo. Aprovação em segundos."
          />
          <MethodCard
            active={method === "boleto"}
            onClick={() => setMethod("boleto")}
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
          <div className="flex flex-col gap-3 rounded-2xl bg-brand-blue-dark/60 p-4 ring-1 ring-white/10 backdrop-blur-sm">
            <label className="text-[11px] font-medium uppercase tracking-wide text-white/60">
              Valor do depósito
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="min-w-0 flex-1 border-none bg-transparent text-base font-medium text-white outline-none"
              />
              <span className="text-sm text-white/60">BRL</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-white/40">Você receberá:</span>
              <span className="font-display text-2xl font-bold text-emerald-400 md:text-3xl">
                {amount}
              </span>
              <span className="text-[11px] text-white/40">
                {method === "pix" ? "Saldo instantâneo" : "Saldo pendente"}
              </span>
            </div>
          </div>

          {method === "pix" ? <PixPanel code={PIX_CODE} /> : <BoletoPanel />}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-sm font-medium text-white/80 md:text-base">
          Histórico de entrada
        </h2>
        <HistoryTable />
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

function PixPanel({ code }: { code: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-brand-blue-dark/60 p-4 ring-1 ring-white/10 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <QrCode className="h-4 w-4 text-cyan-300" />
        <span className="font-display text-sm font-medium">Pix</span>
      </div>
      <p className="text-[11px] text-white/60">
        Escaneie o QR CODE com o app do seu banco ou copie e cole o código Pix
        abaixo.
      </p>
      <div className="flex items-center justify-center rounded-xl bg-white p-4">
        <QrPlaceholder />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[11px] text-white/40">Código Pix</span>
        <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/80">
          {code}
        </div>
      </div>
    </div>
  );
}

function BoletoPanel() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-brand-blue-dark/60 p-4 ring-1 ring-white/10 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Barcode className="h-4 w-4 text-cyan-300" />
        <span className="font-display text-sm font-medium">Boleto bancário</span>
      </div>
      <p className="text-[11px] text-white/60">
        Escaneie o código de barras com o app do seu banco ou copie e cole o
        código abaixo.
      </p>
      <div className="flex h-32 items-end justify-center gap-px rounded-xl bg-white p-4">
        {BARCODE_LINES.map((thick, i) => (
          <span
            key={i}
            className="h-full"
            style={{
              width: thick ? 2 : 1,
              background: i % 7 === 0 ? "#fff" : "#000",
            }}
          />
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[11px] text-white/40">Código boleto</span>
        <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/80">
          12378asbas1212312bhd1212319391239
        </div>
      </div>
    </div>
  );
}

function QrPlaceholder() {
  const cells = Array.from({ length: 21 * 21 }, (_, i) => {
    const x = i % 21;
    const y = Math.floor(i / 21);
    if ((x < 7 && y < 7) || (x >= 14 && y < 7) || (x < 7 && y >= 14)) {
      const inner = x % 6 === 0 || y % 6 === 0 || (x >= 2 && x <= 4 && y >= 2 && y <= 4);
      return inner;
    }
    return (x * 7 + y * 13 + (x ^ y)) % 3 === 0;
  });
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: "repeat(21, 1fr)",
        width: 168,
        height: 168,
      }}
    >
      {cells.map((on, i) => (
        <span
          key={i}
          style={{ background: on ? "#000" : "#fff", width: 8, height: 8 }}
        />
      ))}
    </div>
  );
}

type Row = {
  date: string;
  method: "PIX" | "Boleto";
  value: number;
  status: "Aprovado" | "Pendente";
};

const ROWS: Row[] = [
  { date: "20/05/2026", method: "PIX", value: 5000, status: "Aprovado" },
  { date: "20/05/2026", method: "PIX", value: 5000, status: "Pendente" },
  { date: "20/05/2026", method: "Boleto", value: 5000, status: "Aprovado" },
  { date: "20/05/2026", method: "PIX", value: 5000, status: "Aprovado" },
  { date: "20/05/2026", method: "Boleto", value: 5000, status: "Pendente" },
];

function HistoryTable() {
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
          {ROWS.map((r, i) => (
            <tr key={i} className="text-white/90">
              <td className="py-2 text-white/60">{r.date}</td>
              <td className="py-2 font-medium">{r.method}</td>
              <td className="py-2">{formatBrl(r.value)}</td>
              <td className="py-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ${
                    r.status === "Aprovado"
                      ? "bg-emerald-400/10 text-emerald-300"
                      : "bg-amber-400/10 text-amber-300"
                  }`}
                >
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
