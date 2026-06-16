"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS, TRADER_NAV_ITEMS } from "./nav-items";

export function BottomNav({
  variant = "trader",
}: {
  variant?: "trader" | "admin";
}) {
  const pathname = usePathname();
  const isAdmin = variant === "admin";
  const items = variant === "admin" ? ADMIN_NAV_ITEMS : TRADER_NAV_ITEMS;

  return (
    <nav className="sticky bottom-0 z-30 flex items-center justify-around border-t border-white/10 bg-brand-blue-dark/95 px-2 py-2 backdrop-blur md:hidden">
      {items.map(({ label, href, Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${
              active
                ? isAdmin
                  ? "bg-white text-brand-blue-dark"
                  : "bg-amber-400 text-brand-blue-dark"
                : "text-white/70"
            }`}
          >
            <Icon className="h-5 w-5" />
          </Link>
        );
      })}
    </nav>
  );
}
