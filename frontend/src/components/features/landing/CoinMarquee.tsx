import { CoinCard, type CoinCardProps } from "./CoinCard";

const COINS: CoinCardProps[] = [
  {
    symbol: "AVAX",
    name: "Avalanche",
    priceUSD: 165.9,
    textureSrc: "/images/coins/avax.jpg",
    logoSrc: "/images/coins/avax.svg",
  },
  {
    symbol: "DOT",
    name: "Polkadot",
    priceUSD: 32.4,
    textureSrc: "/images/coins/dot.jpg",
    logoSrc: "/images/coins/dot.svg",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    priceUSD: 18290.0,
    textureSrc: "/images/coins/eth.jpg",
    logoSrc: "/images/coins/eth.svg",
  },
  {
    symbol: "SOL",
    name: "Solana",
    priceUSD: 15171.09,
    textureSrc: "/images/coins/sol.jpg",
    logoSrc: "/images/coins/sol.svg",
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
    logoSrc: "/images/coins/ada.svg",
  },
  {
    symbol: "XRP",
    name: "Ripple",
    priceUSD: 185.8,
    textureSrc: "/images/coins/dot.jpg",
    logoFallback: "X",
  },
];

const CENTER = (COINS.length - 1) / 2;

export function CoinMarquee() {
  return (
    <div
      role="region"
      aria-label="Mercado em tempo real"
      className="relative mx-auto h-[260px] w-full max-w-[520px] sm:h-[300px] md:h-[340px] md:max-w-[760px]"
    >
      {COINS.map((c, i) => {
        const offset = i - CENTER;
        const abs = Math.abs(offset);
        const rotate = 0;
        const translateX = offset * 110;
        const translateY = 0;
        const scale = abs === 0 ? 1.1 : 1 - abs * 0.04;
        const z = 10 - abs;
        return (
          <div
            key={c.symbol}
            className="absolute left-1/2 top-0"
            style={{
              transform: `translate(-50%, 0) translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})`,
              transformOrigin: "50% 100%",
              zIndex: z,
            }}
          >
            <CoinCard {...c} />
          </div>
        );
      })}
    </div>
  );
}
