"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Coin } from "@/lib/mock-coins";
import { CoinPopularCard } from "./CoinPopularCard";

type CoinPopularCarouselProps = {
  coins: Coin[];
};

export function CoinPopularCarousel({ coins }: CoinPopularCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (coins.length === 0) {
    return (
      <div className="flex h-52 items-center justify-center rounded-3xl bg-white/[0.03] text-sm text-white/50 md:h-56">
        Nenhuma moeda cadastrada ainda.
      </div>
    );
  }

  const total = coins.length;
  const goPrev = () => setActiveIndex((i) => (i - 1 + total) % total);
  const goNext = () => setActiveIndex((i) => (i + 1) % total);

  return (
    <div className="relative flex items-center justify-center gap-2 md:gap-4">
      <button
        type="button"
        aria-label="Anterior"
        onClick={goPrev}
        disabled={total <= 1}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-70 disabled:opacity-30"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <div
        role="region"
        aria-label="Moedas populares"
        className="relative h-52 w-full max-w-[600px] md:h-56 md:max-w-[900px]"
      >
        {coins.map((c, i) => {
          const half = total / 2;
          let offset = i - activeIndex;
          if (offset > half) offset -= total;
          if (offset <= -half) offset += total;

          const maxVisible = 2;
          const abs = Math.abs(offset);
          const isVisible = abs <= maxVisible;
          const translateX = offset * 130;
          const scale = abs < 1 ? 1.1 : 1 - abs * 0.04;
          const z = 10 - Math.round(abs);
          const focus = abs < 1;
          return (
            <button
              type="button"
              key={c.symbol}
              onClick={() => setActiveIndex(i)}
              aria-current={focus ? "true" : undefined}
              aria-hidden={!isVisible}
              tabIndex={isVisible ? 0 : -1}
              className="absolute left-1/2 top-1/2 cursor-pointer transition-all duration-300 ease-out"
              style={{
                transform: `translate(-50%, -50%) translate(${translateX}px, 0) scale(${scale})`,
                transformOrigin: "50% 50%",
                zIndex: z,
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? "auto" : "none",
              }}
            >
              <CoinPopularCard coin={c} focus={focus} dim={!focus} />
            </button>
          );
        })}
      </div>
      <button
        type="button"
        aria-label="Próximo"
        onClick={goNext}
        disabled={total <= 1}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-70 disabled:opacity-30"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
