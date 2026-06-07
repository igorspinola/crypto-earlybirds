import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BrandImagePanel } from "@/components/features/auth/BrandImagePanel";
import { RecoverPasswordForm } from "@/components/features/auth/RecoverPasswordForm";
import { Header } from "@/components/features/landing/Header";

export default function RecuperarSenhaPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-brand-blue-dark bg-[url(/images/gradient-bg.png)] bg-cover bg-center text-white">
      <div className="md:hidden flex items-center justify-center gap-2 px-6 py-8 font-display text-2xl font-medium">
        <Image
          src="/images/logo.svg"
          alt=""
          width={32}
          height={28}
          className="h-7 w-auto"
          priority
        />
        CriptoCoin
      </div>
      <div className="hidden md:block">
        <Header />
      </div>

      <main className="flex flex-1 flex-col md:items-center md:justify-center md:px-8 md:py-10">
        <div className="relative flex flex-1 flex-col overflow-hidden rounded-t-3xl bg-white text-foreground md:flex-none md:w-full md:max-w-4xl md:flex-row md:rounded-3xl md:shadow-2xl">
          <BrandImagePanel
            quote="“O dinheiro sempre foi, em sua essência, tecnologia.”"
            author="Naval Ravikant"
          />

          <div className="flex flex-1 flex-col gap-4 px-6 pb-8 pt-6 md:gap-5 md:px-10 md:py-10">
            <Link
              href="/login"
              aria-label="Voltar"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue-light text-white shadow-lg transition-opacity hover:opacity-90"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="font-display text-3xl font-medium leading-tight md:text-4xl">
              Recuperar Senha
            </h1>
            <RecoverPasswordForm />
          </div>
        </div>
      </main>
    </div>
  );
}
