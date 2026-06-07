import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BrandImagePanel } from "@/components/features/auth/BrandImagePanel";
import { RegisterForm } from "@/components/features/auth/RegisterForm";
import { Header } from "@/components/features/landing/Header";

export default function CadastrarPage() {
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
          <Link
            href="/"
            aria-label="Voltar"
            className="absolute left-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue-light text-white shadow-lg transition-opacity hover:opacity-90 md:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <BrandImagePanel />

          <div className="flex flex-col gap-4 px-6 pb-8 pt-20 md:flex-1 md:gap-5 md:px-10 md:py-10">
            <div className="flex flex-col gap-2">
              <h1 className="font-display text-3xl font-medium leading-tight md:text-4xl">
                Boas vindas!
              </h1>
              <p className="text-sm text-zinc-500 md:text-base">
                Cadastre-se com segurança e junte-se a milhares de investidores.
              </p>
            </div>
            <RegisterForm />
          </div>
        </div>
      </main>
    </div>
  );
}
