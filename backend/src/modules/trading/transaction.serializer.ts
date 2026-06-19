import { Cryptocurrency, Transaction } from '@prisma/client';

type TransactionWithCryptocurrency = Transaction & {
  cryptocurrency: Cryptocurrency;
};

export function serializeTransaction(
  transaction: TransactionWithCryptocurrency,
) {
  return {
    id: transaction.id,
    userId: transaction.userId,
    cryptocurrencyId: transaction.cryptocurrencyId,
    type: transaction.type,
    quantity: transaction.quantity.toString(),
    unitPriceBRL: transaction.unitPriceBRL.toString(),
    totalBRL: transaction.totalBRL.toString(),
    counterpartyUserId: transaction.counterpartyUserId,
    createdAt: transaction.createdAt,
    cryptocurrency: {
      id: transaction.cryptocurrency.id,
      name: transaction.cryptocurrency.name,
      symbol: transaction.cryptocurrency.symbol,
      imageUrl: transaction.cryptocurrency.imageUrl,
      currentPrice: transaction.cryptocurrency.currentPrice.toString(),
      categoryUid: transaction.cryptocurrency.categoryUid,
    },
  };
}
