import { Cryptocurrency, WalletHolding } from '@prisma/client';

type HoldingWithCryptocurrency = WalletHolding & {
  cryptocurrency: Cryptocurrency;
};

export function serializeHolding(holding: HoldingWithCryptocurrency) {
  return {
    id: holding.id,
    cryptocurrencyId: holding.cryptocurrencyId,
    quantity: holding.quantity.toString(),
    totalInvestedBRL: holding.totalInvestedBRL.toString(),
    averagePriceBRL: calculateAveragePrice(holding),
    currentValueBRL: holding.quantity
      .mul(holding.cryptocurrency.currentPrice)
      .toString(),
    cryptocurrency: {
      id: holding.cryptocurrency.id,
      name: holding.cryptocurrency.name,
      symbol: holding.cryptocurrency.symbol,
      imageUrl: holding.cryptocurrency.imageUrl,
      currentPrice: holding.cryptocurrency.currentPrice.toString(),
      categoryUid: holding.cryptocurrency.categoryUid,
    },
    updatedAt: holding.updatedAt,
  };
}

function calculateAveragePrice(holding: WalletHolding) {
  if (holding.quantity.isZero()) {
    return '0';
  }

  return holding.totalInvestedBRL.div(holding.quantity).toString();
}
