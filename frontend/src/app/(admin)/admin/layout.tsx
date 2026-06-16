import type { ReactNode } from "react";
import { BottomNav } from "@/components/features/trader/BottomNav";
import { MobileHeader } from "@/components/features/trader/MobileHeader";
import { Sidebar } from "@/components/features/trader/Sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen bg-[#03022b] text-white">
      <Sidebar variant="admin" />
      <div className="flex min-h-screen flex-1 flex-col">
        <MobileHeader homeHref="/admin/home" />
        <main className="flex-1 px-5 pb-6 md:px-10 md:py-8">{children}</main>
        <BottomNav variant="admin" />
      </div>
    </div>
  );
}
