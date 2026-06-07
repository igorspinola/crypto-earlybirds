import Image from "next/image";
import { formatBrl, type Coin } from "@/lib/mock-coins";

export function CoinPopularCard({ coin, dim = false }: { coin: Coin; dim?: boolean }) {
  return (
    <article
      className={`relative flex w-44 shrink-0 flex-col gap-2 overflow-hidden rounded-2xl bg-brand-blue-light/30 p-4 ring-1 ring-white/10 transition-opacity md:w-52 ${
        dim ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="flex h-16 items-center justify-center">
        {coin.logoSrc ? (
          <Image src={coin.logoSrc} alt="" width={48} height={48} className="h-12 w-12" />
        ) : (
          <span className="font-display text-4xl font-bold text-white">
            {coin.fallbackChar ?? coin.symbol[0]}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <span className="font-display text-base font-medium text-white">{coin.name}</span>
        <span className="text-[11px] text-white/60">{coin.symbol}</span>
      </div>
      <span className="font-display text-base font-bold text-emerald-400">
        {formatBrl(coin.priceBrl)}
      </span>
    </article>
  );
}
