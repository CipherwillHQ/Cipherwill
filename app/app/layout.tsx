// Wraps app pages in authenticated account and encryption-session providers.
// Owns shared app metadata and delegates route-specific layout to AppPageShell.
// Does not render guided objectives or load overview metrics.
import { Metadata } from "next";
import AppPageShell from "@/components/app/common/AppPageShell";
import { AuthRedirectProvider } from "../../contexts/AuthRedirect";
import { SessionProvider } from "../../contexts/SessionContext";
import { FULL_HOSTNAME } from "@/common/constant";
import { PaymentGatewayProvider } from "@/contexts/PaymentGatewayContext";
import { OfflineContext } from "@/contexts/OfflineContext";
import { MaintananceModeProvider } from "@/contexts/MaintananceModeContext";
import { ThemeSelector } from "@/contexts/ThemeSelector";
import AppUiPreferencesBootstrap from "@/components/app/common/AppUiPreferencesBootstrap";
import OnboardingGuard from "@/components/app/onboarding/OnboardingGuard";

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
      <div className="select-none text-forest dark:text-cream">
        <ThemeSelector>
          <AppUiPreferencesBootstrap />
          <OfflineContext>
            <MaintananceModeProvider>
              <AuthRedirectProvider>
                <SessionProvider>
                  <PaymentGatewayProvider>
                    <OnboardingGuard>
                      <AppPageShell>{children}</AppPageShell>
                    </OnboardingGuard>
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
