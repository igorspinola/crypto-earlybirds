"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 flex-col bg-brand-blue-dark/95 px-5 py-6 text-white md:flex">
      <Link href="/home" className="flex items-center gap-2 font-display text-lg font-medium">
        <Image
          src="/images/logo.svg"
          alt=""
          width={28}
          height={24}
          className="h-6 w-auto"
          priority
        />
        CriptoCoin
      </Link>

      <div className="mt-6 flex items-center gap-3 rounded-xl bg-white/5 p-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-amber-200 text-sm font-medium text-amber-900">
          AM
        </div>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-sm font-medium">Amanda Morais</span>
          <span className="text-[11px] text-white/60">Trader</span>
        </div>
      </div>

      <p className="mt-6 px-2 text-[11px] uppercase tracking-wider text-white/40">
        Menu
      </p>
      <nav className="mt-2 flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, href, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-brand-blue-light text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-blue-light to-blue-500 px-4 py-3 font-display text-sm font-medium text-white shadow-lg transition-opacity hover:opacity-90"
      >
        <LogOut className="h-4 w-4" />
        Sair
      </button>
    </aside>
  );
}
