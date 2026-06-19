import { Deposit } from '@prisma/client';

export function serializeDeposit(deposit: Deposit) {
  return {
    id: deposit.id,
    userId: deposit.userId,
    amountBRL: deposit.amountBRL.toString(),
    method: deposit.method,
    status: deposit.status,
    asaasPaymentId: deposit.asaasPaymentId,
    asaasInvoiceUrl: deposit.asaasInvoiceUrl,
    pixQrCode: deposit.pixQrCode,
    paidAt: deposit.paidAt,
    createdAt: deposit.createdAt,
  };
}
