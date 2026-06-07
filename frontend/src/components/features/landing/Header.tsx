import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="relative z-20 flex items-center justify-between px-4 py-4 md:px-8 md:py-6">
      <Link
        href="/"
        className="flex items-center gap-2 font-display text-base font-medium tracking-tight text-white md:text-lg"
      >
        <Image
          src="/images/logo.svg"
          alt=""
          width={24}
          height={20}
          className="h-5 w-auto md:h-6"
          priority
        />
        CriptoCoin
      </Link>
      <nav className="flex shrink-0 items-center gap-1.5 md:gap-3">
        <Link
          href="/login"
          className="px-2 py-1 text-xs text-white transition-colors hover:text-white/80 md:rounded-full md:px-4 md:py-2 md:text-sm md:hover:bg-white/10"
        >
          Entrar
        </Link>
        <Link
          href="/cadastrar"
          className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-white/90 md:px-4 md:py-2 md:text-sm"
        >
          Criar Conta
        </Link>
      </nav>
    </header>
  );
}
