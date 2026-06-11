import { ThemeSelector } from "@/contexts/ThemeSelector";
import ExecutorSidebar from "../../components/executor/ExecutorSidebar";
import { AuthRedirectProvider } from "../../contexts/AuthRedirect";
import { SessionProvider } from "../../contexts/SessionContext";

export default function ExecutorLayout({ children }) {
  return (
    <div id="app-theme-layout">
      <div className="select-none text-forest dark:text-cream">
        <ThemeSelector>
          <AuthRedirectProvider>
            <SessionProvider>
              <div className="flex items-center overflow-hidden w-screen cw-vh-screen cw-app-safe-area">
                <div className="flex h-full bg-white dark:bg-darkCanvas">
                  <ExecutorSidebar />
                </div>
                <div className="flex flex-1 h-full overflow-y-auto bg-dashboardCream dark:bg-darkCanvas p-4">
                  {children}
                </div>
              </div>
            </SessionProvider>
          </AuthRedirectProvider>
        </ThemeSelector>
      </div>
    </div>
  );
}
