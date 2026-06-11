import { Boxes, Coins, ImageIcon, Layers } from "lucide-react";
import Image from "next/image";
import { CategoryCard } from "@/components/features/trader/CategoryCard";
import { CoinPopularCarousel } from "@/components/features/trader/CoinPopularCarousel";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <section className="relative overflow-hidden rounded-3xl">
        <Image
          src="/images/futuro-financas.png"
          alt=""
          width={1200}
          height={400}
          className="h-76 w-full object-cover md:h-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#02021D] via-[#12131C]/40 to-[#12131C]/0" />
        <div className="absolute inset-0 flex flex-col justify-center gap-3 p-6 md:p-10">
          <h1 className="max-w-md font-display text-2xl font-medium leading-tight text-white md:text-4xl">
            Domine o Futuro das Finanças
          </h1>
          <p className="max-w-md text-xs text-white/80 md:text-sm">
            A cesso aos ativos digitais mais promissores do mercado com as
            menores taxas e execução institucional.
          </p>
          <a
            href="/galeria"
            className="mt-1 inline-flex w-fit items-center rounded-xl bg-brand-blue-light px-5 py-2.5 font-display text-sm font-medium text-white transition-opacity hover:opacity-90 md:text-base"
          >
            Comprar agora
          </a>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-medium md:text-xl">Categorias</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <CategoryCard
            title="DeFi"
            description="Finanças descentralizadas e yield farming."
            Icon={Layers}
            accent="emerald"
          />
          <CategoryCard
            title="NFT"
            description="Colecionáveis digitais e arte exclusiva."
            Icon={ImageIcon}
            accent="indigo"
          />
          <CategoryCard
            title="Metaverse"
            description="Tokens de mundos virtuais e jogos."
            Icon={Boxes}
            accent="fuchsia"
          />
          <CategoryCard
            title="Stablecoins"
            description="Ativos pareados a moedas fiduciárias."
            Icon={Coins}
            accent="amber"
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-medium md:text-xl">
          Moedas populares
        </h2>
        <CoinPopularCarousel />
      </section>
    </div>
  );
}
