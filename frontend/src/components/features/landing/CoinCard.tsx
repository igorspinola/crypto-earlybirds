import Image from "next/image";
import { TrendingUp } from "lucide-react";

export type CoinCardProps = {
  symbol: string;
  name: string;
  priceUSD: number;
  textureSrc: string;
  logoSrc?: string;
  logoFallback?: string;
};

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function CoinCard({
  symbol,
  name,
  priceUSD,
  textureSrc,
  logoSrc,
  logoFallback,
}: CoinCardProps) {
  return (
    <div className="relative aspect-[3/4] w-[150px] shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-xl md:w-[190px]">
      <Image
        src={textureSrc}
        alt=""
        fill
        sizes="(min-width: 768px) 190px, 150px"
        className="object-cover"
      />
      <div className="absolute inset-x-0 top-0 flex h-[58%] items-center justify-center">
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt={`${name} logo`}
            width={64}
            height={64}
            className="h-12 w-auto md:h-16"
          />
        ) : (
          <span className="font-display text-4xl font-medium text-white md:text-5xl">
            {logoFallback ?? symbol.charAt(0)}
          </span>
        )}
      </div>
      <div className="absolute inset-x-2 bottom-2 flex items-end justify-between rounded-xl border border-white/10 bg-black/35 px-3 py-2 backdrop-blur-md md:inset-x-3 md:bottom-3 md:px-4 md:py-3">
        <div className="flex flex-col leading-tight">
          <span className="font-display text-base font-medium text-white md:text-xl">
            {symbol}
          </span>
          <span className="text-[10px] text-white/60 md:text-xs">{name}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 md:h-6 md:w-6">
            <TrendingUp className="h-3 w-3 text-white md:h-3.5 md:w-3.5" />
          </span>
          <span className="font-display text-xs font-medium text-white md:text-sm">
            ${priceFormatter.format(priceUSD)}
          </span>
        </div>
      </div>
    </div>
  );
}
