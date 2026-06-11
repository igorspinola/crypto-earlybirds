export type Coin = {
  symbol: string;
  name: string;
  category: "DeFi" | "NFT" | "Metaverse" | "Stablecoin" | "Token";
  priceBrl: number;
  variation24h: number;
  textureSrc: string;
  logoSrc?: string;
  fallbackChar?: string;
};

export const COINS: Coin[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    category: "DeFi",
    priceBrl: 340520,
    variation24h: 4.01,
    textureSrc: "/images/coins/btc.jpg",
    logoSrc: "/images/coins/btc.svg",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    category: "DeFi",
    priceBrl: 18250.1,
    variation24h: 4.01,
    textureSrc: "/images/coins/eth.jpg",
    logoSrc: "/images/coins/eth.svg",
  },
  {
    symbol: "SOL",
    name: "Solana",
    category: "DeFi",
    priceBrl: 15171.09,
    variation24h: 4.01,
    textureSrc: "/images/coins/sol.jpg",
    logoSrc: "/images/coins/sol.svg",
  },
  {
    symbol: "ADA",
    name: "Cardano",
    category: "Token",
    priceBrl: 2.45,
    variation24h: 4.01,
    textureSrc: "/images/coins/ada.jpg",
    logoSrc: "/images/coins/ada.svg",
  },
  {
    symbol: "DOT",
    name: "Polkadot",
    category: "DeFi",
    priceBrl: 32.4,
    variation24h: 4.01,
    textureSrc: "/images/coins/dot.jpg",
    logoSrc: "/images/coins/dot.svg",
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    category: "DeFi",
    priceBrl: 185.6,
    variation24h: 4.01,
    textureSrc: "/images/coins/avax.jpg",
    logoSrc: "/images/coins/avax.svg",
  },
];

export function formatBrl(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
