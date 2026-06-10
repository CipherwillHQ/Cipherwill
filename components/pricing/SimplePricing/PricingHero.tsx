/**
 * PricingHero.tsx
 * What it does: Renders the clean, elegant editorial header section of the pricing page.
 * What it owns: Page badge, high-breathing Playfair typography, and the written pricing description.
 * What it does NOT do: Hold global plan states, display pricing cards, or render graphical animations.
 */

"use client";

import { motion } from "framer-motion";

export default function PricingHero() {
  return (
    <section className="relative overflow-hidden bg-cream pt-32 pb-12 sm:pb-16 text-center select-none">
      {/* Decorative Ambient Background Blurs */}
      <div className="absolute top-0 right-0 -z-10 h-120 w-125 rounded-full bg-sage/5 blur-3xl animate-pulse duration-8000" />
      <div className="absolute bottom-0 left-0 -z-10 h-120 w-125 rounded-full bg-clay/5 blur-2xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Sub-Header Badge */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block font-mono text-xs uppercase tracking-widest text-[#003ecb] font-bold bg-[#003ecb]/10 px-4 py-1.5 rounded-full"
        >
          Value & Infrastructure Access
        </motion.span>

        {/* Playfair Typography Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-forest tracking-tight leading-tight max-w-4xl mx-auto"
        >
          Worth More Than a Coffee.<br />
          <span className="text-forest/80">Secured for Less Than Its Cost.</span>
        </motion.h1>

        {/* Supporting Subtitle - Rewritten and Clear */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-forest/70 font-gilroy font-medium leading-relaxed"
        >
          Choose our Lifetime Free plan for foundational protection, or unlock full platform capabilities with our Premium annual membership. Simple, predictable pricing with zero hidden fees and absolute client-side sovereignty.
        </motion.p>

      </div>
    </section>
  );
}
