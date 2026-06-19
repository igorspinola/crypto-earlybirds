import { cookies } from "next/headers";
import { AllocationDonut } from "@/components/features/trader/AllocationDonut";
import { HistoryTable } from "@/components/features/trader/HistoryTable";
import { PortfolioChart } from "@/components/features/trader/PortfolioChart";
import { StatCard } from "@/components/features/trader/StatCard";
import { getWallet, listDeposits, listTransactions } from "@/lib/api";
import { formatBrl } from "@/lib/mock-coins";
import { buildPortfolioSnapshot } from "@/lib/portfolio-snapshot";

export default async function CarteiraPage() {
  const cookieHeader = (await cookies()).toString();
  const [wallet, transactions, deposits] = await Promise.all([
    getWallet(cookieHeader),
    listTransactions(cookieHeader),
    listDeposits(cookieHeader),
  ]);
  const portfolioSeries = buildPortfolioSnapshot(
    wallet,
    deposits,
    transactions,
  );

  const totalValue = Number(wallet.totalValueBRL);
  const balance = Number(wallet.balanceBRL);
  const profitLossTotal = wallet.holdings.reduce(
    (sum, holding) =>
      sum + (Number(holding.currentValueBRL) - Number(holding.totalInvestedBRL)),
    0,
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-medium md:text-3xl">Carteira</h1>
        <p className="text-sm text-white/60">
          Bem-vindo de volta! Aqui está o resumo da sua carteira cripto.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <StatCard
          label="Saldo total"
          value={formatBrl(totalValue)}
          variant="primary"
        />
        <StatCard label="Saldo disponível" value={formatBrl(balance)} />
        <StatCard
          label="Lucro/Prejuízo Total"
          value={formatBrl(profitLossTotal)}
          trend={profitLossTotal >= 0 ? "up" : "down"}
        />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-sm font-medium text-white/80 md:text-base">
          Gráfico de patrimônio
        </h2>
        <PortfolioChart series={portfolioSeries} />
      </section>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="md:col-span-2">
          <HistoryTable transactions={transactions} />
        </div>
        <AllocationDonut holdings={wallet.holdings} />
      </div>
    </div>
  );
}
