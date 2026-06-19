import { UserRole } from '@prisma/client';
import { Response } from 'express';
import { AuthController } from './auth.controller';

const authService = {
  login: jest.fn(),
  register: jest.fn(),
  getJwtCookieMaxAge: jest.fn(),
  requestPasswordReset: jest.fn(),
  resetPassword: jest.fn(),
};

const configService = {
  get: jest.fn(),
};

const usersService = {
  findByIdOrThrow: jest.fn(),
};

const response = {
  cookie: jest.fn(),
  clearCookie: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(() => {
    jest.clearAllMocks();
    authService.getJwtCookieMaxAge.mockReturnValue(604_800_000);
    configService.get.mockReturnValue('development');
    controller = new AuthController(
      authService as never,
      configService as never,
      usersService as never,
    );
  });

  it('logs in and sets auth cookie', async () => {
    authService.login.mockResolvedValue({
      accessToken: 'access-token',
      user: { id: 'user-1', role: UserRole.ADMIN },
    });

    const result = await controller.login(
      { email: 'admin@email.com', password: 'secret123' },
      response as unknown as Response,
    );

    expect(result).toEqual({ user: { id: 'user-1', role: UserRole.ADMIN } });
    expect(response.cookie).toHaveBeenCalledWith(
      'access_token',
      'access-token',
      {
        httpOnly: true,
        maxAge: 604_800_000,
        path: '/',
        sameSite: 'lax',
        secure: false,
      },
    );
  });

  it('registers a trader and sets auth cookie', async () => {
    authService.register.mockResolvedValue({
      accessToken: 'access-token',
      user: { id: 'user-1', role: UserRole.TRADER },
    });

    const dto = {
      fullName: 'Ada Lovelace',
      email: 'ada@email.com',
      password: 'secret123',
      age: 28,
      photoUrl: 'https://cdn.example.com/ada.png',
    };

    const result = await controller.register(
      dto,
      response as unknown as Response,
    );

    expect(authService.register).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ user: { id: 'user-1', role: UserRole.TRADER } });
    expect(response.cookie).toHaveBeenCalledWith(
      'access_token',
      'access-token',
      {
        httpOnly: true,
        maxAge: 604_800_000,
        path: '/',
        sameSite: 'lax',
        secure: false,
      },
    );
  });

  it('clears auth cookie on logout', () => {
    controller.logout(response as unknown as Response);

    expect(response.clearCookie).toHaveBeenCalledWith('access_token', {
      path: '/',
    });
  });

  it('returns current user', async () => {
    usersService.findByIdOrThrow.mockResolvedValue({
      id: 'user-1',
      email: 'admin@email.com',
      fullName: 'Admin',
      age: null,
      photoUrl: null,
      role: UserRole.ADMIN,
      balanceBRL: { toString: () => '0' },
      createdAt: new Date('2026-01-01T00:00:00Z'),
      updatedAt: new Date('2026-01-01T00:00:00Z'),
    });

    const result = await controller.me({
      userId: 'user-1',
      email: 'admin@email.com',
      role: UserRole.ADMIN,
    });

    expect(result).toMatchObject({
      id: 'user-1',
      email: 'admin@email.com',
      balanceBRL: '0',
    });
  });

  it('requests password reset', async () => {
    await controller.forgotPassword({ email: 'user@email.com' });

    expect(authService.requestPasswordReset).toHaveBeenCalledWith(
      'user@email.com',
    );
  });

  it('resets password', async () => {
    await controller.resetPassword({
      token: 'token',
      password: 'new-secret',
    });

    expect(authService.resetPassword).toHaveBeenCalledWith(
      'token',
      'new-secret',
    );
  });
});
