/**
 * SecurityAudits component for the Security page.
 * Owns the light-themed "Cryptographic Primitives & Audits" technical breakdown.
 * Does NOT own global layouts, Hero, or site FAQs.
 */

"use client";

import { FiCheckCircle, FiCpu, FiKey, FiLock } from "react-icons/fi";

const standards = [
  {
    icon: <FiLock className="w-5 h-5 text-sage" />,
    title: "AES-256-GCM Encryption",
    spec: "Symmetric Cipher",
    description: "The gold standard of bulk data encryption. Encrypts all notes, files, credentials, and assets locally on your device with high-entropy keys.",
  },
  {
    icon: <FiKey className="w-5 h-5 text-sage" />,
    title: "BLS12-381 & SECP256K1",
    spec: "Elliptic Curves",
    description: "Advanced algebraic curves used for digital signature verification, zero-knowledge metadata checks, and secure, non-custodial key exchanges.",
  },
  {
    icon: <FiCpu className="w-5 h-5 text-sage" />,
    title: "Shamir's Secret Sharing",
    spec: "Decomposition Threshold",
    description: "Splits master contingency keys into multiple mathematical fragments (shards) held by independent verifiers to secure the Shard Switch.",
  },
];

export default function SecurityAudits() {
  return (
    <section className="bg-white text-forest py-20 sm:py-28 border-y border-forest/5 relative overflow-hidden">
      <div className="absolute inset-0 m-auto w-96 h-96 rounded-full bg-sage/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Block: Text Details */}
          <div className="lg:col-span-5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-sage font-bold bg-sage/10 px-3 py-1 rounded-full">
              Rigorous Primitives
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mt-6 text-forest">
              Peer-Reviewed <br />
              <span className="italic font-normal text-forest/80">Mathematics.</span>
            </h2>
            <p className="mt-6 text-sm sm:text-base text-forest/70 leading-relaxed font-medium">
              We do not invent proprietary or closed security ciphers. Cipherwill is built strictly upon industry-standard, battle-tested cryptographic primitives, ensuring complete long-term protection.
            </p>
            
            <div className="mt-8 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm font-medium text-forest/90">
                <FiCheckCircle className="text-sage w-4 h-4" />
                <span>100% Client-Side Key Generation</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-forest/90">
                <FiCheckCircle className="text-sage w-4 h-4" />
                <span>Zero-Knowledge Server Logs</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-forest/90">
                <FiCheckCircle className="text-sage w-4 h-4" />
                <span>Independently Auditable Schemas</span>
              </div>
            </div>
          </div>

          {/* Right Block: Primitives Specification Grid */}
          <div className="lg:col-span-7 space-y-4">
            {standards.map((std, idx) => (
              <div
                key={idx}
                className="border border-forest/10 rounded-2xl p-6 bg-cream/30 hover:bg-cream/50 hover:border-sage/45 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sage/5 text-sage">
                    {std.icon}
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-sage font-bold">
                      {std.spec}
                    </span>
                    <h4 className="text-base font-bold text-forest">
                      {std.title}
                    </h4>
                  </div>
                </div>
                <p className="mt-3 text-xs sm:text-sm text-forest/70 leading-relaxed font-medium">
                  {std.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
