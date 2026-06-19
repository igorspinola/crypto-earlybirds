import type { ApiTransaction } from "@/lib/api";
import { formatBrl } from "@/lib/mock-coins";

type HistoryTableProps = {
  transactions: ApiTransaction[];
};

export function HistoryTable({ transactions }: HistoryTableProps) {
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
              <th className="pb-2 font-medium">Operação</th>
              <th className="pb-2 font-medium">Preço unitário</th>
              <th className="pb-2 font-medium">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-white/50">
                  Nenhuma transação ainda.
                </td>
              </tr>
            ) : (
              transactions.map((t) => {
                const isBuy = t.type === "BUY";
                return (
                  <tr key={t.id} className="text-white/90">
                    <td className="py-2 font-display font-medium text-emerald-400">
                      {t.cryptocurrency.symbol}
                    </td>
                    <td className="py-2">{formatQuantity(t.quantity)}</td>
                    <td className="py-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ${
                          isBuy
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-red-400/10 text-red-300"
                        }`}
                      >
                        {isBuy ? "Compra" : "Venda"}
                      </span>
                    </td>
                    <td className="py-2">
                      {formatBrl(Number(t.unitPriceBRL))}
                    </td>
                    <td className="py-2 text-white/60">
                      {formatDate(t.createdAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatQuantity(value: string) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 8 }).format(
    Number(value),
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}
