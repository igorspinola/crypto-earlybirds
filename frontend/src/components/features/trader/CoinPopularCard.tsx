import Image from "next/image";
import { formatBrl, type Coin } from "@/lib/mock-coins";

export function CoinPopularCard({
  coin,
  dim = false,
  focus = false,
}: {
  coin: Coin;
  dim?: boolean;
  focus?: boolean;
}) {
  return (
    <article
      className={`relative flex w-44 shrink-0 flex-col gap-3 overflow-hidden rounded-3xl bg-gradient-to-b from-[#03032B] to-[#64649F] p-5 ring-1 ring-white/10 md:w-52 ${
        focus ? "shadow-2xl shadow-black/40" : ""
      } ${dim ? "opacity-70" : "opacity-100"}`}
    >
      {coin.logoSrc ? (
        <Image
          src={coin.logoSrc}
          alt=""
          width={32}
          height={32}
          className="h-7 w-7"
        />
      ) : (
        <span className="font-display text-2xl font-bold text-white">
          {coin.fallbackChar ?? coin.symbol[0]}
        </span>
      )}
      <div className="flex flex-col leading-tight">
        <span className="font-display text-xl font-medium text-white">
          {coin.name}
        </span>
        <span className="text-xs text-white/60">{coin.symbol}</span>
      </div>
      <span className="font-display text-lg font-bold text-emerald-400">
        {formatBrl(coin.priceBrl)}
      </span>
    </article>
  );
}
