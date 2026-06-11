/**
 * Hero component for the public landing page.
 * Implements a clean, centered, ultra-minimalist layout containing only the core text copy and CTA buttons.
 * Keeps file size under 200 lines per project guidelines.
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TbShieldCheck } from "react-icons/tb";

export default function Hero() {
  const springTransition = { type: "spring" as const, stiffness: 400, damping: 15 };

  return (
    <div className="relative w-full flex flex-col items-center justify-center bg-cream px-4 sm:px-6 lg:px-8 pt-32 pb-16 md:pt-44 md:pb-20 overflow-hidden select-none">
      
      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center space-y-10">
        
        {/* Trust Badge / Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage/10 border border-sage/20 text-sage font-gilroy font-semibold text-xs tracking-wider uppercase"
        >
          <TbShieldCheck className="w-4 h-4" />
          <span>End-to-End Encrypted Dead {"Man's"} Switch</span>
        </motion.div>

        {/* Main Editorial Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight font-gilroy font-black text-forest max-w-5xl w-full"
        >
          Your life is digital.<br />Why your will is still on paper?
        </motion.h1>

        {/* Calming Body Copy / Description */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl max-w-3xl text-forest/80 font-gilroy font-medium leading-relaxed"
        >
          Securely pass down your crypto, code, cloud storage, and digital legacy to the people who matter. No 2FA lockouts. No lost assets.
        </motion.p>

        {/* Action CTAs / Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto"
        >
          <motion.div whileTap={{ scale: 0.98 }} transition={springTransition} className="w-full sm:w-auto">
            <Link 
              href="/app" 
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-gilroy font-semibold text-base transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:bg-primary-800 shadow-level-1"
            >
              <span>Get Started →</span>
            </Link>
          </motion.div>
          
          <motion.div whileTap={{ scale: 0.98 }} transition={springTransition} className="w-full sm:w-auto">
            <Link 
              href="/how-it-works" 
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-transparent border border-forest/20 text-forest font-gilroy font-semibold text-base transition-colors hover:bg-forest/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span>Learn How it Works</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
}
