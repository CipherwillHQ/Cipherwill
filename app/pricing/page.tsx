/**
 * app/pricing/page.tsx
 * What it does: Serves as the main routing entry point for the redesigned Cipherwill Pricing page.
 * What it owns: Page metadata, wrapper page containers, and top-level subcomponent section rendering.
 * What it does NOT do: Hold individual card pricing state, layout details of sliders, or specific table comparisons.
 */

import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import CTA from "@/components/public/CTA";
import SimplePricing from "@/components/pricing/SimplePricing";
import FAQs from "@/components/public/FAQs";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";

const title = "Plans & Pricing — Cipherwill";
const description =
  "Explore Cipherwill's flexible pricing options. Secure your digital estate for free or unlock the full Infinite Legacy plan to encrypt Web3 cold seeds, private files, and multi-channel triggers.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/pricing`,
  },
};

export default function Pricing() {
  return (
    <div className="w-full min-h-screen bg-cream text-forest selection:bg-sage/20 selection:text-forest overflow-x-hidden">
      <SmoothPageScroll />
      <Header />

      {/* Main Orchestrator of the redesigned Pricing sections */}
      <div>
        <SimplePricing />
      </div>

      {/* Reassurance FAQ Accordion Section */}
      <FAQs />

      {/* Final Action Invitation Ribbon */}
      <CTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}
