type CoinCardProps = {
  symbol: string;
  name: string;
  priceBRL: number;
};

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

export function CoinCard({ symbol, name, priceBRL }: CoinCardProps) {
  return (
    <div className="flex min-w-[148px] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg backdrop-blur-md md:min-w-[180px] md:px-5 md:py-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue-light/30 font-display text-base font-medium text-white md:h-12 md:w-12 md:text-lg">
        {symbol.charAt(0)}
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-display text-sm font-medium text-white md:text-base">
          {symbol}
        </span>
        <span className="text-[10px] text-white/60 md:text-xs">{name}</span>
        <span className="mt-0.5 text-xs font-medium text-white md:text-sm">
          {priceFormatter.format(priceBRL)}
        </span>
      </div>
    </div>
  );
}
