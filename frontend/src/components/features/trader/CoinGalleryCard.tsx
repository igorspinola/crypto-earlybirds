import { TrendingUp } from "lucide-react";
import Image from "next/image";
import { formatBrl, type Coin } from "@/lib/mock-coins";

export function CoinGalleryCard({ coin }: { coin: Coin }) {
  return (
    <article className="relative flex aspect-[3/2] flex-col justify-between overflow-hidden rounded-2xl bg-brand-blue-light/20 p-2 ring-1 ring-white/10">
      <Image
        src={coin.textureSrc}
        alt=""
        fill
        sizes="(min-width: 768px) 20vw, 100vw"
        className="object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-blue-light/40 via-brand-blue-dark/30 to-brand-blue-dark/80" />

      <div className="relative flex flex-1 items-center justify-center">
        {coin.logoSrc ? (
          <Image
            src={coin.logoSrc}
            alt=""
            width={60}
            height={60}
            className="h-15 w-15 drop-shadow-[0_0_24px_rgba(255,255,255,0.4)]"
          />
        ) : (
          <span className="font-display text-[2.25rem] font-bold text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.4)]">
            {coin.fallbackChar ?? coin.symbol[0]}
          </span>
        )}
      </div>

      <div className="relative flex flex-col gap-0.5">
        <div className="flex items-center justify-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm">
          <span className="text-white">{coin.symbol}</span>
          <span className="text-white/60">— {coin.name}</span>
        </div>
        <div className="text-center font-display text-sm font-bold text-white">
          {formatBrl(coin.priceBrl)}
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-white/60">{coin.category}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-1.5 py-0.5 text-emerald-300">
            <TrendingUp className="h-3 w-3" />
            {coin.variation24h.toFixed(2)}%
          </span>
        </div>
      </div>
    </article>
  );
}
