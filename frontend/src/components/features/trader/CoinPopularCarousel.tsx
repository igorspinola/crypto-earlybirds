"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { COINS } from "@/lib/mock-coins";
import { CoinPopularCard } from "./CoinPopularCard";

export function CoinPopularCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center gap-2">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Anterior"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div
        ref={trackRef}
        className="no-scrollbar flex flex-1 gap-3 overflow-x-auto scroll-smooth"
      >
        {COINS.map((c, i) => (
          <CoinPopularCard key={c.symbol} coin={c} dim={i % 3 === 2} />
        ))}
      </div>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Próximo"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
