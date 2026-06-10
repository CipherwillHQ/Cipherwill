/**
 * CTA component for public-facing pages.
 * Owns the premium, light-themed call-to-action layout, designed to match the high-end editorial style of ThreePillars.
 * Does NOT own user dashboard actions or global headers.
 */

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function CTA() {
  return (
    <section className="bg-white py-20 sm:py-28 border-t border-forest/5">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Premium Light-Themed Card Container Matching ThreePillars Cards */}
        <div className="relative flex flex-col md:flex-row w-full p-8 sm:p-12 lg:p-16 bg-cream/30 hover:bg-cream/50 border border-forest/10 rounded-2xl transition-all duration-300 ease-cw-ease hover:shadow-level-1 hover:-translate-y-1 items-center justify-between gap-8">
          
          {/* Subtle Ambient Light Core */}
          <div className="absolute top-0 right-0 h-[200px] w-[200px] rounded-full bg-sage/5 blur-3xl pointer-events-none" />

          {/* Left Block: Narrative */}
          <div className="flex flex-col gap-4 w-full md:w-2/3 relative z-10 text-left">
            <span className="font-mono text-[10px] uppercase tracking-widest text-sage font-bold">
              Legacy Readiness
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-forest leading-tight">
              Secure Your Digital Legacy.
            </h2>
            <p className="text-sm sm:text-base text-forest/70 font-medium leading-relaxed max-w-xl">
              Do your loved ones know how to access your digital assets, accounts, or private vaults? Ensure your legacy is protected and passed on securely and seamlessly when the time is right.
            </p>
          </div>

          {/* Right Block: Action Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 w-full md:w-1/3 relative z-10 shrink-0">
            <Link href="/app" className="w-full sm:w-auto">
              <div className="bg-linear-to-r from-primary-700 to-primary text-cream font-semibold shadow-sm hover:shadow-level-1 active:scale-[0.98] transition-all duration-200 px-6 py-4 rounded-xl text-xs uppercase tracking-wider cursor-pointer text-center flex items-center justify-center gap-2">
                <span>Get Started in 3 Minutes</span>
                <FiArrowRight className="w-4 h-4" />
              </div>
            </Link>
            
            <Link href="/" className="hover:underline text-xs text-forest/50 font-semibold transition-colors duration-200">
              Learn more about Cipherwill
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
