import { UserRole } from '@prisma/client';
import { UsersController } from './users.controller';

const usersService = {
  findByIdOrThrow: jest.fn(),
  createTrader: jest.fn(),
};

const user = {
  id: 'user-1',
  email: 'trader@email.com',
  fullName: 'Trader',
  age: 20,
  photoUrl: null,
  role: UserRole.TRADER,
  balanceBRL: { toString: () => '0' },
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new UsersController(usersService as never);
  });

  it('returns authenticated user profile', async () => {
    usersService.findByIdOrThrow.mockResolvedValue(user);

    const result = await controller.me({
      userId: 'user-1',
      email: 'trader@email.com',
      role: UserRole.TRADER,
    });

    expect(result).toMatchObject({
      id: 'user-1',
      email: 'trader@email.com',
      balanceBRL: '0',
    });
  });

  it('creates a trader', async () => {
    usersService.createTrader.mockResolvedValue(user);

    const result = await controller.createTrader({
      fullName: 'Trader',
      email: 'trader@email.com',
      password: 'secret123',
    });

    expect(result.role).toBe(UserRole.TRADER);
    expect(usersService.createTrader).toHaveBeenCalledWith({
      fullName: 'Trader',
      email: 'trader@email.com',
      password: 'secret123',
    });
  });
});
