import { TradeForm } from "@/components/features/trader/TradeForm";

export default function NegociacaoPage() {
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
      <TradeForm />
    </div>
  );
}
