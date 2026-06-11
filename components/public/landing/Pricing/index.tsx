/**
 * What it does: Renders a beautifully compact, minimal pricing summary section.
 * What it owns: High-level pricing plans comparison row and CTA linking to the full pricing page.
 * What it does NOT do: Does not render full-size pricing checklists or manage checkout integration.
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TbCheck, TbArrowRight } from "react-icons/tb";

export default function Pricing() {
  const springTransition = { type: "spring" as const, stiffness: 400, damping: 15 };

  return (
    <div className="w-full bg-cream py-24 border-b border-forest/10 select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="flex flex-col md:items-center text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-3xl sm:text-4xl md:text-5xl leading-tight font-black text-forest max-w-3xl"
          >
            Secure your digital legacy starting at $0
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-gilroy font-medium text-forest/70 text-base md:text-lg max-w-2xl mt-4"
          >
            From essential password protection to full-scale Web3 crypto key & document failsafes, choose the level of protection that fits your digital estate.
          </motion.p>
        </div>

        {/* Minimalist Side-by-Side Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch mb-12">
          
          {/* Card 1: Lifetime Free */}
          <div className="p-6 rounded-2xl border border-forest/10 bg-white flex flex-col justify-between h-full shadow-level-1">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-forest/40 font-bold">
                Level 01
              </span>
              <h3 className="font-playfair text-xl font-bold text-forest mt-1">
                Lifetime Free
              </h3>
              <p className="text-xs font-gilroy font-semibold text-sage mt-1">
                $0 / Free Forever
              </p>
              <p className="font-gilroy font-medium text-xs sm:text-sm text-forest/70 mt-3 leading-relaxed">
                Establish basic protection for passwords, accounts, and core instructions with our E2E encrypted email-only dead man's switch.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-gilroy font-bold text-forest/50">
              <TbCheck className="text-sage w-4 h-4 shrink-0" />
              <span>Up to 5 Beneficiaries Included</span>
            </div>
          </div>

          {/* Card 2: Premium */}
          <div className="p-6 rounded-2xl border border-primary/20 bg-white flex flex-col justify-between h-full shadow-level-1 ring-1 ring-primary/5">
            <div>
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] uppercase tracking-wider text-primary font-bold">
                  Level 02
                </span>
                <span className="bg-primary/10 text-primary font-mono text-[8px] uppercase font-bold px-2 py-0.5 rounded-full">
                  Best Value
                </span>
              </div>
              <h3 className="font-playfair text-xl font-bold text-forest mt-1">
                Premium Plan
              </h3>
              <p className="text-xs font-gilroy font-semibold text-primary mt-1">
                $40 / Year (Saving 30%)
              </p>
              <p className="font-gilroy font-medium text-xs sm:text-sm text-forest/70 mt-3 leading-relaxed">
                Uncompromising security with Web3 crypto seed phrases storage, 1GB document files, and failsafe Calls/SMS/WhatsApp check-in schedules.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-gilroy font-bold text-forest/50">
              <TbCheck className="text-primary w-4 h-4 shrink-0" />
              <span>Unlimited Beneficiaries & Priority Handoffs</span>
            </div>
          </div>

        </div>

        {/* Central Compare CTA Link */}
        <div className="text-center">
          <Link href="/pricing" className="inline-block">
            <motion.button
              whileTap={{ scale: 0.98 }}
              transition={springTransition}
              className="px-8 py-4 rounded-xl bg-primary text-white font-gilroy font-bold text-sm transition-colors hover:bg-primary-700 flex items-center justify-center gap-2 cursor-pointer shadow-level-1"
            >
              <span>Compare Plans & View Pricing</span>
              <TbArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>

      </div>
    </div>
  );
}
