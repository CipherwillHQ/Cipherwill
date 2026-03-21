import { Metadata } from "next";
import Sidebar from "../../components/app/Sidebar";
import { AuthRedirectProvider } from "../../contexts/AuthRedirect";
import { SessionProvider } from "../../contexts/SessionContext";
import { FULL_HOSTNAME } from "@/common/constant";
import { PaymentGatewayProvider } from "@/contexts/PaymentGatewayContext";
import { OfflineContext } from "@/contexts/OfflineContext";
import { MaintananceModeProvider } from "@/contexts/MaintananceModeContext";
import { ThemeSelector } from "@/contexts/ThemeSelector";
import AppUiPreferencesBootstrap from "@/components/app/common/AppUiPreferencesBootstrap";

export const metadata: Metadata = {
  title: "Cipherwill App",
  description: "Cipherwill web application",
  robots: {
    index: false,
  },
  openGraph: {
    type: "website",
    title: "Cipherwill App",
    description: "Cipherwill web application",
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/app`,
  },
};

export default function AppLayout({ children }) {
  return (
    <div id="app-theme-layout">
      <div className="select-none text-black dark:text-white">
        <ThemeSelector>
          <AppUiPreferencesBootstrap />
          <OfflineContext>
            <MaintananceModeProvider>
              <AuthRedirectProvider>
                <SessionProvider>
                  <PaymentGatewayProvider>
                    <div className="flex flex-col sm:flex-row sm:items-center overflow-hidden w-screen cw-vh-screen cw-app-safe-area">
                      <div className="flex sm:h-full bg-white dark:bg-dark">
                        <Sidebar />
                      </div>
                      <div className="flex flex-col h-full w-full dark:bg-black/95 bg-dark-50">
                        {/* <div className="bg-red-400 p-4">Top Bar</div> */}
                        <div className="flex flex-col pb-40 flex-1 h-full overflow-y-auto customScrollbar">
                          <div className="cw-content-width-wrapper w-full">
                            {children}
                          </div>
                        </div>
                      </div>
                    </div>
                  </PaymentGatewayProvider>
                </SessionProvider>
              </AuthRedirectProvider>
            </MaintananceModeProvider>
          </OfflineContext>
        </ThemeSelector>
      </div>
    </div>
  );
}
