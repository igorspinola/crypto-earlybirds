import { CoinCard } from "./CoinCard";

const COINS = [
  { symbol: "SOL", name: "Solana", priceBRL: 850 },
  { symbol: "ETH", name: "Ethereum", priceBRL: 22500 },
  { symbol: "BTC", name: "Bitcoin", priceBRL: 510000 },
  { symbol: "ADA", name: "Cardano", priceBRL: 2.4 },
  { symbol: "XRP", name: "XRP", priceBRL: 3.1 },
  { symbol: "DOGE", name: "Dogecoin", priceBRL: 0.85 },
  { symbol: "MATIC", name: "Polygon", priceBRL: 2.1 },
];

export function CoinMarquee() {
  return (
    <div
      className="no-scrollbar overflow-x-auto"
      role="region"
      aria-label="Mercado em tempo real"
    >
      <div className="flex w-max items-center gap-3 px-6 md:gap-4 md:px-8">
        {COINS.map((c) => (
          <CoinCard key={c.symbol} {...c} />
        ))}
      </div>
    </div>
  );
}
