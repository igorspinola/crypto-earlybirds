import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { serializeHolding } from './wallet.serializer';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getWallet(userId: string) {
    const [user, holdings] = await this.prisma.$transaction([
      this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { balanceBRL: true },
      }),
      this.prisma.walletHolding.findMany({
        where: {
          userId,
          quantity: { gt: 0 },
        },
        include: { cryptocurrency: true },
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    const serializedHoldings = holdings.map(serializeHolding);
    const holdingsValueBRL = holdings.reduce(
      (total, holding) =>
        total.add(holding.quantity.mul(holding.cryptocurrency.currentPrice)),
      new Prisma.Decimal(0),
    );

    return {
      balanceBRL: user.balanceBRL.toString(),
      holdingsValueBRL: holdingsValueBRL.toString(),
      totalValueBRL: user.balanceBRL.add(holdingsValueBRL).toString(),
      holdings: serializedHoldings,
    };
  }
}
