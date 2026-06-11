import { ChevronLeft, ChevronRight } from "lucide-react";
import { COINS } from "@/lib/mock-coins";
import { CoinPopularCard } from "./CoinPopularCard";

const CENTER = (COINS.length - 1) / 2;

export function CoinPopularCarousel() {
  return (
    <div className="relative flex items-center justify-center gap-2 md:gap-4">
      <button
        type="button"
        aria-label="Anterior"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-70"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <div
        role="region"
        aria-label="Moedas populares"
        className="relative h-52 w-full max-w-[600px] md:h-56 md:max-w-[900px]"
      >
        {COINS.map((c, i) => {
          const offset = i - CENTER;
          const abs = Math.abs(offset);
          const translateX = offset * 130;
          const scale = abs < 1 ? 1.1 : 1 - abs * 0.04;
          const z = 10 - Math.round(abs);
          const focus = abs < 1;
          return (
            <div
              key={c.symbol}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) translate(${translateX}px, 0) scale(${scale})`,
                transformOrigin: "50% 50%",
                zIndex: z,
              }}
            >
              <CoinPopularCard coin={c} focus={focus} dim={!focus} />
            </div>
          );
        })}
      </div>
      <button
        type="button"
        aria-label="Próximo"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-70"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
