/**
 * DataJourney component for the public Security page.
 * Owns the visual timeline showcasing the cryptographic lifecycle of a user's data.
 * Does NOT own the Hero section, Three Pillars, or FAQ accordion.
 */

"use client";

import { FiEdit3, FiLock, FiCloud, FiUnlock } from "react-icons/fi";

const steps = [
  {
    stepNum: "01",
    label: "Data Input",
    title: "Raw Data Provided",
    description: "You enter sensitive items (passwords, files, wills) in our secure dashboard locally.",
    icon: <FiEdit3 className="w-6 h-6 text-forest" />,
  },
  {
    stepNum: "02",
    label: "Local Seal",
    title: "Client-Side Encryption",
    description: "Your browser encrypts raw data with AES-256 before leaving your computer.",
    icon: <FiLock className="w-6 h-6 text-sage" />,
  },
  {
    stepNum: "03",
    label: "Cloud Storage",
    title: "Sealed Zero-Knowledge Vault",
    description: "Only ciphertext is stored in the cloud. It is completely unreadable to Cipherwill.",
    icon: <FiCloud className="w-6 h-6 text-forest" />,
  },
  {
    stepNum: "04",
    label: "Decryption",
    title: "Beneficiary Unlock",
    description: "Decryption occurs only on the verified beneficiary's device using their private key.",
    icon: <FiUnlock className="w-6 h-6 text-sage" />,
  },
];

export default function DataJourney() {
  return (
    <section className="bg-cream/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-sage font-semibold bg-sage/10 px-3 py-1 rounded-full">
            Cryptographic Flow
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-tight mt-6">
            The Data Lifecycle
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-forest/60">
            How your sensitive information is transformed from plaintext into unbreakable ciphertext.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="mt-20 relative">
          {/* Connecting Line - Desktop Only */}
          <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-forest/10 via-sage/50 to-forest/10 -z-10" />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center group">
                {/* Step Circle with Icon */}
                <div className="relative flex items-center justify-center w-20 h-20 rounded-full border border-forest/15 bg-white shadow-level-1 group-hover:border-sage group-hover:scale-105 transition-all duration-300">
                  <div className="absolute -top-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full bg-forest text-[10px] font-mono font-bold text-cream">
                    {step.stepNum}
                  </div>
                  {step.icon}
                </div>

                {/* Content */}
                <span className="mt-6 font-mono text-xs uppercase tracking-wider text-sage font-semibold">
                  {step.label}
                </span>

                <h3 className="mt-2 font-playfair text-lg font-bold text-forest group-hover:text-sage transition-colors duration-300">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm text-forest/70 max-w-xs leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
