import {
  ArrowDownToLine,
  ArrowLeftRight,
  House,
  LayoutGrid,
  Wallet,
} from "lucide-react";
import type { ComponentType } from "react";

export type NavItem = {
  label: string;
  href: string;
  Icon: ComponentType<{ className?: string }>;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/home", Icon: House },
  { label: "Galeria", href: "/galeria", Icon: LayoutGrid },
  { label: "Carteira", href: "/carteira", Icon: Wallet },
  { label: "Negociação", href: "/negociacao", Icon: ArrowLeftRight },
  { label: "Depósito", href: "/deposito", Icon: ArrowDownToLine },
];
