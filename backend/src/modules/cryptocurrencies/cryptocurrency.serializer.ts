import { Cryptocurrency } from '@prisma/client';

export type SerializedCryptocurrency = {
  id: string;
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  initialPrice: string;
  currentPrice: string;
  totalSupply: string;
  availableSupply: string;
  categoryUid: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
};

export function serializeCryptocurrency(
  cryptocurrency: Cryptocurrency,
): SerializedCryptocurrency {
  return {
    id: cryptocurrency.id,
    name: cryptocurrency.name,
    symbol: cryptocurrency.symbol,
    description: cryptocurrency.description,
    imageUrl: cryptocurrency.imageUrl,
    initialPrice: cryptocurrency.initialPrice.toString(),
    currentPrice: cryptocurrency.currentPrice.toString(),
    totalSupply: cryptocurrency.totalSupply.toString(),
    availableSupply: cryptocurrency.availableSupply.toString(),
    categoryUid: cryptocurrency.categoryUid,
    createdById: cryptocurrency.createdById,
    createdAt: cryptocurrency.createdAt,
    updatedAt: cryptocurrency.updatedAt,
  };
}
