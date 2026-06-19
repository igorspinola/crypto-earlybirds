import Image from "next/image";
import Link from "next/link";
import type { ApiUser } from "@/lib/api";
import { getUserInitials } from "./user-display";

export function MobileHeader({
  homeHref,
  user,
}: {
  homeHref: string;
  user: ApiUser;
}) {
  const userInitials = getUserInitials(user);

  return (
    <header className="flex items-center justify-between px-5 py-4 text-white md:hidden">
      <Link
        href={homeHref}
        className="flex items-center gap-2 font-display text-xl font-medium"
      >
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
      <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-amber-200 text-xs font-medium text-amber-900">
        {user.photoUrl ? (
          <Image
            src={user.photoUrl}
            alt=""
            fill
            sizes="36px"
            className="object-cover"
            unoptimized
          />
        ) : (
          userInitials
        )}
      </div>
    </header>
  );
}
