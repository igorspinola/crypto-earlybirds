import { SectionLabel } from "./SectionLabel";

export function SecuritySection() {
  return (
    <section className="relative overflow-hidden bg-brand-blue-dark bg-[url(/images/gradient-bg.png)] bg-cover bg-center px-6 py-16 text-white md:px-8 md:py-24">
      <div className="relative mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-16">
        {/* TODO: trocar pelos SVGs oficiais quando vier a página Identidade Visual no Figma */}
        <div className="flex items-center justify-center gap-6 md:gap-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 font-display text-4xl md:h-32 md:w-32 md:text-6xl">
            B
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 font-display text-4xl md:h-32 md:w-32 md:text-6xl">
            A
          </div>
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
