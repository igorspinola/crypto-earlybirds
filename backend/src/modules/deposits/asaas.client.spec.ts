import { ConfigService } from '@nestjs/config';
import { DepositMethod, Prisma, UserRole } from '@prisma/client';
import { AsaasClient } from './asaas.client';

const user = {
  id: 'user-123',
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

describe('AsaasClient', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns mock payment data when Asaas API key is not configured', async () => {
    const configService = {
      get: jest.fn().mockReturnValue(undefined),
    };
    const client = new AsaasClient(configService as unknown as ConfigService);

    const result = await client.createPayment(
      {
        amountBRL: 100,
        method: DepositMethod.PIX,
      },
      user,
    );

    expect(result.asaasPaymentId).toMatch(/^mock_/);
    expect(result.asaasInvoiceUrl).toContain('https://sandbox.asaas.com/i/');
    expect(result.pixQrCode).toMatch(/^pix-mock_/);
  });

  it('creates customer, payment and pix qr code using Asaas API', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'cus_123' }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: 'pay_123',
            invoiceUrl: 'https://sandbox.asaas.com/i/pay_123',
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ payload: 'pix-copy-paste' }), {
          status: 200,
        }),
      );
    global.fetch = fetchMock as unknown as typeof fetch;
    const configService = {
      get: jest.fn((key: string) => {
        if (key === 'ASAAS_API_KEY') return 'test-api-key';
        if (key === 'ASAAS_BASE_URL') return 'https://api-sandbox.asaas.com/v3';

        return undefined;
      }),
    };
    const client = new AsaasClient(configService as unknown as ConfigService);

    const result = await client.createPayment(
      {
        amountBRL: 125.5,
        method: DepositMethod.PIX,
      },
      user,
    );

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://api-sandbox.asaas.com/v3/customers',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          access_token: 'test-api-key',
          'Content-Type': 'application/json',
        }),
      }),
    );
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      name: 'Trader Test',
      email: 'trader@example.com',
      externalReference: 'user-123',
      notificationDisabled: true,
    });
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toMatchObject({
      customer: 'cus_123',
      billingType: DepositMethod.PIX,
      value: 125.5,
      description: 'Depósito de saldo Early Birds',
    });
    expect(fetchMock.mock.calls[2][0]).toBe(
      'https://api-sandbox.asaas.com/v3/payments/pay_123/pixQrCode',
    );
    expect(result).toEqual({
      asaasPaymentId: 'pay_123',
      asaasInvoiceUrl: 'https://sandbox.asaas.com/i/pay_123',
      pixQrCode: 'pix-copy-paste',
    });
  });

  it('does not request pix qr code for boleto payments', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'cus_123' }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: 'pay_123',
            bankSlipUrl: 'https://sandbox.asaas.com/b/pay_123',
          }),
          { status: 200 },
        ),
      );
    global.fetch = fetchMock as unknown as typeof fetch;
    const configService = {
      get: jest.fn((key: string) => {
        if (key === 'ASAAS_API_KEY') return 'test-api-key';
        if (key === 'ASAAS_BASE_URL') return 'https://api-sandbox.asaas.com/v3';

        return undefined;
      }),
    };
    const client = new AsaasClient(configService as unknown as ConfigService);

    const result = await client.createPayment(
      {
        amountBRL: 100,
        method: DepositMethod.BOLETO,
      },
      user,
    );

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result).toMatchObject({
      asaasPaymentId: 'pay_123',
      asaasInvoiceUrl: 'https://sandbox.asaas.com/b/pay_123',
      pixQrCode: null,
    });
  });
});
