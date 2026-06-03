type Props = {
  children: React.ReactNode;
  tone?: "light" | "dark";
};

export function SectionLabel({ children, tone = "dark" }: Props) {
  const dotColor = tone === "light" ? "bg-white" : "bg-brand-blue-light";
  const textColor = tone === "light" ? "text-white" : "text-foreground";
  return (
    <div
      className={`inline-flex items-center gap-2 text-xs font-medium md:text-sm ${textColor}`}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotColor}`} />
      {children}
    </div>
  );
}
