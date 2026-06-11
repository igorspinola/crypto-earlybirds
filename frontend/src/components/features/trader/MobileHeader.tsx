import Image from "next/image";
import Link from "next/link";

export function MobileHeader() {
  return (
    <header className="flex items-center justify-between px-5 py-4 text-white md:hidden">
      <Link href="/home" className="flex items-center gap-2 font-display text-xl font-medium">
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
      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-amber-200 text-xs font-medium text-amber-900">
        AM
      </div>
    </header>
  );
}
