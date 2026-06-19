import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { CreateDepositDto } from './dto/create-deposit.dto';

type AsaasPayment = {
  asaasPaymentId: string;
  asaasInvoiceUrl: string;
  pixQrCode: string | null;
};

type AsaasCustomerResponse = {
  id: string;
};

type AsaasPaymentResponse = {
  id: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
};

type AsaasPixQrCodeResponse = {
  payload?: string;
  encodedImage?: string;
};

@Injectable()
export class AsaasClient {
  constructor(private readonly configService: ConfigService) {}

  async createPayment(
    dto: CreateDepositDto,
    user: User,
  ): Promise<AsaasPayment> {
    const baseUrl =
      this.configService.get<string>('ASAAS_BASE_URL') ??
      'https://api-sandbox.asaas.com/v3';
    const apiKey = this.configService.get<string>('ASAAS_API_KEY');

    if (!apiKey) {
      return this.createMockPayment(dto);
    }

    const customer = await this.createCustomer(baseUrl, apiKey, user);
    const payment = await this.createAsaasPayment(
      baseUrl,
      apiKey,
      dto,
      user,
      customer.id,
    );
    const pixQrCode =
      dto.method === 'PIX'
        ? await this.getPixQrCodePayload(baseUrl, apiKey, payment.id)
        : null;

    return {
      asaasPaymentId: payment.id,
      asaasInvoiceUrl:
        payment.invoiceUrl ??
        payment.bankSlipUrl ??
        `${baseUrl}/payments/${payment.id}`,
      pixQrCode,
    };
  }

  private async createCustomer(
    baseUrl: string,
    apiKey: string,
    user: User,
  ): Promise<AsaasCustomerResponse> {
    return this.request<AsaasCustomerResponse>(baseUrl, apiKey, '/customers', {
      method: 'POST',
      body: JSON.stringify({
        name: user.fullName,
        email: user.email,
        cpfCnpj: this.createSandboxCpf(user.id),
        externalReference: user.id,
        notificationDisabled: true,
      }),
    });
  }

  private async createAsaasPayment(
    baseUrl: string,
    apiKey: string,
    dto: CreateDepositDto,
    user: User,
    customerId: string,
  ): Promise<AsaasPaymentResponse> {
    return this.request<AsaasPaymentResponse>(baseUrl, apiKey, '/payments', {
      method: 'POST',
      body: JSON.stringify({
        customer: customerId,
        billingType: dto.method,
        value: dto.amountBRL,
        dueDate: this.createDueDate(),
        description: 'Depósito de saldo Early Birds',
        externalReference: `deposit:${user.id}:${Date.now()}`,
      }),
    });
  }

  private async getPixQrCodePayload(
    baseUrl: string,
    apiKey: string,
    paymentId: string,
  ) {
    const response = await this.request<AsaasPixQrCodeResponse>(
      baseUrl,
      apiKey,
      `/payments/${paymentId}/pixQrCode`,
      { method: 'GET' },
    );

    return response.payload ?? response.encodedImage ?? null;
  }

  private async request<T>(
    baseUrl: string,
    apiKey: string,
    path: string,
    init: RequestInit,
  ): Promise<T> {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        access_token: apiKey,
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
    });

    const body = await response.json().catch(() => undefined);

    if (response.ok) {
      return body as T;
    }

    throw new BadRequestException(this.getAsaasErrorMessage(body));
  }

  private getAsaasErrorMessage(body: unknown) {
    if (!this.isAsaasErrorBody(body)) {
      return 'Não foi possível criar a cobrança no Asaas';
    }

    return body.errors.map((error) => error.description).join(', ');
  }

  private isAsaasErrorBody(
    body: unknown,
  ): body is { errors: { description: string }[] } {
    return (
      typeof body === 'object' &&
      body !== null &&
      'errors' in body &&
      Array.isArray((body as { errors: unknown }).errors)
    );
  }

  private createDueDate() {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    return dueDate.toISOString().slice(0, 10);
  }

  private createSandboxCpf(seed: string) {
    const digits = seed
      .replace(/\D/g, '')
      .padEnd(9, '0')
      .slice(0, 9)
      .split('')
      .map(Number);
    const firstDigit = this.calculateCpfDigit(digits);
    const secondDigit = this.calculateCpfDigit([...digits, firstDigit]);

    return [...digits, firstDigit, secondDigit].join('');
  }

  private calculateCpfDigit(digits: number[]) {
    const startWeight = digits.length + 1;
    const sum = digits.reduce(
      (total, digit, index) => total + digit * (startWeight - index),
      0,
    );
    const rest = sum % 11;

    return rest < 2 ? 0 : 11 - rest;
  }

  private createMockPayment(dto: CreateDepositDto): AsaasPayment {
    const paymentId = `mock_${randomUUID()}`;

    return {
      asaasPaymentId: paymentId,
      asaasInvoiceUrl: `https://sandbox.asaas.com/i/${paymentId}`,
      pixQrCode: dto.method === 'PIX' ? `pix-${paymentId}` : null,
    };
  }
}
