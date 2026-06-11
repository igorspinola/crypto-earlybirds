import Image from "next/image";
import { SectionLabel } from "./SectionLabel";

export function SecuritySection() {
  return (
    <section className="relative overflow-hidden bg-brand-blue-dark bg-[url(/images/gradient-bg.png)] bg-cover bg-center px-6 py-16 text-white md:px-8 md:py-24">
      <div className="relative mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative mx-auto h-56 w-full max-w-sm md:h-80 md:max-w-md">
          <Image
            src="/images/coins/btc.svg"
            alt="Bitcoin"
            width={132}
            height={191}
            className="absolute left-[22%] top-0 h-20 w-auto md:h-32"
            priority={false}
          />
          <Image
            src="/images/coins/avax.svg"
            alt="Avalanche"
            width={150}
            height={150}
            className="absolute right-[4%] top-[4%] h-20 w-auto md:h-32"
            priority={false}
          />
          <Image
            src="/images/coins/sol.svg"
            alt="Solana"
            width={150}
            height={150}
            className="absolute left-[6%] bottom-0 h-20 w-auto md:h-32"
            priority={false}
          />
        </div>
        <div className="flex flex-col items-start gap-4">
          <SectionLabel tone="light">Segurança</SectionLabel>
          <p className="text-sm leading-relaxed text-white/85 md:text-base">
            A proteção do seu patrimônio é inegociável. Utilizamos tecnologia de
            ponta em criptografia, autenticação em duas etapas (2FA) e a maior
            parte dos fundos é mantida em cold wallets (armazenamento offline)
            para garantir proteção total contra ataques.
          </p>
        </div>
      </div>
    </section>
  );
}
