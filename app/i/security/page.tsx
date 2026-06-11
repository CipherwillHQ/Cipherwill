/**
 * Security page index orchestrator for Cipherwill.
 * Owns the structure of the premium Security page, rendering sub-sections like Hero, Pillars, Journey, and FAQ.
 * Does NOT own individual section layout logic.
 */

import { FULL_HOSTNAME } from "@/common/constant";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CTA from "@/components/public/CTA";
import FAQs from "@/components/public/FAQs";
import HeroSection from "./HeroSection";
import ThreePillars from "./ThreePillars";
import DataJourney from "./DataJourney";
import SecurityAudits from "./SecurityAudits";

const title = "Security & Trust - Cipherwill";
const description =
  "Discover how Cipherwill safeguards your digital estate through zero-knowledge encryption, local device sealing, transparent open-source protocol auditing, and resilient backup shards.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/security`,
  },
};

export default function SecurityPage() {
  return (
    <div className="w-full min-h-screen bg-cream text-forest selection:bg-sage/20 selection:text-forest">
      <SmoothPageScroll />
      <Header />

      {/* Hero Section (Light, Warm Cream) */}
      <HeroSection />

      {/* The Core Three Pillars of Trust (Light, White) */}
      <ThreePillars />

      {/* The Flow / Visual Data Journey (Light, Warm Cream) */}
      <DataJourney />

      {/* Security Audits & Technical Cryptography (Light, White) */}
      <SecurityAudits />

      {/* Reassurance & Answers (Light, Warm Cream) */}
      <FAQs />

      {/* Reassurance Call-To-Action (Light, White) */}
      <CTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}
