import {
  ArrowDownToLine,
  ArrowLeftRight,
  House,
  LayoutGrid,
  PlusCircle,
  UserPlus,
  Wallet,
} from "lucide-react";
import type { ComponentType } from "react";

export type NavItem = {
  label: string;
  href: string;
  Icon: ComponentType<{ className?: string }>;
};

export const TRADER_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/home", Icon: House },
  { label: "Galeria", href: "/galeria", Icon: LayoutGrid },
  { label: "Carteira", href: "/carteira", Icon: Wallet },
  { label: "Negociação", href: "/negociacao", Icon: ArrowLeftRight },
  { label: "Depósito", href: "/deposito", Icon: ArrowDownToLine },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/admin/home", Icon: House },
  { label: "Galeria", href: "/admin/galeria", Icon: LayoutGrid },
  { label: "Carteira", href: "/admin/carteira", Icon: Wallet },
  { label: "Moeda", href: "/admin/cadastrar-moeda", Icon: PlusCircle },
  { label: "Trader", href: "/admin/cadastrar-trader", Icon: UserPlus },
];
