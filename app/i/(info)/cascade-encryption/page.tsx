/*
 * page.tsx
 * What it does: Renders the public explainer page for Cascade Encryption.
 * What it owns: Page layout, SEO metadata, high-level educational sections, and CTAs.
 * What it does NOT do: It does not implement the CascadeVisual diagram component.
 */

import { FULL_HOSTNAME } from "@/common/constant";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CTA from "@/components/public/CTA";
import Link from "next/link";
import CascadeVisual from "./CascadeVisual";

const title = "Cascade Encryption - Cipherwill";
const description =
  "Learn about Cipherwill's Cascade Encryption, a secure encryption method enabling seamless data transfer while maintaining privacy through advanced cryptographic techniques.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/cascade-encryption`,
  },
};

export default function CascadeEncryptionDetails() {
  return (
    <div className="bg-cream min-h-screen text-forest font-sans">
      <SmoothPageScroll />
      <Header />

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-forest/10 bg-parchment/50 text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Layered Cryptography
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold text-forest leading-tight">
          Cascade Encryption
        </h1>
        <p className="mt-6 text-base sm:text-lg text-forest/70 max-w-xl mx-auto font-medium leading-relaxed">
          {description}
        </p>
      </section>

      {/* Interactive Blueprint Section */}
      <section className="px-4 py-8 max-w-7xl mx-auto">
        <CascadeVisual />
      </section>

      {/* Structured Technical Explanation Section */}
      <section className="px-4 py-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-medium">
          {/* Card 1 */}
          <div className="bg-white border border-forest/10 rounded-2xl p-6 md:p-8 shadow-level-1">
            <h2 className="font-playfair text-2xl font-bold text-forest mb-4">
              What is Cascade Encryption?
            </h2>
            <p className="text-forest/70 text-sm sm:text-base leading-relaxed">
              Cascade encryption secures sensitive digital data by applying multiple separate layers of encryption sequentially. Rather than trusting a single key, password, or algorithm, Cascade encryption mandates that an attacker must break every single mathematical seal in the sequence to inspect the underlying file. Each layer acts as an independent security checkpoint.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-forest/10 rounded-2xl p-6 md:p-8 shadow-level-1">
            <h2 className="font-playfair text-2xl font-bold text-forest mb-4">
              Why Cascade Matters Here
            </h2>
            <p className="text-forest/70 text-sm sm:text-base leading-relaxed">
              In a typical dead man's switch, a platform hold copies of keys. With Cipherwill's ordered Cascade system, even if our time capsule keys are leaked or exposed prematurely, your secrets remain entirely secure. Decryption is physically impossible without the beneficiary's private key, keeping your assets completely safe until they are successfully delivered.
            </p>
            <Link
              href="/i/time-capsule-encryption"
              className="inline-block mt-4 text-xs font-mono font-bold uppercase tracking-wider text-primary hover:text-primary-700 underline"
            >
              Learn about Time Capsules →
            </Link>
          </div>
        </div>
      </section>

      {/* Cryptographic Standards Block (Alternating Theme: Dark Section) */}
      <section className="bg-forest text-cream py-20 px-4 mt-16 font-medium">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-6">
            Enterprise Cryptographic Protocols
          </h2>
          <p className="text-cream/80 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
            Our cascade framework adheres strictly to open-source protocols. We combine high-performance symmetric algorithms with asymmetric elliptic curves for maximum performance and ultimate resilience.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="border border-cream/10 bg-cream/5 rounded-xl p-5">
              <span className="font-mono text-xs opacity-50 font-bold block mb-1">AES-256-GCM</span>
              <h3 className="font-semibold text-white mb-2">Authenticated Layer</h3>
              <p className="text-xs text-cream/70">
                Symmetric cipher protecting file confidentiality and integrity on-device.
              </p>
            </div>
            <div className="border border-cream/10 bg-cream/5 rounded-xl p-5">
              <span className="font-mono text-xs opacity-50 font-bold block mb-1">ECDH (SECP256K1)</span>
              <h3 className="font-semibold text-white mb-2">Key Exchange Layer</h3>
              <p className="text-xs text-cream/70">
                Secures handoffs, ensuring only the target beneficiary is capable of initiating decryption.
              </p>
            </div>
            <div className="border border-cream/10 bg-cream/5 rounded-xl p-5">
              <span className="font-mono text-xs opacity-50 font-bold block mb-1">TIMELOCK</span>
              <h3 className="font-semibold text-white mb-2">Time-Release Gate</h3>
              <p className="text-xs text-cream/70">
                Secured by decentralized public random beacons, keeping keys locked until target deadlines expire.
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