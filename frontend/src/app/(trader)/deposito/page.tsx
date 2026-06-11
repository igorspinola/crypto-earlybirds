import { DepositMethods } from "@/components/features/trader/DepositMethods";

export default function DepositoPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-medium md:text-3xl">Depósito</h1>
        <p className="text-sm text-white/60">
          Escolha o método de depósito e adicione saldo à sua conta.
        </p>
      </div>
      <DepositMethods />
    </div>
  );
}
