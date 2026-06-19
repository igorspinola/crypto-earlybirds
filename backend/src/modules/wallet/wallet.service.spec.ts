import { Prisma } from '@prisma/client';
import { WalletService } from './wallet.service';

const prisma = {
  user: {
    findUniqueOrThrow: jest.fn(),
  },
  walletHolding: {
    findMany: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('WalletService', () => {
  let service: WalletService;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.$transaction.mockImplementation((queries) => Promise.all(queries));
    service = new WalletService(prisma as never);
  });

  it('returns balance, holdings and total wallet value', async () => {
    prisma.user.findUniqueOrThrow.mockResolvedValue({
      balanceBRL: new Prisma.Decimal(100),
    });
    prisma.walletHolding.findMany.mockResolvedValue([
      {
        id: 'holding-1',
        userId: 'user-1',
        cryptocurrencyId: 'crypto-1',
        quantity: new Prisma.Decimal(2),
        totalInvestedBRL: new Prisma.Decimal(50),
        updatedAt: new Date('2026-01-01T00:00:00Z'),
        cryptocurrency: {
          id: 'crypto-1',
          name: 'Bitcoin',
          symbol: 'BTC',
          imageUrl: 'https://cdn.example.com/btc.svg',
          currentPrice: new Prisma.Decimal(40),
          categoryUid: 'defi',
        },
      },
    ]);

    const result = await service.getWallet('user-1');

    expect(result.balanceBRL).toBe('100');
    expect(result.holdingsValueBRL).toBe('80');
    expect(result.totalValueBRL).toBe('180');
    expect(result.holdings[0]).toMatchObject({
      cryptocurrencyId: 'crypto-1',
      quantity: '2',
      totalInvestedBRL: '50',
      averagePriceBRL: '25',
      currentValueBRL: '80',
    });
  });
});
