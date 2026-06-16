import { User } from '@prisma/client';

export type SerializedUser = {
  id: string;
  email: string;
  fullName: string;
  age: number | null;
  photoUrl: string | null;
  role: User['role'];
  balanceBRL: string;
  createdAt: Date;
  updatedAt: Date;
};

export function serializeUser(user: User): SerializedUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    age: user.age,
    photoUrl: user.photoUrl,
    role: user.role,
    balanceBRL: user.balanceBRL.toString(),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
