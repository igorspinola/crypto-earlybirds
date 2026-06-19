import { UserRole } from '@prisma/client';
import { CryptocurrenciesController } from './cryptocurrencies.controller';

const cryptocurrenciesService = {
  create: jest.fn(),
  list: jest.fn(),
  findByIdOrThrow: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const cryptocurrency = {
  id: 'crypto-1',
  name: 'Solana',
  symbol: 'SOL',
  description: 'Fast chain',
  imageUrl: 'https://example.com/sol.png',
  initialPrice: { toString: () => '100' },
  currentPrice: { toString: () => '100' },
  totalSupply: { toString: () => '500' },
  availableSupply: { toString: () => '500' },
  categoryUid: 'defi',
  createdById: 'admin-1',
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
};

describe('CryptocurrenciesController', () => {
  let controller: CryptocurrenciesController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new CryptocurrenciesController(
      cryptocurrenciesService as never,
    );
  });

  it('creates a cryptocurrency as admin', async () => {
    cryptocurrenciesService.create.mockResolvedValue(cryptocurrency);

    const dto = {
      name: 'Solana',
      symbol: 'SOL',
      description: 'Fast chain',
      imageUrl: 'https://example.com/sol.png',
      initialPrice: 100,
      quantity: 500,
      categoryUid: 'defi',
    };
    const result = await controller.create(dto, {
      userId: 'admin-1',
      email: 'admin@email.com',
      role: UserRole.ADMIN,
    });

    expect(result.symbol).toBe('SOL');
    expect(cryptocurrenciesService.create).toHaveBeenCalledWith(dto, 'admin-1');
  });

  it('lists serialized cryptocurrencies', async () => {
    cryptocurrenciesService.list.mockResolvedValue({
      items: [cryptocurrency],
      meta: { page: 1, pageSize: 24, total: 1, totalPages: 1 },
    });

    const result = await controller.list({ search: 'sol' });

    expect(result.items).toEqual([
      expect.objectContaining({
        id: 'crypto-1',
        initialPrice: '100',
      }),
    ]);
    expect(result.meta.total).toBe(1);
  });

  it('returns one cryptocurrency', async () => {
    cryptocurrenciesService.findByIdOrThrow.mockResolvedValue(cryptocurrency);

    const result = await controller.findOne('crypto-1');

    expect(result.id).toBe('crypto-1');
    expect(cryptocurrenciesService.findByIdOrThrow).toHaveBeenCalledWith(
      'crypto-1',
    );
  });

  it('updates a cryptocurrency', async () => {
    cryptocurrenciesService.update.mockResolvedValue({
      ...cryptocurrency,
      name: 'Updated Solana',
    });

    const result = await controller.update('crypto-1', {
      name: 'Updated Solana',
    });

    expect(result.name).toBe('Updated Solana');
    expect(cryptocurrenciesService.update).toHaveBeenCalledWith('crypto-1', {
      name: 'Updated Solana',
    });
  });

  it('deletes a cryptocurrency', async () => {
    await controller.delete('crypto-1');

    expect(cryptocurrenciesService.delete).toHaveBeenCalledWith('crypto-1');
  });
});
