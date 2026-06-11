const POINTS = [
  35, 38, 32, 40, 45, 42, 50, 48, 55, 60, 58, 65, 62, 68, 70, 66, 72, 75, 70,
  76, 80, 78, 84, 82,
];

const MONTHS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

export function PortfolioChart() {
  const max = Math.max(...POINTS);
  const min = Math.min(...POINTS);
  const range = max - min;

  const W = 700;
  const H = 220;
  const stepX = W / (POINTS.length - 1);

  const pts = POINTS.map((v, i) => {
    const x = i * stepX;
    const y = H - ((v - min) / range) * (H - 20) - 10;
    return [x, y] as const;
  });

  const linePath = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  const areaPath = `${linePath} L${W},${H} L0,${H} Z`;

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
      <div className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-between px-3 text-[10px] text-white/40">
        {MONTHS.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}
