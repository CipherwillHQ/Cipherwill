/**
 * What it does: Orchestrates the "What Can You Secure" card grid section on the landing page.
 * What it owns: Dark container wrapper, section titles, and grid list layouts.
 * What it does NOT do: Does not manage mouse hovers inside individual card nodes.
 */

"use client";

import { motion } from "framer-motion";
import { ASSET_CATEGORIES } from "./data";
import AssetCard from "./AssetCard";

export default function WhatCanYouSecure() {
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
            What you can store and secure
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-gilroy font-medium text-cream/70 text-base md:text-lg max-w-2xl mt-4"
          >
            Your Cipherwill setup is incredibly versatile. Encrypt and pass down anything that requires precise, conditional, end-to-end encrypted keys to open.
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ASSET_CATEGORIES.map((category, idx) => (
            <AssetCard key={idx} category={category} />
          ))}
        </div>

      </div>
    </div>
  );
}
