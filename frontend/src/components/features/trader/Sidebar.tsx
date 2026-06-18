"use client";

import { ChevronsLeft, ChevronsRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/api";
import { ADMIN_NAV_ITEMS, TRADER_NAV_ITEMS } from "./nav-items";

type SidebarProps = {
  variant?: "trader" | "admin";
};

export function Sidebar({ variant = "trader" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isAdmin = variant === "admin";
  const items = isAdmin ? ADMIN_NAV_ITEMS : TRADER_NAV_ITEMS;
  const roleLabel = isAdmin ? "Admin" : "Trader";
  const homeHref = isAdmin ? "/admin/home" : "/home";

  return (
    <aside
      className={`hidden h-screen shrink-0 flex-col bg-brand-blue-dark bg-[url(/images/gradient-bg.png)] bg-cover bg-center py-6 text-white transition-[width,padding] duration-300 md:flex ${
        collapsed ? "w-20 px-2" : "w-64 px-5"
      }`}
    >
      <div className="flex items-center justify-between">
        <Link
          href={homeHref}
          aria-label="CriptoCoin"
          className={`flex min-w-0 items-center gap-2 font-display text-lg font-medium ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Image
            src="/images/logo.svg"
            alt=""
            width={28}
            height={24}
            className="h-6 w-auto shrink-0"
            priority
          />
          <span className={collapsed ? "sr-only" : "truncate"}>CriptoCoin</span>
        </Link>

        <button
          type="button"
          aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
          onClick={() => setCollapsed((value) => !value)}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 ${
            collapsed
              ? "absolute left-[3.25rem] top-8 bg-brand-blue-dark ring-1 ring-white/10"
              : ""
          }`}
        >
          {collapsed ? (
            <ChevronsRight className="h-5 w-5" />
          ) : (
            <ChevronsLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <div
        className={`mt-6 flex items-center gap-3 rounded-xl ${
          collapsed ? "justify-center p-0" : "bg-white/5 p-3"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-amber-200 text-sm font-medium text-amber-900">
          AM
        </div>
        <div
          className={
            collapsed ? "sr-only" : "flex min-w-0 flex-col leading-tight"
          }
        >
          <span className="truncate text-sm font-medium">Amanda Morais</span>
          <span className="text-[11px] text-white/60">{roleLabel}</span>
        </div>
      </div>

      <p
        className={`mt-6 text-[11px] text-white/70 ${
          collapsed ? "text-center" : "px-2"
        }`}
      >
        Menu
      </p>
      <nav className="mt-2 flex flex-col gap-1">
        {items.map(({ label, href, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={`flex items-center rounded-lg text-sm transition-colors ${
                collapsed ? "h-11 justify-center px-0" : "gap-3 px-3 py-2"
              } ${
                active
                  ? isAdmin
                    ? "bg-white text-brand-blue-dark"
                    : "bg-brand-blue-light text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className={collapsed ? "sr-only" : ""}>{label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        aria-label="Sair"
        disabled={isLoggingOut}
        onClick={async () => {
          setIsLoggingOut(true);
          await logout().catch(() => undefined);
          router.replace("/login");
          router.refresh();
        }}
        className={`mt-auto flex items-center justify-center rounded-xl font-display text-sm font-medium text-white transition-opacity hover:opacity-90 ${
          collapsed
            ? "bg-transparent p-3 text-white/80"
            : "gap-2 bg-gradient-to-r from-brand-blue-light to-blue-500 px-4 py-3 shadow-lg"
        }`}
      >
        <Image
          src="/images/SignOut.png"
          alt=""
          width={20}
          height={20}
          className="h-4 w-4"
        />
        <span className={collapsed ? "sr-only" : ""}>
          {isLoggingOut ? "Saindo..." : "Sair"}
        </span>
      </button>
    </aside>
  );
}
