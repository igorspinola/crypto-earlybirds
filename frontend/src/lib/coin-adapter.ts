import type { ApiCryptocurrency } from "./api";
import type { Coin } from "./mock-coins";

const CATEGORY_LABELS: Record<string, Coin["category"]> = {
  defi: "DeFi",
  nft: "NFT",
  metaverse: "Metaverse",
  stablecoins: "Stablecoin",
};

const TEXTURE_BY_CATEGORY: Record<string, string> = {
  defi: "/images/coins/btc.jpg",
  nft: "/images/coins/eth.jpg",
  metaverse: "/images/coins/sol.jpg",
  stablecoins: "/images/coins/ada.jpg",
};

export function apiCryptocurrencyToCoin(
  cryptocurrency: ApiCryptocurrency,
): Coin {
  return {
    symbol: cryptocurrency.symbol,
    name: cryptocurrency.name,
    category: CATEGORY_LABELS[cryptocurrency.categoryUid] ?? "Token",
    priceBrl: Number(cryptocurrency.currentPrice),
    variation24h: 0,
    textureSrc:
      TEXTURE_BY_CATEGORY[cryptocurrency.categoryUid] ??
      "/images/coins/dot.jpg",
    logoSrc: cryptocurrency.imageUrl,
    fallbackChar: cryptocurrency.symbol[0],
  };
}
