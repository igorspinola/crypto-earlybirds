import { Boxes, Coins, ImageIcon, Layers } from "lucide-react";
import Image from "next/image";
import { cookies } from "next/headers";
import { CategoryCard } from "@/components/features/trader/CategoryCard";
import { CoinPopularCarousel } from "@/components/features/trader/CoinPopularCarousel";
import { listCryptocurrencies } from "@/lib/api";
import { apiCryptocurrencyToCoin } from "@/lib/coin-adapter";
import { getCategories, getHomeContent } from "@/lib/prismic";

const CATEGORY_PRESENTATION = {
  defi: {
    Icon: Layers,
    accent: "emerald",
  },
  nft: {
    Icon: ImageIcon,
    accent: "indigo",
  },
  metaverse: {
    Icon: Boxes,
    accent: "fuchsia",
  },
  stablecoins: {
    Icon: Coins,
    accent: "amber",
  },
} as const;

const DEFAULT_PRESENTATION = {
  Icon: Coins,
  accent: "indigo",
} as const;

export default async function HomePage() {
  const cookieHeader = (await cookies()).toString();
  const [categories, homeContent, cryptocurrencies] = await Promise.all([
    getCategories(),
    getHomeContent(),
    listCryptocurrencies(cookieHeader),
  ]);
  const popularCoins = [...cryptocurrencies.items]
    .sort((a, b) => Number(b.currentPrice) - Number(a.currentPrice))
    .slice(0, 6)
    .map(apiCryptocurrencyToCoin);
  const heroImageUrl =
    homeContent.heroImageUrl || "/images/futuro-financas.png";

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <section className="relative overflow-hidden rounded-3xl">
        <Image
          src={heroImageUrl}
          alt={homeContent.heroImageAlt}
          width={1200}
          height={400}
          className="h-76 w-full object-cover md:h-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#02021D] via-[#12131C]/40 to-[#12131C]/0" />
        <div className="absolute inset-0 flex flex-col justify-center gap-3 p-6 md:p-10">
          <h1 className="max-w-md font-display text-2xl font-medium leading-tight text-white md:text-4xl">
            {homeContent.heroTitle}
          </h1>
          <p className="max-w-md text-xs text-white/80 md:text-sm">
            {homeContent.heroSubtitle}
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
        <h2 className="font-display text-lg font-medium md:text-xl">
          Categorias
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((category) => {
            const presentation =
              CATEGORY_PRESENTATION[
                category.uid as keyof typeof CATEGORY_PRESENTATION
              ] ?? DEFAULT_PRESENTATION;

            return (
              <CategoryCard
                key={category.uid}
                title={category.name}
                description={category.description}
                imageUrl={category.imageUrl}
                imageAlt={category.imageAlt}
                Icon={presentation.Icon}
                accent={presentation.accent}
              />
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-medium md:text-xl">
          Moedas populares
        </h2>
        <CoinPopularCarousel coins={popularCoins} />
      </section>
    </div>
  );
}
