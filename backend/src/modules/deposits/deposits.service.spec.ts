import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DepositMethod, DepositStatus, Prisma, UserRole } from '@prisma/client';
import { DepositsService } from './deposits.service';

const asaasClient = {
  createPayment: jest.fn(),
};

const configService = {
  get: jest.fn(),
};

const tx = {
  deposit: {
    update: jest.fn(),
  },
  user: {
    update: jest.fn(),
  },
};

const prisma = {
  user: {
    findUniqueOrThrow: jest.fn(),
  },
  deposit: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
  },
  $transaction: jest.fn(),
};

const user = {
  id: 'user-1',
  email: 'trader@example.com',
  passwordHash: 'hash',
  fullName: 'Trader Test',
  age: null,
  photoUrl: null,
  role: UserRole.TRADER,
  balanceBRL: new Prisma.Decimal(0),
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
};

const pendingDeposit = {
  id: 'deposit-1',
  userId: 'user-1',
  amountBRL: new Prisma.Decimal(100),
  method: DepositMethod.PIX,
  status: DepositStatus.PENDING,
  asaasPaymentId: 'pay-1',
  asaasInvoiceUrl: 'https://sandbox.asaas.com/i/pay-1',
  pixQrCode: 'pix-code',
  paidAt: null,
  createdAt: new Date('2026-01-01T00:00:00Z'),
};

describe('DepositsService', () => {
  let service: DepositsService;

  beforeEach(() => {
    jest.clearAllMocks();
    configService.get.mockReturnValue(undefined);
    prisma.user.findUniqueOrThrow.mockResolvedValue(user);
    prisma.$transaction.mockImplementation((callback) => callback(tx));
    service = new DepositsService(
      asaasClient as never,
      configService as never,
      prisma as never,
    );
  });

  it('creates a pending deposit with Asaas payment data', async () => {
    asaasClient.createPayment.mockResolvedValue({
      asaasPaymentId: 'pay-1',
      asaasInvoiceUrl: 'https://sandbox.asaas.com/i/pay-1',
      pixQrCode: 'pix-code',
    });
    prisma.deposit.create.mockResolvedValue(pendingDeposit);

    const result = await service.create('user-1', {
      amountBRL: 100,
      method: DepositMethod.PIX,
    });

    expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: 'user-1' },
    });
    expect(asaasClient.createPayment).toHaveBeenCalledWith(
      {
        amountBRL: 100,
        method: DepositMethod.PIX,
      },
      user,
    );
    expect(prisma.deposit.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        amountBRL: new Prisma.Decimal(100),
        method: DepositMethod.PIX,
        asaasPaymentId: 'pay-1',
        asaasInvoiceUrl: 'https://sandbox.asaas.com/i/pay-1',
        pixQrCode: 'pix-code',
      },
    });
    expect(result).toMatchObject({
      id: 'deposit-1',
      amountBRL: '100',
      status: DepositStatus.PENDING,
    });
  });

  it('lists user deposits', async () => {
    prisma.deposit.findMany.mockResolvedValue([pendingDeposit]);

    const result = await service.list('user-1');

    expect(prisma.deposit.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    expect(result[0]).toMatchObject({
      id: 'deposit-1',
      amountBRL: '100',
    });
  });

  it('marks a pending deposit as paid and credits the user balance', async () => {
    const paidDeposit = {
      ...pendingDeposit,
      status: DepositStatus.PAID,
      paidAt: new Date('2026-01-01T00:01:00Z'),
    };
    prisma.deposit.findFirst.mockResolvedValue(pendingDeposit);
    tx.deposit.update.mockResolvedValue(paidDeposit);

    const result = await service.confirm('deposit-1');

    expect(tx.deposit.update).toHaveBeenCalledWith({
      where: { id: 'deposit-1' },
      data: {
        status: DepositStatus.PAID,
        paidAt: expect.any(Date),
      },
    });
    expect(tx.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { balanceBRL: { increment: pendingDeposit.amountBRL } },
    });
    expect(result.status).toBe(DepositStatus.PAID);
  });

  it('does not credit balance twice for an already paid deposit', async () => {
    prisma.deposit.findFirst.mockResolvedValue({
      ...pendingDeposit,
      status: DepositStatus.PAID,
    });

    await service.confirm('deposit-1');

    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(tx.user.update).not.toHaveBeenCalled();
  });

  it('throws when confirming a missing deposit', async () => {
    prisma.deposit.findFirst.mockResolvedValue(null);

    await expect(service.confirm('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('validates webhook token when configured', async () => {
    configService.get.mockReturnValue('expected-token');

    await expect(
      service.handleWebhook(
        {
          event: 'PAYMENT_CONFIRMED',
          payment: { id: 'pay-1', status: 'CONFIRMED' },
        },
        'wrong-token',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('accepts webhook with matching access token header', async () => {
    configService.get.mockReturnValue('expected-token');
    prisma.deposit.findFirst.mockResolvedValue(pendingDeposit);
    tx.deposit.update.mockResolvedValue({
      ...pendingDeposit,
      status: DepositStatus.PAID,
    });

    await service.handleWebhook(
      {
        event: 'PAYMENT_CONFIRMED',
        payment: { id: 'pay-1', status: 'CONFIRMED' },
      },
      'expected-token',
    );

    expect(tx.user.update).toHaveBeenCalled();
  });

  it('marks deposit as paid from Asaas webhook paid status', async () => {
    prisma.deposit.findFirst.mockResolvedValue(pendingDeposit);
    tx.deposit.update.mockResolvedValue({
      ...pendingDeposit,
      status: DepositStatus.PAID,
    });

    await service.handleWebhook({
      event: 'PAYMENT_CONFIRMED',
      payment: { id: 'pay-1', status: 'CONFIRMED' },
    });

    expect(prisma.deposit.findFirst).toHaveBeenCalledWith({
      where: { asaasPaymentId: 'pay-1' },
    });
    expect(tx.user.update).toHaveBeenCalled();
  });

  it('ignores unpaid webhook statuses', async () => {
    await service.handleWebhook({
      event: 'PAYMENT_CREATED',
      payment: { id: 'pay-1', status: 'PENDING' },
    });

    expect(prisma.deposit.findFirst).not.toHaveBeenCalled();
  });
});
