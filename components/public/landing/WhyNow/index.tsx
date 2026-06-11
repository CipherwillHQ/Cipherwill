/**
 * What it does: Orchestrates the "Why Now" statistics and guide section on the landing page.
 * What it owns: Dark container layout, statistics columns, and the Clay empathy guide block.
 * What it does NOT do: Does not anim-entrance stats individually.
 */

"use client";

import { motion } from "framer-motion";
import { TbAlertTriangle, TbHeart } from "react-icons/tb";
import StatItem from "./StatItem";

export default function WhyNow() {
  return (
    <div className="w-full bg-forest text-cream py-24 border-b border-cream/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="flex flex-col md:items-center text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-3xl sm:text-4xl md:text-5xl leading-tight font-black text-cream max-w-3xl"
          >
            Procrastination is the real digital threat
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-gilroy font-medium text-cream/70 text-base md:text-lg max-w-2xl mt-4"
          >
            We prepare for everything else in life — insurance, wills, savings plans — yet leave our critical digital accounts and memories completely vulnerable to a sudden cutoff.
          </motion.p>
        </div>

        {/* 3-Column Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatItem 
            number="$140+ Billion"
            label="Stranded Crypto"
            sublabel="Estimated total of locked, inaccessible blockchain assets due to missing backup key handoffs."
            delay={0.1}
          />
          <StatItem 
            number="2.4 Million"
            label="Permanent Lockouts"
            sublabel="Accounts permanently deleted or locked annually by web platforms due to unnotified passings."
            delay={0.2}
          />
          <StatItem 
            number="15 - 30 Hours"
            label="Family Distress"
            sublabel="Average time grieving families spend dealing with platforms, lawyers, and servers to retrieve keys."
            delay={0.3}
          />
        </div>

        {/* Clay Empathy Panel (as per Design.md Wizard/Isolation Guide accents) */}
        <div className="mt-12 max-w-4xl mx-auto p-6 rounded-2xl bg-clay/10 border border-clay/15 text-cream">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="p-3 rounded-xl bg-clay/20 text-clay shrink-0">
              <TbHeart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-gilroy font-bold text-sm text-clay uppercase tracking-wider">
                An Act of Deep Care & Relief
              </h4>
              <p className="font-gilroy font-medium text-xs sm:text-sm text-cream/80 mt-1 leading-relaxed">
                Securing your digital inheritance is not a cold legal task; it is a profound gesture of protection. Take 10 minutes today to build a bridge for your loved ones, so they aren't left facing digital lockouts during their most difficult moments.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
