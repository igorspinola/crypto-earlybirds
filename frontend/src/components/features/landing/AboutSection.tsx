import { SectionLabel } from "./SectionLabel";

export function AboutSection() {
  return (
    <section className="bg-white px-6 py-16 md:px-8 md:py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 md:gap-8">
        <SectionLabel>Sobre Nós</SectionLabel>
        <p className="text-center text-base leading-relaxed text-foreground md:text-lg">
          A CriptoCoin acredita que o acesso ao mercado de criptoativos deve ser
          para todos. Simplificamos a complexidade da blockchain para oferecer a
          você uma experiência fluida, seja você um investidor iniciante ou um
          trader experiente.
        </p>
      </div>
    </section>
  );
}
