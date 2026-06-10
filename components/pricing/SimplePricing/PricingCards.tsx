/**
 * PricingCards.tsx
 * What it does: Renders the two primary pricing plan cards (Free vs Premium).
 * What it owns: Card layouts, feature checklists, price listings, discounts, and custom plan CTA buttons.
 * What it does NOT do: Direct database operations or payment integrations. Links out to billing pathways.
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TbCheck, TbDiscount } from "react-icons/tb";

interface PricingCardsProps {
  isPremiumRecommended: boolean;
}

export default function PricingCards({ isPremiumRecommended }: PricingCardsProps) {
  const freeFeatures = [
    "Secure up to 5 Beneficiaries",
    "Notes, Passwords & Traditional Assets",
    "Zero-Knowledge Client-Side Protection",
    "Email-only Dead Man's Switch",
    "Standard Customer Support",
  ];

  const premiumFeatures = [
    "Unlimited Beneficiaries",
    "Web3 Crypto Key & Seed Phrase Vault",
    "1 GB Encrypted Scanned Document Storage",
    "Per-Item Unique Beneficiary Assignment",
    "Failsafe Communications (Calls, SMS, WhatsApp)",
    "Priority Live Chat Support",
    "Lifetime Codebase Audit Access",
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* Card 1: Lifetime Free */}
        <motion.div
          id="free-card"
          animate={{
            borderColor: !isPremiumRecommended ? "rgba(122, 160, 137, 0.4)" : "rgba(42, 54, 59, 0.08)",
            scale: !isPremiumRecommended ? 1.01 : 1,
          }}
          transition={{ duration: 0.3 }}
          className={`relative flex flex-col justify-between p-6 sm:p-8 bg-white border rounded-2xl ${
            !isPremiumRecommended ? "shadow-level-1" : ""
          }`}
        >
          {/* Recommends badge */}
          {!isPremiumRecommended && (
            <span className="absolute top-4 right-4 bg-sage/10 text-sage font-mono text-[10px] uppercase font-bold px-3 py-1 rounded-full">
              Your Recommended Match
            </span>
          )}

          <div>
            <div className="mb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-forest/50 font-bold">
                Level 01
              </span>
              <h4 className="font-playfair text-2xl font-bold text-forest mt-1">
                Lifetime Free
              </h4>
              <p className="text-xs font-gilroy font-semibold text-forest/50 mt-1">
                Essential digital legacy planning
              </p>
            </div>

            <div className="my-6">
              <span className="font-gilroy text-5xl font-extrabold text-forest">$0</span>
              <span className="text-sm font-semibold text-forest/50 ml-1">/ Lifetime</span>
            </div>

            <p className="text-sm font-gilroy font-medium text-forest/70 leading-relaxed mb-6">
              Establish a baseline protection plan for your passwords, bank account details, and core digital instructions at zero cost.
            </p>

            <div className="border-t border-forest/10 pt-6">
              <span className="text-xs uppercase font-mono tracking-widest text-forest/40 font-bold block mb-4">
                What's Included:
              </span>
              <ul className="space-y-3">
                {freeFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm font-gilroy font-medium text-forest/80">
                    <TbCheck size={18} className="text-sage mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/app/billing" className="w-full">
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-forest text-sm font-gilroy font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer"
              >
                Create Free Will →
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Card 2: Premium */}
        <motion.div
          id="infinite-card"
          animate={{
            borderColor: isPremiumRecommended ? "rgba(0, 62, 203, 0.4)" : "rgba(42, 54, 59, 0.08)",
            scale: isPremiumRecommended ? 1.01 : 1,
          }}
          transition={{ duration: 0.3 }}
          className={`relative flex flex-col justify-between p-6 sm:p-8 bg-white border rounded-2xl ${
            isPremiumRecommended ? "shadow-level-2 border-primary/20" : "shadow-level-1"
          }`}
        >
          {/* Badge accent */}
          <span className="absolute top-4 right-4 bg-[#003ecb]/10 text-[#003ecb] font-mono text-[10px] uppercase font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <TbDiscount size={12} />
            {isPremiumRecommended ? "Recommended Match" : "Best Value"}
          </span>

          <div>
            <div className="mb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[#003ecb] font-bold">
                Level 02
              </span>
              <h4 className="font-playfair text-2xl font-bold text-forest mt-1">
                Premium
              </h4>
              <p className="text-xs font-gilroy font-semibold text-forest/50 mt-1">
                Uncompromising cryptographic estate security
              </p>
            </div>

            <div className="my-6">
              <span className="inline-block bg-[#003ecb]/10 text-[#003ecb] px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                Annual Membership (Billed Annually)
              </span>
              <div className="flex items-baseline">
                <span className="font-mono text-xl text-forest/40 line-through mr-2 font-semibold">
                  $60
                </span>
                <span className="font-gilroy text-5xl font-extrabold text-forest">
                  $40
                </span>
                <span className="text-xl font-bold text-[#003ecb] ml-1.5">
                  / Year
                </span>
              </div>
              <span className="text-xs font-mono font-extrabold text-sage block mt-2 uppercase tracking-wide">
                Saving 30% - Equivalent to just $3.33/Month
              </span>
              <span className="text-[11px] font-gilroy font-semibold text-forest/50 block mt-1">
                Billed once annually at $40. Cancel or downgrade anytime.
              </span>
            </div>

            <p className="text-sm font-gilroy font-medium text-forest/70 leading-relaxed mb-6">
              Protect your comprehensive estate. From Web3 seed phrases and raw private keys to physical deeds, wills, and granular beneficiary triggers.
            </p>

            <div className="border-t border-forest/10 pt-6">
              <span className="text-xs uppercase font-mono tracking-widest text-forest/40 font-bold block mb-4">
                Full Platform Capabilities:
              </span>
              <ul className="space-y-3">
                {premiumFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm font-gilroy font-medium text-forest/80">
                    <TbCheck size={18} className="text-[#003ecb] mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/app/billing" className="w-full">
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-linear-to-r from-primary-700 to-primary text-white text-sm font-gilroy font-semibold rounded-xl hover:from-primary-800 hover:to-primary-600 transition-all duration-200 flex items-center justify-center gap-1 shadow-level-1 cursor-pointer"
              >
                Secure Yearly Legacy Now →
              </motion.button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
