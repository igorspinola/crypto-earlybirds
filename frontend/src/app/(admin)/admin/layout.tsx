import type { ReactNode } from "react";
import { BottomNav } from "@/components/features/trader/BottomNav";
import { MobileHeader } from "@/components/features/trader/MobileHeader";
import { Sidebar } from "@/components/features/trader/Sidebar";
import { requireUserRole } from "@/lib/server-auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUserRole(["ADMIN"]);

  return (
    <div className="relative flex min-h-screen bg-[#03022b] text-white">
      <Sidebar variant="admin" user={user} />
      <div className="flex min-h-screen flex-1 flex-col">
        <MobileHeader homeHref="/admin/home" user={user} />
        <main className="flex-1 px-5 pb-6 md:px-10 md:py-8">{children}</main>
        <BottomNav variant="admin" />
      </div>
    </div>
  );
}
