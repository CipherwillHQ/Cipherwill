/**
 * What it does: Orchestrates the "Alternatives Flaw" comparative section on the landing page.
 * What it owns: Section layout containers, headline typography, and responsive grid centering.
 * What it does NOT do: Does not manage table mouse states or cell hover events directly.
 */

"use client";

import { motion } from "framer-motion";
import ComparisonTable from "./ComparisonTable";

export default function AlternativesFlaw() {
  return (
    <div className="w-full bg-cream py-24 border-b border-forest/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="flex flex-col md:items-center text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-3xl sm:text-4xl md:text-5xl leading-tight font-black text-forest max-w-3xl"
          >
            Why paper wills and password managers simply fail
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-gilroy font-medium text-forest/70 text-base md:text-lg max-w-2xl mt-4"
          >
            Paper wills are static and lack real-time triggers. Password managers secure your life but trap it behind a master passcode your grieving family does not know. You need a bridge.
          </motion.p>
        </div>

        {/* Comparison Table */}
        <ComparisonTable />

      </div>
    </div>
  );
}
