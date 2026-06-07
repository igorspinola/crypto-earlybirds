import type { ReactNode } from "react";
import { BottomNav } from "@/components/features/trader/BottomNav";
import { MobileHeader } from "@/components/features/trader/MobileHeader";
import { Sidebar } from "@/components/features/trader/Sidebar";

export default function TraderLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen bg-brand-blue-dark bg-[url(/images/gradient-bg.png)] bg-cover bg-center text-white">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <MobileHeader />
        <main className="flex-1 px-5 pb-6 md:px-10 md:py-8">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
