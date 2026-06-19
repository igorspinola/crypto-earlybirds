import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DepositStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AsaasClient } from './asaas.client';
import { serializeDeposit } from './deposit.serializer';
import { AsaasWebhookDto } from './dto/asaas-webhook.dto';
import { CreateDepositDto } from './dto/create-deposit.dto';

@Injectable()
export class DepositsService {
  constructor(
    private readonly asaasClient: AsaasClient,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async create(userId: string, dto: CreateDepositDto) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    const payment = await this.asaasClient.createPayment(dto, user);
    const deposit = await this.prisma.deposit.create({
      data: {
        userId,
        amountBRL: new Prisma.Decimal(dto.amountBRL),
        method: dto.method,
        asaasPaymentId: payment.asaasPaymentId,
        asaasInvoiceUrl: payment.asaasInvoiceUrl,
        pixQrCode: payment.pixQrCode,
      },
    });

    return serializeDeposit(deposit);
  }

  async list(userId: string) {
    const deposits = await this.prisma.deposit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return deposits.map(serializeDeposit);
  }

  async confirm(depositId: string) {
    const deposit = await this.markAsPaid({ id: depositId });

    return serializeDeposit(deposit);
  }

  async handleWebhook(dto: AsaasWebhookDto, accessToken?: string) {
    this.validateWebhookToken(accessToken);

    if (!this.isPaidStatus(dto.payment.status)) {
      return;
    }

    await this.markAsPaid({ asaasPaymentId: dto.payment.id });
  }

  private async markAsPaid(where: { id?: string; asaasPaymentId?: string }) {
    const deposit = await this.prisma.deposit.findFirst({ where });

    if (!deposit) {
      throw new NotFoundException('Depósito não encontrado');
    }

    if (deposit.status === DepositStatus.PAID) {
      return deposit;
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedDeposit = await tx.deposit.update({
        where: { id: deposit.id },
        data: {
          status: DepositStatus.PAID,
          paidAt: new Date(),
        },
      });

      await tx.user.update({
        where: { id: deposit.userId },
        data: { balanceBRL: { increment: deposit.amountBRL } },
      });

      return updatedDeposit;
    });
  }

  private validateWebhookToken(token?: string) {
    const expectedToken = this.configService.get<string>('ASAAS_WEBHOOK_TOKEN');

    if (!expectedToken) return;

    if (token !== expectedToken) {
      throw new BadRequestException('Webhook inválido');
    }
  }

  private isPaidStatus(status: string) {
    return ['CONFIRMED', 'RECEIVED', 'RECEIVED_IN_CASH'].includes(status);
  }
}
