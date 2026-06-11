/**
 * What it does: Renders the responsive side-by-side comparison table with interactive hover feedback.
 * What it owns: Table cell layouts, active row state indicators, and inline highlight alert boxes.
 * What it does NOT do: Does not define the raw comparison dataset.
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbAlertCircle, TbCheck, TbX } from "react-icons/tb";
import { COMPARISON_ROWS } from "./data";

export default function ComparisonTable() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="w-full mt-12 flex flex-col space-y-6">
      <div className="overflow-x-auto rounded-2xl border border-forest/10 bg-white">
        <table className="w-full border-collapse text-left min-w-[700px]">
          <thead>
            <tr className="bg-parchment/50 border-b border-forest/10 font-gilroy font-bold text-xs uppercase tracking-wider text-forest/70">
              <th className="p-5">Handoff Feature</th>
              <th className="p-5">Traditional Will</th>
              <th className="p-5">Password Manager</th>
              <th className="p-5 bg-primary/5 text-primary">Cipherwill</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest/5 font-gilroy font-medium text-sm text-forest/80">
            {COMPARISON_ROWS.map((row, idx) => (
              <tr 
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`transition-colors cursor-default ${
                  hoveredIdx === idx ? "bg-parchment/30" : ""
                }`}
              >
                <td className="p-5 font-bold text-forest">{row.criterion}</td>
                <td className="p-5 text-error/80 text-xs sm:text-sm">
                  <div className="flex items-start gap-2">
                    <TbX className="w-4 h-4 text-error mt-0.5 shrink-0" />
                    <span>{row.paperWill}</span>
                  </div>
                </td>
                <td className="p-5 text-warning/90 text-xs sm:text-sm">
                  <div className="flex items-start gap-2">
                    <TbX className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                    <span>{row.passwordManager}</span>
                  </div>
                </td>
                <td className="p-5 bg-primary/[0.02] text-forest font-semibold text-xs sm:text-sm">
                  <div className="flex items-start gap-2">
                    <TbCheck className="w-4 h-4 text-sage mt-0.5 shrink-0" />
                    <span>{row.cipherwill}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Explanatory Highlight Panel */}
      <div className="min-h-[70px] relative">
        <AnimatePresence mode="wait">
          {hoveredIdx !== null ? (
            <motion.div
              key={hoveredIdx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="p-4 rounded-xl bg-clay/10 border border-clay/20 text-clay-800 flex items-center gap-3 font-gilroy font-semibold text-xs sm:text-sm"
            >
              <TbAlertCircle className="w-5 h-5 text-clay shrink-0" />
              <span>{COMPARISON_ROWS[hoveredIdx].highlight}</span>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl border border-forest/5 text-forest/40 flex items-center justify-center gap-2 font-gilroy font-semibold text-xs sm:text-sm italic"
            >
              Hover over any feature row above to see why conventional tools fall short.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
