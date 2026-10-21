// Renders the themed executor application shell.
// Owns the sidebar, account header, and responsive content viewport.
// Does not fetch will contents or decide access permissions.

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeSelector } from "@/contexts/ThemeSelector";
import AppUiPreferencesBootstrap from "@/components/app/common/AppUiPreferencesBootstrap";
import ExecutorTopbar from "@/components/executor/ExecutorTopbar";
import ExecutorSidebar from "../../components/executor/ExecutorSidebar";
import { AuthRedirectProvider } from "../../contexts/AuthRedirect";
import { SessionProvider } from "../../contexts/SessionContext";

export const metadata: Metadata = {
  title: "Executor Dashboard | Cipherwill",
  robots: { index: false },
};

export default function ExecutorLayout({ children }: { children: ReactNode }) {
  return (
    <div id="app-theme-layout">
      <div className="select-none text-forest dark:text-cream">
        <ThemeSelector>
          <AppUiPreferencesBootstrap />
          <AuthRedirectProvider>
            <SessionProvider>
              <div className="flex overflow-hidden w-screen cw-vh-screen cw-app-safe-area">
                <div className="flex h-full shrink-0">
                  <ExecutorSidebar />
                </div>
                <div className="flex h-full min-w-0 flex-1 flex-col bg-dashboardCream dark:bg-darkCanvas">
                  <ExecutorTopbar />
                  <main className="min-h-0 flex-1 overflow-y-auto customScrollbar">
                    <div className="cw-content-width-wrapper w-full px-4 py-6 pb-16 sm:px-6">
                      {children}
                    </div>
                  </main>
                </div>
              </div>
            </SessionProvider>
          </AuthRedirectProvider>
        </ThemeSelector>
      </div>
    </div>
  );
}
