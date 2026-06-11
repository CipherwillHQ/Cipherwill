/**
 * What it does: Renders an individual statistic indicator box with scroll-driven anim entrance.
 * What it owns: Stat numbers, labels, units, and fade-up motion animations.
 * What it does NOT do: Does not run dynamic math loops or fetch stats live.
 */

"use client";

import { motion } from "framer-motion";

interface StatItemProps {
  number: string;
  label: string;
  sublabel: string;
  delay: number;
}

export default function StatItem({ number, label, sublabel, delay }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="p-6 rounded-2xl bg-cream/5 border border-cream/10 text-center"
    >
      <span className="font-gilroy font-black text-3xl sm:text-4xl text-clay block tracking-tight">
        {number}
      </span>
      <h4 className="font-gilroy font-bold text-sm text-cream uppercase tracking-wide mt-2">
        {label}
      </h4>
      <p className="font-gilroy font-medium text-xs sm:text-sm text-cream/60 mt-1 leading-relaxed">
        {sublabel}
      </p>
    </motion.div>
  );
}
