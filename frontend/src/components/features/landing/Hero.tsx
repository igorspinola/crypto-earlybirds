import Link from "next/link";
import type { CmsHome } from "@/lib/prismic";
import { CoinMarquee } from "./CoinMarquee";
import { Header } from "./Header";

export function Hero({ content }: { content: CmsHome }) {
  return (
    <section className="relative overflow-hidden bg-brand-blue-dark bg-[url(/images/gradient-bg.png)] bg-cover bg-center text-white">
      <Header />
      <div className="relative mx-auto max-w-6xl px-6 pt-10 pb-10 text-center md:px-8 md:pt-20 md:pb-16">
        <h1 className="font-display text-[1.75rem] font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-6xl md:leading-[1.05] lg:text-7xl">
          {content.heroTitle}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/80 md:max-w-xl md:text-base">
          {content.heroSubtitle}
        </p>
        <Link
          href="/cadastrar"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-blue-light px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 md:px-8 md:py-4 md:text-base"
        >
          Comece agora
        </Link>
        <p className="mt-10 text-sm tracking-wide text-white/70 md:mt-16 md:text-base">
          Mercado em Tempo Real
        </p>
      </div>
      <div className="relative pb-12 md:pb-20">
        <CoinMarquee />
      </div>
    </section>
  );
}
