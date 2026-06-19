import { cookies } from "next/headers";
import { listCryptocurrencies } from "./api";
import { apiCryptocurrencyToCoin } from "./coin-adapter";
import type { Coin } from "./mock-coins";
import { GALLERY_COINS } from "./mock-coins-extended";

export type GalleryCoinsResult = {
  coins: Coin[];
  isFallback: boolean;
};

export async function getGalleryCoins(): Promise<GalleryCoinsResult> {
  try {
    const cookieHeader = (await cookies()).toString();
    const response = await listCryptocurrencies(cookieHeader);

    if (response.items.length === 0) {
      return { coins: GALLERY_COINS, isFallback: true };
    }

    return {
      coins: response.items.map(apiCryptocurrencyToCoin),
      isFallback: false,
    };
  } catch {
    return { coins: GALLERY_COINS, isFallback: true };
  }
}
