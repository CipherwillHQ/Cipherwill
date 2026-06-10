/*
 * page.tsx
 * What it does: Renders the public explainer page for Security Factors.
 * What it owns: Page layout, SEO metadata, editorial content blocks, and structural sections.
 * What it does NOT do: It does not implement the FactorsGrid or EncryptionMatrix subcomponents.
 */

import { FULL_HOSTNAME } from "@/common/constant";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CTA from "@/components/public/CTA";
import FAQs from "@/components/public/FAQs";
import FactorsGrid from "./FactorsGrid";
import EncryptionMetrix from "./EncryptionMetrix";
import Link from "next/link";

const title = "How Security Factors Work - Cipherwill";
const description =
  "Get a clear understanding of how Cipherwill's encryption works with various security factors, ensuring your digital assets are protected at every step.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/how-factors-work`,
  },
};

export default function HowFactorsWork() {
  return (
    <div className="bg-cream min-h-screen text-forest font-sans">
      <SmoothPageScroll />
      <Header />

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-forest/10 bg-parchment/50 text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-sage" />
          Multi-Factor Architecture
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold text-forest leading-tight">
          Security Factors Explained
        </h1>
        <p className="mt-6 text-base sm:text-lg text-forest/70 max-w-xl mx-auto font-medium leading-relaxed mb-8">
          {description}
        </p>
        <div>
          <Link
            href="/app/factors"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-cream font-bold text-sm hover:bg-primary-700 active:scale-95 transition-all duration-200 shadow-level-1"
          >
            See My Account Factors →
          </Link>
        </div>
      </section>

      {/* Educational Context Section */}
      <section className="px-4 py-8 max-w-4xl mx-auto text-center md:text-left">
        <div className="bg-white border border-forest/10 rounded-2xl p-6 md:p-10 shadow-level-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-forest mb-4">
              What are Security Factors?
            </h2>
            <p className="text-forest/70 text-sm sm:text-base leading-relaxed font-medium">
              Security factors are cryptographic pillars. Instead of relying on vulnerable centralized databases, Cipherwill uses these factors as unique inputs to derive local encryption keys. Your keys unlock the vault, ensuring only you or your designated beneficiaries can decrypt your data.
            </p>
          </div>
          <div className="bg-parchment/40 border border-forest/5 rounded-xl p-5 md:p-6 font-medium">
            <h3 className="font-semibold text-lg text-forest mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              On-Device Generation
            </h3>
            <p className="text-xs sm:text-sm text-forest/70 leading-relaxed">
              Factors trigger a local key-derivation function. We generate highly secure 256-bit entropy seeds directly in your browser. Our servers never see your password, passkey, or private key.
            </p>
          </div>
        </div>
      </section>

      {/* Supported Factors Grid */}
      <section className="px-4 py-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-playfair font-bold text-3xl text-forest">
            Supported Factors
          </h2>
          <p className="text-forest/60 text-sm mt-2 font-medium">
            Choose from industry-grade authentication devices and decentralized cryptographic vectors.
          </p>
        </div>
        <FactorsGrid />
      </section>

      {/* Encryption Status Matrix */}
      <section className="bg-parchment/30 border-y border-forest/5 my-12">
        <EncryptionMetrix />
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <FAQs />
      </section>

      <CTA />
      <Footer />
    </div>
  );
}