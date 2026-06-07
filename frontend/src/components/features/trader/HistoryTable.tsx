import { formatBrl } from "@/lib/mock-coins";

type Row = {
  symbol: string;
  type: "Depósito" | "Compra" | "Venda";
  qty: number;
  price: number;
  date: string;
};

const ROWS: Row[] = Array.from({ length: 7 }, () => ({
  symbol: "BTC",
  type: "Depósito",
  qty: 200,
  price: 87.4,
  date: "20/05/2026",
}));

export function HistoryTable() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-brand-blue-dark/60 p-4 ring-1 ring-white/10 backdrop-blur-sm">
      <h3 className="font-display text-sm font-medium md:text-base">
        Histórico recente
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-xs">
          <thead>
            <tr className="text-white/50">
              <th className="pb-2 font-medium">Criptomoeda</th>
              <th className="pb-2 font-medium">Quantidade</th>
              <th className="pb-2 font-medium">Depósito</th>
              <th className="pb-2 font-medium">Preço Atual</th>
              <th className="pb-2 font-medium">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {ROWS.map((r, i) => (
              <tr key={i} className="text-white/90">
                <td className="py-2 font-display font-medium text-emerald-400">
                  {r.symbol}
                </td>
                <td className="py-2">{r.qty}</td>
                <td className="py-2">{r.type}</td>
                <td className="py-2">{formatBrl(r.price)}</td>
                <td className="py-2 text-white/60">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
