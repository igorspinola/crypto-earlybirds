"use client";

import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { CoinGalleryCard } from "@/components/features/trader/CoinGalleryCard";
import { GALLERY_COINS } from "@/lib/mock-coins-extended";

const PAGE_SIZE_DESKTOP = 15;

export default function GaleriaPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GALLERY_COINS;
    return GALLERY_COINS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q),
    );
  }, [query]);

  const pageSize = PAGE_SIZE_DESKTOP;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <label className="flex flex-1 items-center gap-3 rounded-2xl bg-brand-blue-dark/60 px-4 py-3 ring-1 ring-white/10 focus-within:ring-brand-blue-light">
          <Search className="h-4 w-4 text-white/60" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Pesquise a moeda..."
            className="min-w-0 flex-1 border-none bg-transparent text-sm text-white outline-none placeholder:text-white/40"
          />
        </label>
        <button
          type="button"
          aria-label="Filtros"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue-dark/60 text-white/80 ring-1 ring-white/10 transition-colors hover:bg-brand-blue-dark/80"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-medium md:text-3xl">Galeria</h1>
        <p className="text-sm text-white/60">Confira todas as moedas</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
        {visible.map((c, i) => (
          <CoinGalleryCard key={`${c.symbol}-${start + i}`} coin={c} />
        ))}
      </div>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onChange={setPage}
      />
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav className="flex items-center justify-center gap-2 pt-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Anterior"
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/80 transition-colors hover:bg-white/10 disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`flex h-9 w-9 items-center justify-center rounded-lg font-display text-sm transition-colors ${
            p === page
              ? "bg-white text-brand-blue-dark"
              : "bg-white/5 text-white/80 hover:bg-white/10"
          }`}
        >
          {p.toString().padStart(2, "0")}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Próximo"
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/80 transition-colors hover:bg-white/10 disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
