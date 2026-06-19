import { ConflictException, NotFoundException } from '@nestjs/common';
import { CryptocurrenciesService } from './cryptocurrencies.service';

const prisma = {
  cryptocurrency: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  walletHolding: {
    count: jest.fn(),
  },
  transaction: {
    count: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('CryptocurrenciesService', () => {
  let service: CryptocurrenciesService;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.$transaction.mockImplementation((operations) =>
      Promise.all(operations),
    );
    service = new CryptocurrenciesService(prisma as never);
  });

  it('creates a cryptocurrency with normalized symbol and initial supply', async () => {
    prisma.cryptocurrency.findUnique.mockResolvedValue(null);
    prisma.cryptocurrency.create.mockImplementation(({ data }) =>
      Promise.resolve({ id: 'crypto-1', ...data }),
    );

    const cryptocurrency = await service.create(
      {
        name: 'Solana',
        symbol: ' sol ',
        description: 'Fast chain',
        imageUrl: 'https://example.com/sol.png',
        initialPrice: 100,
        quantity: 500,
        categoryUid: 'defi',
      },
      'admin-1',
    );

    expect(cryptocurrency.symbol).toBe('SOL');
    expect(prisma.cryptocurrency.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        symbol: 'SOL',
        initialPrice: 100,
        currentPrice: 100,
        totalSupply: 500,
        availableSupply: 500,
        createdById: 'admin-1',
      }),
    });
  });

  it('blocks duplicated symbols on create', async () => {
    prisma.cryptocurrency.findUnique.mockResolvedValue({ id: 'crypto-1' });

    await expect(
      service.create(
        {
          name: 'Solana',
          symbol: 'SOL',
          description: 'Fast chain',
          imageUrl: 'https://example.com/sol.png',
          initialPrice: 100,
          quantity: 500,
          categoryUid: 'defi',
        },
        'admin-1',
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('lists cryptocurrencies with search, category and pagination', async () => {
    prisma.cryptocurrency.findMany.mockResolvedValue([{ id: 'crypto-1' }]);
    prisma.cryptocurrency.count.mockResolvedValue(25);

    const result = await service.list({
      search: 'sol',
      categoryUid: 'defi',
      page: 2,
      pageSize: 10,
    });

    expect(result.meta).toEqual({
      page: 2,
      pageSize: 10,
      total: 25,
      totalPages: 3,
    });
    expect(prisma.cryptocurrency.findMany).toHaveBeenCalledWith({
      where: {
        AND: [
          { categoryUid: 'defi' },
          {
            OR: [
              { name: { contains: 'sol', mode: 'insensitive' } },
              { symbol: { contains: 'sol', mode: 'insensitive' } },
            ],
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      skip: 10,
      take: 10,
    });
  });

  it('throws when cryptocurrency is not found', async () => {
    prisma.cryptocurrency.findUnique.mockResolvedValue(null);

    await expect(service.findByIdOrThrow('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates editable fields and normalizes symbol', async () => {
    prisma.cryptocurrency.findUnique
      .mockResolvedValueOnce({ id: 'crypto-1' })
      .mockResolvedValueOnce(null);
    prisma.cryptocurrency.update.mockImplementation(({ data }) =>
      Promise.resolve({ id: 'crypto-1', ...data }),
    );

    const cryptocurrency = await service.update('crypto-1', {
      name: 'Updated',
      symbol: 'upd',
      initialPrice: 200,
      quantity: 300,
    });

    expect(cryptocurrency).toMatchObject({
      name: 'Updated',
      symbol: 'UPD',
      initialPrice: 200,
      currentPrice: 200,
      totalSupply: 300,
      availableSupply: 300,
    });
  });

  it('deletes cryptocurrencies without holdings or transactions', async () => {
    prisma.cryptocurrency.findUnique.mockResolvedValue({ id: 'crypto-1' });
    prisma.walletHolding.count.mockResolvedValue(0);
    prisma.transaction.count.mockResolvedValue(0);
    prisma.cryptocurrency.delete.mockResolvedValue({ id: 'crypto-1' });

    await service.delete('crypto-1');

    expect(prisma.cryptocurrency.delete).toHaveBeenCalledWith({
      where: { id: 'crypto-1' },
    });
  });

  it('blocks delete when cryptocurrency has movements', async () => {
    prisma.cryptocurrency.findUnique.mockResolvedValue({ id: 'crypto-1' });
    prisma.walletHolding.count.mockResolvedValue(1);
    prisma.transaction.count.mockResolvedValue(0);

    await expect(service.delete('crypto-1')).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
});
