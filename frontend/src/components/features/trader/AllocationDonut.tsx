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
  let offset = 0;

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-brand-blue-dark/60 p-4 ring-1 ring-white/10 backdrop-blur-sm">
      <h3 className="font-display text-sm font-medium md:text-base">
        Alocação de carteira
      </h3>
      <div className="flex items-center gap-4">
        <svg viewBox="-80 -80 160 160" className="h-32 w-32 -rotate-90">
          {SLICES.map((s) => {
            const len = (s.value / total) * C;
            const el = (
              <circle
                key={s.label}
                r={R}
                cx={0}
                cy={0}
                fill="none"
                stroke={s.color}
                strokeWidth={20}
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
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
