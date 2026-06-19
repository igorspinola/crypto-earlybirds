import type { ApiDeposit, ApiTransaction, ApiWallet } from "./api";

export type PortfolioPoint = {
  date: string;
  value: number;
};

type Event =
  | { kind: "DEPOSIT"; at: string; amount: number }
  | {
      kind: "BUY" | "SELL";
      at: string;
      cryptocurrencyId: string;
      quantity: number;
      unitPrice: number;
      total: number;
    };

export function buildPortfolioSnapshot(
  wallet: ApiWallet,
  deposits: ApiDeposit[],
  transactions: ApiTransaction[],
): PortfolioPoint[] {
  const events = collectEvents(deposits, transactions);

  if (events.length === 0) {
    return [];
  }

  events.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());

  let balance = 0;
  const holdings = new Map<string, { qty: number; lastPrice: number }>();
  const points: PortfolioPoint[] = [];

  points.push({ date: events[0].at, value: 0 });

  for (const event of events) {
    if (event.kind === "DEPOSIT") {
      balance += event.amount;
    } else {
      const position = holdings.get(event.cryptocurrencyId) ?? {
        qty: 0,
        lastPrice: event.unitPrice,
      };
      if (event.kind === "BUY") {
        balance -= event.total;
        position.qty += event.quantity;
      } else {
        balance += event.total;
        position.qty -= event.quantity;
      }
      position.lastPrice = event.unitPrice;
      holdings.set(event.cryptocurrencyId, position);
    }

    points.push({ date: event.at, value: balance + valuateHoldings(holdings) });
  }

  const nowValue = Number(wallet.totalValueBRL);
  if (Number.isFinite(nowValue)) {
    points.push({ date: new Date().toISOString(), value: nowValue });
  }

  return points;
}

function collectEvents(
  deposits: ApiDeposit[],
  transactions: ApiTransaction[],
): Event[] {
  const events: Event[] = [];

  for (const deposit of deposits) {
    if (deposit.status !== "PAID" || !deposit.paidAt) continue;
    events.push({
      kind: "DEPOSIT",
      at: deposit.paidAt,
      amount: Number(deposit.amountBRL),
    });
  }

  for (const transaction of transactions) {
    events.push({
      kind: transaction.type,
      at: transaction.createdAt,
      cryptocurrencyId: transaction.cryptocurrencyId,
      quantity: Number(transaction.quantity),
      unitPrice: Number(transaction.unitPriceBRL),
      total: Number(transaction.totalBRL),
    });
  }

  return events;
}

function valuateHoldings(
  holdings: Map<string, { qty: number; lastPrice: number }>,
) {
  let total = 0;
  for (const { qty, lastPrice } of holdings.values()) {
    total += qty * lastPrice;
  }
  return total;
}
