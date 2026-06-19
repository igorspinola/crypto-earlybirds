import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { RolesGuard } from './roles.guard';

const reflector = {
  getAllAndOverride: jest.fn(),
};

function createContext(user?: { role: UserRole }) {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  };
}

describe('RolesGuard', () => {
  let guard: RolesGuard;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new RolesGuard(reflector as never);
  });

  it('allows routes without role metadata', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    expect(guard.canActivate(createContext() as never)).toBe(true);
  });

  it('allows users with required role', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);

    expect(
      guard.canActivate(createContext({ role: UserRole.ADMIN }) as never),
    ).toBe(true);
  });

  it('blocks users without required role', () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);

    expect(() =>
      guard.canActivate(createContext({ role: UserRole.TRADER }) as never),
    ).toThrow(ForbiddenException);
  });
});
