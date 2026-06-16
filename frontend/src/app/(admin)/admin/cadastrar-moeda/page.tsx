import { CryptoCreateForm } from "@/components/features/admin/CryptoCreateForm";
import { getCategories } from "@/lib/prismic";

export const revalidate = 60;

export default async function CadastrarMoedaPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-medium md:text-3xl">
          Cadastrar Moeda
        </h1>
        <p className="text-sm text-white/60">
          Bem-vindo de volta! Aqui está o resumo da sua carteira cripto.
        </p>
      </div>

      <CryptoCreateForm categories={categories} />
    </div>
  );
}
