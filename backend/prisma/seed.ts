import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL não configurada');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@earlybirds.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin123';
const ADMIN_FULL_NAME = process.env.ADMIN_FULL_NAME ?? 'Admin Early Birds';

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    create: {
      email: ADMIN_EMAIL,
      fullName: ADMIN_FULL_NAME,
      passwordHash,
      role: UserRole.ADMIN,
    },
    update: {
      fullName: ADMIN_FULL_NAME,
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  console.log(`Admin seed pronto: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
