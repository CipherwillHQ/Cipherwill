/**
 * What it does: Orchestrates the "What happens if I pass away tomorrow?" visual decay timeline section.
 * What it owns: Ambient background glow, section titles, full-bleed visual cards grid, and solution banner.
 * What it does NOT do: Does not run backend verification triggers or perform encryption logic.
 */

"use client";

import { motion } from "framer-motion";
import { TIMELINE_EVENTS } from "./data";
import DecayCard from "./DecayCard";
import SolutionBanner from "./SolutionBanner";

export default function ProblemSection() {
  return (
    <section className="relative w-full bg-forest text-cream py-24 sm:py-32 border-b border-cream/10 select-none overflow-hidden">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-b from-error/10 via-warning/5 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-sage/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center flex flex-col items-center mb-14 sm:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-3xl sm:text-4xl md:text-5xl leading-tight font-black text-cream max-w-5xl text-balance"
          >
            What actually happens to your assets <br className="hidden sm:inline" />
            and memories if you pass away tomorrow?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-gilroy font-medium text-cream/70 text-base md:text-lg max-w-2xl mt-4 text-balance"
          >
            Platforms, device locks, and automated billing scripts are designed to lock everyone out and permanently delete your data by default.
          </motion.p>
        </div>

        {/* 4-Column Visual Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-12">
          {TIMELINE_EVENTS.map((event, idx) => (
            <DecayCard key={idx} event={event} index={idx} />
          ))}
        </div>

        {/* The Cipherwill Solution Banner */}
        <SolutionBanner />

      </div>
    </section>
  );
}
