import type { PortfolioPoint } from "@/lib/portfolio-snapshot";
import { formatBrl } from "@/lib/mock-coins";

type PortfolioChartProps = {
  series: PortfolioPoint[];
};

export function PortfolioChart({ series }: PortfolioChartProps) {
  if (series.length < 2) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-2xl bg-brand-blue-dark/40 ring-1 ring-white/10 md:h-64">
        <p className="px-4 text-center text-xs text-white/50">
          Sem histórico ainda. Deposite ou negocie para começar a ver seu
          patrimônio ao longo do tempo.
        </p>
      </div>
    );
  }

  const values = series.map((point) => point.value);
  const max = Math.max(...values);
  const rawMin = Math.min(...values);
  const min = rawMin === max ? Math.max(0, max - 1) : rawMin;
  const range = max - min || 1;

  const W = 700;
  const H = 220;
  const stepX = W / (series.length - 1);

  const pts = series.map((point, i) => {
    const x = i * stepX;
    const y = H - ((point.value - min) / range) * (H - 20) - 10;
    return [x, y] as const;
  });

  const linePath = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  const areaPath = `${linePath} L${W},${H} L0,${H} Z`;
  const labels = pickAxisLabels(series);

  return (
    <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-brand-blue-dark/40 ring-1 ring-white/10 md:h-64">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1111ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1111ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 5 }, (_, i) => (
          <line
            key={i}
            x1={0}
            x2={W}
            y1={(H / 5) * (i + 1)}
            y2={(H / 5) * (i + 1)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}
        <path d={areaPath} fill="url(#area-fill)" />
        <path d={linePath} fill="none" stroke="#1111ff" strokeWidth={2} />
      </svg>
      <div className="pointer-events-none absolute left-3 top-2 text-[11px] text-white/60">
        Máx: {formatBrl(max)}
      </div>
      <div className="pointer-events-none absolute bottom-1 left-3 text-[11px] text-white/60">
        Mín: {formatBrl(min)}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-between px-3 text-[10px] text-white/40">
        {labels.map((label, i) => (
          <span key={`${label}-${i}`}>{label}</span>
        ))}
      </div>
    </div>
  );
}

function pickAxisLabels(series: PortfolioPoint[]) {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
  const indices =
    series.length <= 4
      ? series.map((_, i) => i)
      : [0, Math.floor(series.length / 3), Math.floor((2 * series.length) / 3), series.length - 1];
  return indices.map((i) => formatter.format(new Date(series[i].date)));
}
