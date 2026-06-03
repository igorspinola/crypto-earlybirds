import { CoinCard, type CoinCardProps } from "./CoinCard";

const COINS: CoinCardProps[] = [
  {
    symbol: "SOL",
    name: "Solana",
    priceUSD: 15171.09,
    textureSrc: "/images/coins/sol.jpg",
    logoSrc: "/images/coins/sol.svg",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    priceUSD: 18290.0,
    textureSrc: "/images/coins/eth.jpg",
    logoFallback: "Ξ",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    priceUSD: 540520.0,
    textureSrc: "/images/coins/btc.jpg",
    logoSrc: "/images/coins/btc.svg",
  },
  {
    symbol: "ADA",
    name: "Cardano",
    priceUSD: 2.45,
    textureSrc: "/images/coins/ada.jpg",
    logoFallback: "₳",
  },
  {
    symbol: "DOT",
    name: "Polkadot",
    priceUSD: 32.4,
    textureSrc: "/images/coins/dot.jpg",
    logoFallback: "●",
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    priceUSD: 165.9,
    textureSrc: "/images/coins/avax.jpg",
    logoSrc: "/images/coins/avax.svg",
  },
];

export function CoinMarquee() {
  return (
    <div
      className="no-scrollbar overflow-x-auto"
      role="region"
      aria-label="Mercado em tempo real"
    >
      <div className="flex w-max items-stretch gap-3 px-6 md:gap-4 md:px-8">
        {COINS.map((c) => (
          <CoinCard key={c.symbol} {...c} />
        ))}
      </div>
    </div>
  );
}
