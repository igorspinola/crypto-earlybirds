import { UserRole } from '@prisma/client';

export type AuthenticatedUser = {
  userId: string;
  email: string;
  role: UserRole;
};

export type JwtPayload = AuthenticatedUser;
