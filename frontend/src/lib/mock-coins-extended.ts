import { COINS, type Coin } from "./mock-coins";

const variants = [
  { suffix: "-2", factor: 1.08 },
  { suffix: "-3", factor: 0.92 },
  { suffix: "-4", factor: 1.15 },
];

export const GALLERY_COINS: Coin[] = [
  ...COINS,
  ...variants.flatMap((v) =>
    COINS.map((c) => ({
      ...c,
      priceBrl: Number((c.priceBrl * v.factor).toFixed(2)),
    })),
  ),
];
