import type { ComponentType } from "react";

type CategoryCardProps = {
  title: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
  accent: "emerald" | "indigo" | "fuchsia" | "amber";
};

const ACCENTS: Record<CategoryCardProps["accent"], string> = {
  emerald: "from-emerald-400/30 to-emerald-700/10 text-emerald-300",
  indigo: "from-indigo-400/30 to-indigo-700/10 text-indigo-300",
  fuchsia: "from-fuchsia-400/30 to-fuchsia-700/10 text-fuchsia-300",
  amber: "from-amber-400/30 to-amber-700/10 text-amber-300",
};

export function CategoryCard({ title, description, Icon, accent }: CategoryCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl bg-brand-blue-dark/80 p-4 ring-1 ring-white/10 backdrop-blur-sm">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${ACCENTS[accent]}`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="font-display text-base font-medium md:text-lg">{title}</h3>
      <p className="text-xs text-white/60 md:text-sm">{description}</p>
    </article>
  );
}
