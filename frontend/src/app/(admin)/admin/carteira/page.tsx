import { AllocationDonut } from "@/components/features/trader/AllocationDonut";
import { HistoryTable } from "@/components/features/trader/HistoryTable";
import { PortfolioChart } from "@/components/features/trader/PortfolioChart";
import { StatCard } from "@/components/features/trader/StatCard";
import { formatBrl } from "@/lib/mock-coins";

export default function AdminCarteiraPage() {
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
          value={formatBrl(30000.2)}
          variant="primary"
        />
        <StatCard
          label="Lucro/Prejuízo 24h"
          value={formatBrl(10200.1)}
          trend="up"
        />
        <StatCard
          label="Lucro/Prejuízo Total"
          value={formatBrl(2201.1)}
          trend="down"
        />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-sm font-medium text-white/80 md:text-base">
          Gráfico de patrimônio
        </h2>
        <PortfolioChart />
      </section>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="md:col-span-2">
          <HistoryTable />
        </div>
        <AllocationDonut />
      </div>
    </div>
  );
}
