/*
 * page.tsx
 * What it does: Renders the public explainer page for Dead Man's Switch.
 * What it owns: Page layout, SEO metadata, high-level educational sections, and CTAs.
 * What it does NOT do: It does not implement the flow diagram subcomponent.
 */

import { FULL_HOSTNAME } from "@/common/constant";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CTA from "@/components/public/CTA";
import Link from "next/link";
import DeadMansSwitchFlow from "./DeadMansSwitchFlow";

const title = "End-to-End Encrypted Dead Man's Switch - Cipherwill";
const description =
  "Cipherwill is an End-to-End Encrypted Dead Man's Switch, securely automating asset transfers to loved ones when you're gone, with advanced encryption and ease.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/dead-mans-switch`,
  },
};

export default function DeadMansSwitch() {
  return (
    <div className="bg-cream min-h-screen text-forest font-sans">
      <SmoothPageScroll />
      <Header />

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-forest/10 bg-parchment/50 text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-clay" />
          Autonomous Protection
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold text-forest leading-tight">
          Dead Man's Switch
        </h1>
        <p className="mt-6 text-base sm:text-lg text-forest/70 max-w-xl mx-auto font-medium leading-relaxed">
          {description}
        </p>
      </section>

      {/* Interactive Blueprint Flowchart Section */}
      <section className="px-4 py-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-playfair font-bold text-3xl text-forest">
            How the Switch Works
          </h2>
          <p className="text-forest/60 text-sm mt-2 font-medium">
            Click on each phase to visualize how Cipherwill securely loops your data from browser to backup.
          </p>
        </div>
        <DeadMansSwitchFlow />
      </section>

      {/* Security Context Grid */}
      <section className="px-4 py-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-medium">
          {/* Box 1 */}
          <div className="bg-white border border-forest/10 rounded-2xl p-6 md:p-8 shadow-level-1">
            <h2 className="font-playfair text-2xl font-bold text-forest mb-4">
              What is a Dead Man's Switch?
            </h2>
            <p className="text-forest/70 text-sm sm:text-base leading-relaxed">
              A dead man's switch is an automated security system that activates if the operator becomes inactive or incapacitated. In the digital age, your assets (passwords, bank files, wallets, keys) risk becoming trapped in digital vaults forever. Cipherwill steps in autonomously, bypassing legal or technical roadblocks to pass on keys to those you care about.
            </p>
          </div>

          {/* Box 2 */}
          <div className="bg-white border border-forest/10 rounded-2xl p-6 md:p-8 shadow-level-1">
            <h2 className="font-playfair text-2xl font-bold text-forest mb-4">
              The Power of Local Encryption
            </h2>
            <p className="text-forest/70 text-sm sm:text-base leading-relaxed">
              When storing digital secrets, encryption is your shield. Cipherwill locks your data directly on your phone or computer. The payload is sealed with a dual-key system so that even if intercepted, it remains completely unreadable to our servers or unauthorized actors. Only when your switch triggers does your beneficiary receive the proper keys to open it.
            </p>
            <Link
              href="/how-factors-work"
              className="inline-block mt-4 text-xs font-mono font-bold uppercase tracking-wider text-primary hover:text-primary-700 underline"
            >
              Verify Encryption Matrix →
            </Link>
          </div>
        </div>
      </section>

      {/* Onboarding Guide Block (Alternating Theme) */}
      <section className="bg-forest text-cream py-20 px-4 mt-16 rounded-t-3xl font-medium">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-12">
            Five Simple Steps to Total Security
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 max-w-4xl mx-auto">
            <div className="border border-cream/10 bg-cream/5 rounded-xl p-5">
              <span className="font-mono text-xs opacity-50 font-bold">STEP 01</span>
              <h3 className="font-semibold text-white mt-1 mb-2">Sign Up</h3>
              <p className="text-xs text-cream/70 leading-relaxed">Create a safe profile and unlock your secure dashboard workspace.</p>
            </div>
            <div className="border border-cream/10 bg-cream/5 rounded-xl p-5">
              <span className="font-mono text-xs opacity-50 font-bold">STEP 02</span>
              <h3 className="font-semibold text-white mt-1 mb-2">Add Data</h3>
              <p className="text-xs text-cream/70 leading-relaxed">Vault your secrets: passwords, wallets, seed phrases, notes.</p>
            </div>
            <div className="border border-cream/10 bg-cream/5 rounded-xl p-5">
              <span className="font-mono text-xs opacity-50 font-bold">STEP 03</span>
              <h3 className="font-semibold text-white mt-1 mb-2">Assign</h3>
              <p className="text-xs text-cream/70 leading-relaxed">Select who should receive which secure asset packages when inactive.</p>
            </div>
            <div className="border border-cream/10 bg-cream/5 rounded-xl p-5">
              <span className="font-mono text-xs opacity-50 font-bold">STEP 04</span>
              <h3 className="font-semibold text-white mt-1 mb-2">Interval</h3>
              <p className="text-xs text-cream/70 leading-relaxed">Establish your standard check-in timeline (e.g. 3, 6 or 12 months).</p>
            </div>
            <div className="border border-cream/10 bg-cream/5 rounded-xl p-5">
              <span className="font-mono text-xs opacity-50 font-bold">STEP 05</span>
              <h3 className="font-semibold text-white mt-1 mb-2">Check In</h3>
              <p className="text-xs text-cream/70 leading-relaxed">Simply login once a cycle. We reset the silent countdown loop automatically.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link
              href="/how-it-works"
              className="inline-block text-sm font-semibold hover:underline text-cream border border-cream/20 rounded-full px-6 py-2 bg-cream/5 hover:bg-cream/10"
            >
              Read full user flow guide
            </Link>
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
}