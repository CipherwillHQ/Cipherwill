/**
 * What it does: Renders the minimal Cipherwill Solution contrast banner matching the width and border style of the decay cards above.
 * What it owns: Card styling, minimal value proposition, and clean responsive alignment.
 * What it does NOT do: Does not alter global fonts or render distracting CTA buttons.
 */

"use client";

import { motion } from "framer-motion";
import { TbShieldCheck } from "react-icons/tb";

export default function SolutionBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full p-5 sm:p-6 rounded-2xl bg-cream/5 border border-cream/15 text-cream select-none hover:border-cream/25 transition-colors duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="p-2.5 sm:p-3 rounded-xl bg-sage/10 text-sage border border-sage/20 shrink-0">
          <TbShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-gilroy font-bold text-xs sm:text-sm text-sage uppercase tracking-wider">
            The Cipherwill Solution
          </h4>
          <p className="font-gilroy font-medium text-xs sm:text-sm text-cream/80 mt-1 leading-relaxed">
            We break this silent decay. Your zero-knowledge encrypted plan safely transfers private keys, accounts, and memories to your designated beneficiaries.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
