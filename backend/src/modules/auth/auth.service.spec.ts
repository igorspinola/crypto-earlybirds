import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { AuthService } from './auth.service';

const configService = {
  get: jest.fn(),
};

const jwtService = {
  signAsync: jest.fn(),
};

const mailService = {
  sendPasswordReset: jest.fn(),
};

const prisma = {
  passwordResetToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  user: {
    update: jest.fn(),
  },
  $transaction: jest.fn(),
};

const usersService = {
  findByEmail: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    configService.get.mockReturnValue(undefined);
    jwtService.signAsync.mockResolvedValue('signed-token');
    prisma.$transaction.mockResolvedValue([]);
    service = new AuthService(
      configService as never,
      jwtService as never,
      mailService as never,
      prisma as never,
      usersService as never,
    );
  });

  it('logs in a valid user and returns a serialized user', async () => {
    const passwordHash = await bcrypt.hash('secret123', 10);
    usersService.findByEmail.mockResolvedValue({
      id: 'user-1',
      email: 'admin@email.com',
      passwordHash,
      fullName: 'Admin',
      age: null,
      photoUrl: null,
      role: UserRole.ADMIN,
      balanceBRL: { toString: () => '0' },
      createdAt: new Date('2026-01-01T00:00:00Z'),
      updatedAt: new Date('2026-01-01T00:00:00Z'),
    });

    const result = await service.login({
      email: 'admin@email.com',
      password: 'secret123',
    });

    expect(result.accessToken).toBe('signed-token');
    expect(result.user).toMatchObject({
      id: 'user-1',
      email: 'admin@email.com',
      role: UserRole.ADMIN,
    });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      userId: 'user-1',
      email: 'admin@email.com',
      role: UserRole.ADMIN,
    });
  });

  it('rejects login when user does not exist', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({ email: 'missing@email.com', password: 'secret123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects login when password does not match', async () => {
    usersService.findByEmail.mockResolvedValue({
      passwordHash: await bcrypt.hash('another-password', 10),
    });

    await expect(
      service.login({ email: 'admin@email.com', password: 'secret123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('does not reveal missing users on password reset request', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await service.requestPasswordReset('missing@email.com');

    expect(prisma.passwordResetToken.create).not.toHaveBeenCalled();
    expect(mailService.sendPasswordReset).not.toHaveBeenCalled();
  });

  it('creates a password reset token and sends email', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 'user-1',
      email: 'trader@email.com',
    });

    await service.requestPasswordReset('trader@email.com');

    expect(prisma.passwordResetToken.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'user-1',
        tokenHash: expect.any(String),
        expiresAt: expect.any(Date),
      }),
    });
    expect(mailService.sendPasswordReset).toHaveBeenCalledWith(
      'trader@email.com',
      expect.any(String),
    );
  });

  it('resets password with a valid token', async () => {
    const token = 'reset-token';
    const tokenHash = createHash('sha256').update(token).digest('hex');
    prisma.passwordResetToken.findUnique.mockResolvedValue({
      id: 'token-1',
      userId: 'user-1',
      tokenHash,
      expiresAt: new Date(Date.now() + 60_000),
      usedAt: null,
    });

    await service.resetPassword(token, 'new-secret');

    expect(prisma.passwordResetToken.findUnique).toHaveBeenCalledWith({
      where: { tokenHash },
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { passwordHash: expect.any(String) },
    });
    expect(prisma.passwordResetToken.update).toHaveBeenCalledWith({
      where: { id: 'token-1' },
      data: { usedAt: expect.any(Date) },
    });
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it('rejects expired password reset tokens', async () => {
    prisma.passwordResetToken.findUnique.mockResolvedValue({
      id: 'token-1',
      userId: 'user-1',
      expiresAt: new Date(Date.now() - 60_000),
      usedAt: null,
    });

    await expect(
      service.resetPassword('expired-token', 'new-secret'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('parses jwt cookie max age from config', () => {
    configService.get.mockReturnValue('2h');

    expect(service.getJwtCookieMaxAge()).toBe(2 * 60 * 60 * 1000);
  });
});
