import { ThemeSelector } from "@/contexts/ThemeSelector";
import ExecutorSidebar from "../../components/executor/ExecutorSidebar";
import { AuthRedirectProvider } from "../../contexts/AuthRedirect";
import { SessionProvider } from "../../contexts/SessionContext";

export default function ExecutorLayout({ children }) {
  return (
    <div id="app-theme-layout">
      <div className="select-none text-black dark:text-white">
        <ThemeSelector>
          <AuthRedirectProvider>
            <SessionProvider>
              <div className="flex items-center overflow-hidden h-screen w-screen text-black dark:text-white">
                <div className="flex h-full bg-secondary">
                  <ExecutorSidebar />
                </div>
                <div className="flex flex-1 h-full overflow-y-auto dark:bg-black/95 bg-dark-50 p-4">
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
