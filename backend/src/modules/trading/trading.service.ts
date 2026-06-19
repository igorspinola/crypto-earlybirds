import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BuyCryptocurrencyDto } from './dto/buy-cryptocurrency.dto';
import { SellCryptocurrencyDto } from './dto/sell-cryptocurrency.dto';
import { serializeTransaction } from './transaction.serializer';

@Injectable()
export class TradingService {
  constructor(private readonly prisma: PrismaService) {}

  async buy(userId: string, dto: BuyCryptocurrencyDto) {
    const transaction = await this.prisma.$transaction(async (tx) => {
      const [user, cryptocurrency] = await Promise.all([
        tx.user.findUnique({ where: { id: userId } }),
        tx.cryptocurrency.findUnique({
          where: { id: dto.cryptocurrencyId },
        }),
      ]);

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      if (!cryptocurrency) {
        throw new NotFoundException('Criptomoeda não encontrada');
      }

      const quantity = this.toDecimal(dto.quantity);
      const totalBRL = quantity.mul(cryptocurrency.currentPrice);

      if (cryptocurrency.availableSupply.lt(quantity)) {
        throw new BadRequestException('Quantidade indisponível para compra');
      }

      if (user.balanceBRL.lt(totalBRL)) {
        throw new BadRequestException('Saldo insuficiente');
      }

      await tx.user.update({
        where: { id: userId },
        data: { balanceBRL: { decrement: totalBRL } },
      });

      await tx.cryptocurrency.update({
        where: { id: cryptocurrency.id },
        data: { availableSupply: { decrement: quantity } },
      });

      await tx.walletHolding.upsert({
        where: {
          userId_cryptocurrencyId: {
            userId,
            cryptocurrencyId: cryptocurrency.id,
          },
        },
        create: {
          userId,
          cryptocurrencyId: cryptocurrency.id,
          quantity,
          totalInvestedBRL: totalBRL,
        },
        update: {
          quantity: { increment: quantity },
          totalInvestedBRL: { increment: totalBRL },
        },
      });

      return tx.transaction.create({
        data: {
          userId,
          cryptocurrencyId: cryptocurrency.id,
          type: TransactionType.BUY,
          quantity,
          unitPriceBRL: cryptocurrency.currentPrice,
          totalBRL,
        },
        include: { cryptocurrency: true },
      });
    });

    return serializeTransaction(transaction);
  }

  async sell(userId: string, dto: SellCryptocurrencyDto) {
    const transaction = await this.prisma.$transaction(async (tx) => {
      const cryptocurrency = await tx.cryptocurrency.findUnique({
        where: { id: dto.cryptocurrencyId },
      });

      if (!cryptocurrency) {
        throw new NotFoundException('Criptomoeda não encontrada');
      }

      const holding = await tx.walletHolding.findUnique({
        where: {
          userId_cryptocurrencyId: {
            userId,
            cryptocurrencyId: cryptocurrency.id,
          },
        },
      });

      const quantity = this.toDecimal(dto.quantity);

      if (!holding || holding.quantity.lt(quantity)) {
        throw new BadRequestException('Quantidade insuficiente na carteira');
      }

      const totalBRL = quantity.mul(cryptocurrency.currentPrice);
      const investedReduction = holding.quantity.isZero()
        ? this.toDecimal(0)
        : holding.totalInvestedBRL.mul(quantity).div(holding.quantity);

      await tx.user.update({
        where: { id: userId },
        data: { balanceBRL: { increment: totalBRL } },
      });

      await tx.cryptocurrency.update({
        where: { id: cryptocurrency.id },
        data: { availableSupply: { increment: quantity } },
      });

      await tx.walletHolding.update({
        where: { id: holding.id },
        data: {
          quantity: { decrement: quantity },
          totalInvestedBRL: { decrement: investedReduction },
        },
      });

      return tx.transaction.create({
        data: {
          userId,
          cryptocurrencyId: cryptocurrency.id,
          type: TransactionType.SELL,
          quantity,
          unitPriceBRL: cryptocurrency.currentPrice,
          totalBRL,
        },
        include: { cryptocurrency: true },
      });
    });

    return serializeTransaction(transaction);
  }

  async listTransactions(userId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
      include: { cryptocurrency: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return transactions.map(serializeTransaction);
  }

  private toDecimal(value: number) {
    return new Prisma.Decimal(value);
  }
}
