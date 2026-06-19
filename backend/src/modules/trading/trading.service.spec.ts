import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';
import { TradingService } from './trading.service';

const tx = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  cryptocurrency: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  walletHolding: {
    findUnique: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn(),
  },
  transaction: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

const prisma = {
  $transaction: jest.fn(),
  transaction: {
    findMany: jest.fn(),
  },
};

const cryptocurrency = {
  id: 'crypto-1',
  name: 'Bitcoin',
  symbol: 'BTC',
  imageUrl: 'https://cdn.example.com/btc.svg',
  currentPrice: new Prisma.Decimal(10),
  availableSupply: new Prisma.Decimal(100),
  categoryUid: 'defi',
};

describe('TradingService', () => {
  let service: TradingService;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.$transaction.mockImplementation((callback) => callback(tx));
    tx.transaction.create.mockImplementation(({ data }) =>
      Promise.resolve({
        id: 'transaction-1',
        ...data,
        counterpartyUserId: null,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        cryptocurrency,
      }),
    );
    service = new TradingService(prisma as never);
  });

  it('buys cryptocurrency and updates balance, supply and holding', async () => {
    tx.user.findUnique.mockResolvedValue({
      id: 'user-1',
      balanceBRL: new Prisma.Decimal(100),
    });
    tx.cryptocurrency.findUnique.mockResolvedValue(cryptocurrency);

    const result = await service.buy('user-1', {
      cryptocurrencyId: 'crypto-1',
      quantity: 2,
    });

    expect(tx.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { balanceBRL: { decrement: new Prisma.Decimal(20) } },
    });
    expect(tx.cryptocurrency.update).toHaveBeenCalledWith({
      where: { id: 'crypto-1' },
      data: { availableSupply: { decrement: new Prisma.Decimal(2) } },
    });
    expect(tx.walletHolding.upsert).toHaveBeenCalled();
    expect(result).toMatchObject({
      id: 'transaction-1',
      type: TransactionType.BUY,
      quantity: '2',
      totalBRL: '20',
    });
  });

  it('rejects buy when user balance is insufficient', async () => {
    tx.user.findUnique.mockResolvedValue({
      id: 'user-1',
      balanceBRL: new Prisma.Decimal(1),
    });
    tx.cryptocurrency.findUnique.mockResolvedValue(cryptocurrency);

    await expect(
      service.buy('user-1', { cryptocurrencyId: 'crypto-1', quantity: 2 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects buy when cryptocurrency does not exist', async () => {
    tx.user.findUnique.mockResolvedValue({
      id: 'user-1',
      balanceBRL: new Prisma.Decimal(100),
    });
    tx.cryptocurrency.findUnique.mockResolvedValue(null);

    await expect(
      service.buy('user-1', { cryptocurrencyId: 'missing', quantity: 1 }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('sells cryptocurrency and updates balance, supply and holding', async () => {
    tx.cryptocurrency.findUnique.mockResolvedValue(cryptocurrency);
    tx.walletHolding.findUnique.mockResolvedValue({
      id: 'holding-1',
      quantity: new Prisma.Decimal(5),
      totalInvestedBRL: new Prisma.Decimal(50),
    });

    const result = await service.sell('user-1', {
      cryptocurrencyId: 'crypto-1',
      quantity: 2,
    });

    expect(tx.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { balanceBRL: { increment: new Prisma.Decimal(20) } },
    });
    expect(tx.walletHolding.update).toHaveBeenCalledWith({
      where: { id: 'holding-1' },
      data: {
        quantity: { decrement: new Prisma.Decimal(2) },
        totalInvestedBRL: { decrement: new Prisma.Decimal(20) },
      },
    });
    expect(result).toMatchObject({
      type: TransactionType.SELL,
      quantity: '2',
      totalBRL: '20',
    });
  });

  it('rejects sell when holding quantity is insufficient', async () => {
    tx.cryptocurrency.findUnique.mockResolvedValue(cryptocurrency);
    tx.walletHolding.findUnique.mockResolvedValue({
      quantity: new Prisma.Decimal(1),
    });

    await expect(
      service.sell('user-1', { cryptocurrencyId: 'crypto-1', quantity: 2 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lists serialized transactions', async () => {
    prisma.transaction.findMany.mockResolvedValue([
      {
        id: 'transaction-1',
        userId: 'user-1',
        cryptocurrencyId: 'crypto-1',
        type: TransactionType.BUY,
        quantity: new Prisma.Decimal(2),
        unitPriceBRL: new Prisma.Decimal(10),
        totalBRL: new Prisma.Decimal(20),
        counterpartyUserId: null,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        cryptocurrency,
      },
    ]);

    const result = await service.listTransactions('user-1');

    expect(prisma.transaction.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      include: { cryptocurrency: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    expect(result[0]).toMatchObject({
      id: 'transaction-1',
      quantity: '2',
      totalBRL: '20',
    });
  });
});
