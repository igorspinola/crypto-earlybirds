type Slice = {
  label: string;
  value: number;
  color: string;
};

const SLICES: Slice[] = [
  { label: "Bitcoin (BTC)", value: 45, color: "#1111ff" },
  { label: "Ethereum (ETH)", value: 25, color: "#22c55e" },
  { label: "Solana (SOL)", value: 15, color: "#06b6d4" },
  { label: "Cardano (ADA)", value: 10, color: "#fb923c" },
  { label: "Outros", value: 5, color: "#a855f7" },
];

export function AllocationDonut() {
  const total = SLICES.reduce((s, x) => s + x.value, 0);
  const R = 60;
  const C = 2 * Math.PI * R;
  const segments = SLICES.reduce<
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
          {SLICES.map((s) => (
            <li key={s.label} className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: s.color }}
              />
              <span className="text-white/80">{s.label}</span>
              <span className="ml-auto text-white/60">{s.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
