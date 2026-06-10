/**
 * ThreePillars component for the public Security page.
 * Owns the 3-column grid explaining the core pillars of Cipherwill's security.
 * Does NOT own the Hero section, Data Journey, or FAQ accordion.
 */

"use client";

const pillars = [
  {
    title: "Client-Side Encryption",
    description:
      "All sensitive assets are locked using AES-256-GCM right in your browser or device app before they are uploaded. Your device holds the master key—never our servers.",
    icon: (
      <svg className="w-12 h-12 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Zero-Knowledge Architecture",
    description:
      "We design our architecture so that Cipherwill is mathematically blind to your contents. Because we do not store or transmit your raw passwords or keys, we cannot access your digital will under any circumstance.",
    icon: (
      <svg className="w-12 h-12 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.474 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    ),
  },
  {
    title: "Open Source Transparency",
    description:
      "Security shouldn't rely on blind faith. Our core cryptographic protocols, client-side encryption libraries, and smart-contract specifications are inspectable, open, and community-audited.",
    icon: (
      <svg className="w-12 h-12 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
];

export default function ThreePillars() {
  return (
    <section className="bg-white py-20 sm:py-28 border-y border-forest/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-tight">
            Built on Unshakable Pillars
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-forest/60">
            A secure foundation built on client-side control and cryptographic openness.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between rounded-2xl border border-forest/10 p-8 bg-cream/30 hover:bg-cream/50 transition-all duration-300 ease-cw-ease hover:shadow-level-1 hover:-translate-y-1"
            >
              <div>
                {/* Minimalist Custom Icon */}
                <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-xl bg-sage/5 group-hover:bg-sage/10 transition-colors duration-300">
                  {pillar.icon}
                </div>

                <h3 className="font-playfair text-xl font-bold text-forest group-hover:text-sage transition-colors duration-300">
                  {pillar.title}
                </h3>

                <p className="mt-4 text-sm text-forest/70 leading-relaxed font-medium">
                  {pillar.description}
                </p>
              </div>

              {/* High-end subtle border line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-sage/0 group-hover:bg-sage/40 rounded-b-2xl transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
