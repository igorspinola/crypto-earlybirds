import type { ApiWalletHolding } from "@/lib/api";

type Slice = {
  label: string;
  value: number;
  color: string;
};

const PALETTE = [
  "#1111ff",
  "#22c55e",
  "#06b6d4",
  "#fb923c",
  "#a855f7",
  "#f43f5e",
  "#eab308",
  "#14b8a6",
];

type AllocationDonutProps = {
  holdings: ApiWalletHolding[];
};

export function AllocationDonut({ holdings }: AllocationDonutProps) {
  const slices = buildSlices(holdings);
  const total = slices.reduce((s, x) => s + x.value, 0);

  if (total === 0) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl bg-brand-blue-dark/60 p-4 ring-1 ring-white/10 backdrop-blur-sm">
        <h3 className="font-display text-sm font-medium md:text-base">
          Alocação de carteira
        </h3>
        <p className="py-6 text-center text-xs text-white/50">
          Nenhuma posição ainda. Compre uma criptomoeda para ver a alocação.
        </p>
      </div>
    );
  }

  const R = 60;
  const C = 2 * Math.PI * R;
  const segments = slices.reduce<
    Array<Slice & { length: number; offset: number }>
  >((items, slice) => {
    const offset = items.reduce((sum, item) => sum + item.length, 0);
    const length = (slice.value / total) * C;
    return [...items, { ...slice, length, offset }];
  }, []);

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-brand-blue-dark/60 p-4 ring-1 ring-white/10 backdrop-blur-sm">
      <h3 className="font-display text-sm font-medium md:text-base">
        Alocação de carteira
      </h3>
      <div className="flex items-center gap-4">
        <svg viewBox="-80 -80 160 160" className="h-32 w-32 -rotate-90">
          {segments.map((segment) => (
            <circle
              key={segment.label}
              r={R}
              cx={0}
              cy={0}
              fill="none"
              stroke={segment.color}
              strokeWidth={20}
              strokeDasharray={`${segment.length} ${C - segment.length}`}
              strokeDashoffset={-segment.offset}
            />
          ))}
        </svg>
        <ul className="flex flex-1 flex-col gap-1 text-xs">
          {slices.map((s) => (
            <li key={s.label} className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: s.color }}
              />
              <span className="text-white/80">{s.label}</span>
              <span className="ml-auto text-white/60">
                {Math.round((s.value / total) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function buildSlices(holdings: ApiWalletHolding[]): Slice[] {
  const sorted = [...holdings]
    .map((holding) => ({
      label: `${holding.cryptocurrency.name} (${holding.cryptocurrency.symbol})`,
      value: Number(holding.currentValueBRL),
    }))
    .filter((slice) => slice.value > 0)
    .sort((a, b) => b.value - a.value);

  if (sorted.length <= PALETTE.length) {
    return sorted.map((slice, index) => ({
      ...slice,
      color: PALETTE[index],
    }));
  }

  const top = sorted.slice(0, PALETTE.length - 1).map((slice, index) => ({
    ...slice,
    color: PALETTE[index],
  }));
  const othersValue = sorted
    .slice(PALETTE.length - 1)
    .reduce((sum, slice) => sum + slice.value, 0);

  return [
    ...top,
    {
      label: "Outros",
      value: othersValue,
      color: PALETTE[PALETTE.length - 1],
    },
  ];
}
