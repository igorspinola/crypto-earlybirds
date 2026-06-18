import { TraderCreateForm } from "@/components/features/admin/TraderCreateForm";

export default function CadastrarTraderPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-medium md:text-3xl">
          Cadastrar Trader
        </h1>
        <p className="text-sm text-white/60">
          Crie uma conta de acesso para um novo trader.
        </p>
      </div>

      <TraderCreateForm />
    </div>
  );
}
