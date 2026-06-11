import { COINS, type Coin } from "./mock-coins";

const factors = [
  1, 1.08, 0.92, 1.15, 0.85, 1.22, 0.78, 1.05, 0.95, 1.18, 0.88, 1.33, 0.7,
  1.45, 0.6, 1.12,
];

export const GALLERY_COINS: Coin[] = factors.flatMap((f) =>
  COINS.map((c) => ({
    ...c,
    priceBrl: Number((c.priceBrl * f).toFixed(2)),
    variation24h: Number((c.variation24h * (f >= 1 ? 1 : -1)).toFixed(2)),
  })),
);
