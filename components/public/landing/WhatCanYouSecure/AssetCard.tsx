/**
 * What it does: Renders an individual secure category card with hover lifts and an "encrypting" monospace key overlay.
 * What it owns: Card layouts, hover shadow effects, and hover decrypting text states.
 * What it does NOT do: Does not define the list of asset records.
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AssetCategory } from "./data";

interface AssetCardProps {
  category: AssetCategory;
}

export default function AssetCard({ category }: AssetCardProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  const IconComp = category.icon;

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4 }}
      className={`p-6 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between h-full bg-cream/5 ${
        hovered 
          ? "border-sage/40 bg-cream/[0.08] shadow-level-1" 
          : "border-cream/10"
      }`}
    >
      <div className="space-y-4">
        {/* Card Header Icon */}
        <div className={`p-2.5 rounded-xl w-fit transition-colors ${
          hovered ? "bg-sage/25 text-sage" : "bg-sage/10 text-sage"
        }`}>
          <IconComp className="w-6 h-6" />
        </div>

        {/* Title & Copy */}
        <div>
          <h3 className="font-gilroy font-bold text-base text-cream leading-tight">
            {category.title}
          </h3>
          <p className="font-gilroy font-medium text-xs sm:text-sm text-cream/70 mt-2 leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Interactive Cryptographic Shard overlay */}
      <div className="mt-5 pt-4 border-t border-cream/5 flex flex-col space-y-1">
        <span className="font-gilroy font-bold text-[9px] uppercase tracking-wider text-cream/30">
          {hovered ? "Decrypted Memory Buffer" : "Cryptographic Envelope Hash"}
        </span>
        <code className="font-mono text-[10px] truncate leading-none transition-colors text-sage/60 select-all">
          {hovered ? category.encryptedSample : "••••••••••••••••••••••••"}
        </code>
      </div>
    </motion.div>
  );
}
