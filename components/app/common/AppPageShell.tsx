// Renders shared app navigation around ordinary pages and guided setup.
// Owns viewport sizing and the guide's full content-area width and height.
// Does not change authentication, session, or onboarding providers.
"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/app/Sidebar";

export default function AppPageShell({ children }: { children: ReactNode }) {
  const isGuide = usePathname() === "/app/guide";
  return <div className="flex flex-col sm:flex-row sm:items-center overflow-hidden w-screen cw-vh-screen cw-app-safe-area">
    <div className="flex sm:h-full bg-white dark:bg-darkCanvas"><Sidebar /></div>
    <div className={`flex flex-col h-full w-full bg-dashboardCream dark:bg-darkCanvas${isGuide ? " min-w-0 flex-1" : ""}`}>
      <div className={`flex flex-col flex-1 h-full overflow-y-auto customScrollbar ${isGuide ? "min-h-0" : "pb-40"}`}>
        <div className={isGuide ? "flex min-h-full w-full flex-col" : "cw-content-width-wrapper w-full"}>{children}</div>
      </div>
    </div>
  </div>;
}
