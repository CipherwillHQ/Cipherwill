/**
 * ScrollDownButton.tsx
 * What it does: Displays a smooth scrolling button that anchors the user to the comparison section.
 * What it owns: Button trigger, dynamic document element lookup, and scroll positioning.
 * What it does NOT do: Hold comparison item details or pricing plans.
 */

"use client";

import { motion } from "framer-motion";
import { TbChevronDown } from "react-icons/tb";

export default function ScrollDownButton() {
  const handleScroll = () => {
    const tableEl = document.getElementById("compare-table");
    if (tableEl) {
      tableEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex justify-center items-center py-6 select-none">
      <motion.button
        whileHover={{ y: 2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleScroll}
        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-forest/10 rounded-full font-gilroy font-semibold text-xs sm:text-sm text-forest/70 hover:text-forest hover:border-forest/20 shadow-level-1 transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-[#003ecb]"
      >
        <TbChevronDown size={16} className="text-[#003ecb] animate-bounce" />
        <span>Compare all features in detail</span>
        <TbChevronDown size={16} className="text-[#003ecb] animate-bounce" />
      </motion.button>
    </div>
  );
}
