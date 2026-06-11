/*
 * page.tsx
 * What it does: Renders the public explainer page for Time Capsule Encryption.
 * What it owns: Page layout, SEO metadata, editorial content blocks, and structural grids.
 * What it does NOT do: It does not implement the TimeCapsuleVisual simulator widget.
 */

import { FULL_HOSTNAME } from "@/common/constant";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CTA from "@/components/public/CTA";
import Link from "next/link";
import TimeCapsuleVisual from "./TimeCapsuleVisual";

const title = "Time Capsule Encryption - Cipherwill";
const description =
  "Discover how Cipherwill's Time Capsule Encryption keeps your digital stuff safe, making sure it's securely passed on to your loved ones with top-notch security.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/time-capsule-encryption`,
  },
};

export default function TimeCapsuleEncryption() {
  return (
    <div className="bg-cream min-h-screen text-forest font-sans">
      <SmoothPageScroll />
      <Header />

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-forest/10 bg-parchment/50 text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Timed-Release Cryptography
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold text-forest leading-tight">
          Time Capsule Encryption
        </h1>
        <p className="mt-6 text-base sm:text-lg text-forest/70 max-w-xl mx-auto font-medium leading-relaxed">
          {description}
        </p>
      </section>

      {/* Simulator Interface Section */}
      <section className="px-4 py-8 max-w-7xl mx-auto">
        <TimeCapsuleVisual />
      </section>

      {/* Deep Technical Explanations Grid */}
      <section className="px-4 py-12 max-w-5xl mx-auto font-medium text-forest">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="bg-white border border-forest/10 rounded-2xl p-6 md:p-8 shadow-level-1">
            <h2 className="font-playfair text-2xl font-bold mb-4">
              What is Timed-Release Encryption?
            </h2>
            <p className="text-forest/70 text-sm sm:text-base leading-relaxed">
              Timed-release encryption (TRE) combines traditional public-key cryptography with trustless, time-dependent controls. Decryption requires a unique "trapdoor" key that is mathematically generated and broadcast by an autonomous decentralized network of time beacons. No human action can reveal the key before the specified block time.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-forest/10 rounded-2xl p-6 md:p-8 shadow-level-1">
            <h2 className="font-playfair text-2xl font-bold mb-4">
              Why it Matters for Digital Wills
            </h2>
            <p className="text-forest/70 text-sm sm:text-base leading-relaxed">
              Digital assets contain sensitive property and emotional records. Premature exposure can lead to complications or invasion of privacy. Time Capsule Encryption guarantees that your secrets remain locked in a cryptographic vacuum until the designated handoff date. This creates a secure, tamper-proof bridge across time.
            </p>
          </div>
        </div>
      </section>

      {/* Double Guard Feature Section (Alternating Dark Block) */}
      <section className="bg-forest text-cream py-20 px-4 mt-16 font-medium">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white leading-tight">
              Our Dual-Layer Cryptographic Shield
            </h2>
            <p className="text-cream/80 text-sm sm:text-base leading-relaxed mt-4">
              We never trust a single point of failure. Your Time Capsule works as part of a{" "}
              <Link href="/i/cascade-encryption" className="text-white underline hover:text-cream/80 font-bold">
                Cascade Encryption
              </Link>{" "}
              sequence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="border border-cream/10 bg-cream/5 rounded-2xl p-6">
              <span className="font-mono text-xs font-bold opacity-50 block mb-1">INNER LAYER</span>
              <h3 className="text-xl font-bold text-white mb-3">Time Capsule Lock</h3>
              <p className="text-sm text-cream/70 leading-relaxed">
                Your data is first encrypted with a unique time capsule key. This is managed by an immutable, decentralized time-server beacon, keeping it closed until target check-in timelines elapse.
              </p>
            </div>

            <div className="border border-cream/10 bg-cream/5 rounded-2xl p-6">
              <span className="font-mono text-xs font-bold opacity-50 block mb-1">OUTER LAYER</span>
              <h3 className="text-xl font-bold text-white mb-3">Beneficiary Key Lock</h3>
              <p className="text-sm text-cream/70 leading-relaxed">
                The capsule is immediately encrypted *again* with the beneficiary's public key. Even if the timelock beacon matures, the file remains fully locked and private until the authorized beneficiary signs in.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
}