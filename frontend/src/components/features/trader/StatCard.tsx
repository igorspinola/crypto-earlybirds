import { TrendingDown, TrendingUp } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  trend?: "up" | "down" | null;
  variant?: "default" | "primary";
};

export function StatCard({
  label,
  value,
  trend = null,
  variant = "default",
}: StatCardProps) {
  const isPrimary = variant === "primary";
  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl p-4 ring-1 ring-white/10 ${
        isPrimary
          ? "bg-gradient-to-br from-brand-blue-light/40 to-brand-blue-dark/80"
          : "bg-brand-blue-dark/60 backdrop-blur-sm"
      }`}
    >
      <span className="flex items-center gap-2 text-xs text-white/60">
        {trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-400" />}
        {trend === "down" && <TrendingDown className="h-3 w-3 text-red-400" />}
        {label}
      </span>
      <span
        className={`font-display text-xl font-bold md:text-2xl ${
          trend === "up"
            ? "text-emerald-400"
            : trend === "down"
              ? "text-red-400"
              : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
