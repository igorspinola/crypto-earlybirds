import { cookies } from "next/headers";
import { TradeForm } from "@/components/features/trader/TradeForm";
import { getWallet, listCryptocurrencies } from "@/lib/api";

export default async function NegociacaoPage() {
  const cookieHeader = (await cookies()).toString();
  const [cryptocurrencies, wallet] = await Promise.all([
    listCryptocurrencies(cookieHeader),
    getWallet(cookieHeader),
  ]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-medium md:text-3xl">
          Negociação
        </h1>
        <p className="text-sm text-white/60">
          Compre ou venda criptomoedas de forma rápida e segura.
        </p>
      </div>
      <TradeForm
        cryptocurrencies={cryptocurrencies.items}
        wallet={wallet}
      />
    </div>
  );
}
