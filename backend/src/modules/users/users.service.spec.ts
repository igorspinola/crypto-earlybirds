import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { UsersService } from './users.service';

const prisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UsersService(prisma as never);
  });

  it('finds a user by normalized email', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });

    await service.findByEmail('TRADER@EMAIL.COM');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'trader@email.com' },
    });
  });

  it('throws when user is not found by id', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.findByIdOrThrow('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('creates a trader with normalized email and hashed password', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockImplementation(({ data }) =>
      Promise.resolve({ id: 'user-1', ...data }),
    );

    const user = await service.createTrader({
      fullName: 'Grace Hopper',
      email: 'GRACE@EMAIL.COM',
      password: 'secret123',
      age: 37,
      photoUrl: 'https://example.com/grace.png',
    });

    expect(user.email).toBe('grace@email.com');
    expect(user.role).toBe(UserRole.TRADER);
    expect(user.passwordHash).not.toBe('secret123');
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'grace@email.com',
        fullName: 'Grace Hopper',
        role: UserRole.TRADER,
      }),
    });
  });

  it('blocks duplicated trader email', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'existing-user' });

    await expect(
      service.createTrader({
        fullName: 'Grace Hopper',
        email: 'grace@email.com',
        password: 'secret123',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
