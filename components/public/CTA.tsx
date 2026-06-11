/**
 * CTA component for public-facing pages.
 * Owns the premium, light-themed call-to-action layout, designed to match the high-end editorial style of ThreePillars.
 * Features a ultra-high-performance direct-DOM scroll parallax background for unorganized organic mesh nodes.
 * Does NOT own user dashboard actions or global headers.
 */

"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

interface CTAProps {
  titlePrefix?: string;
  loopWords?: string[];
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  secondaryText?: string;
  secondaryLink?: string;
}

const DEFAULT_WORDS = ["tomorrow", "the unexpected", "your family", "whatever comes", "your legacy"];

export default function CTA({
  titlePrefix = "Be ready for ",
  loopWords = DEFAULT_WORDS,
  subtitle = "Legacy planning isn't about the end; it's about giving your loved ones complete clarity. Create a secure, automated plan for your digital assets in under three minutes.",
  buttonText = "Start your plan",
  buttonLink = "/app",
  secondaryText = "Learn more about Cipherwill",
  secondaryLink = "/",
}: CTAProps) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for high-performance direct-DOM styling to bypass React render on scroll tick
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Trigger update only when card is visible in viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        // Progress ranges from negative (above viewport) to positive (below viewport)
        const progress = (elementCenter - viewportCenter) / (windowHeight / 2);
        
        // Multi-layered distinct slower speeds to generate an elegant, steady 3D depth
        if (layer1Ref.current) {
          layer1Ref.current.style.transform = `translate3d(0, ${progress * 18}px, 0)`;
        }
        if (layer2Ref.current) {
          layer2Ref.current.style.transform = `translate3d(0, ${progress * -22}px, 0)`;
        }
        if (layer3Ref.current) {
          layer3Ref.current.style.transform = `translate3d(0, ${progress * -35}px, 0)`;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run an initial tick to align coordinates on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (loopWords.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % loopWords.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [loopWords]);

  return (
    <section className="bg-white py-20 sm:py-28 border-t border-forest/5">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Parallax Container */}
        <div
          ref={containerRef}
          className="relative overflow-hidden w-full px-6 py-16 sm:px-12 sm:py-24 bg-[#b4d5cc] rounded-[32px] flex flex-col items-center text-center justify-center gap-6 transition-all duration-300 ease-cw-ease hover:shadow-level-1 cursor-default"
        >
          
          {/* Layer 1: Scroll Parallax Unorganized Dot Pattern Left */}
          <div 
            ref={layer1Ref}
            className="absolute left-0 top-0 bottom-0 w-full sm:w-1/2 opacity-35 pointer-events-none select-none will-change-transform"
            style={{
              maskImage: 'radial-gradient(circle at 15% 50%, black 30%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(circle at 15% 50%, black 30%, transparent 70%)',
            }}
          >
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <circle cx="5%" cy="15%" r="1" fill="#1a2e26" />
              <circle cx="12%" cy="8%" r="2" fill="#1a2e26" />
              <circle cx="8%" cy="28%" r="1.5" fill="#1a2e26" />
              <circle cx="22%" cy="20%" r="2.5" fill="#1a2e26" />
              <circle cx="15%" cy="35%" r="1" fill="#1a2e26" />
              <circle cx="3%" cy="48%" r="2" fill="#1a2e26" />
              <circle cx="11%" cy="52%" r="1.5" fill="#1a2e26" />
              <circle cx="28%" cy="40%" r="3" fill="#1a2e26" />
              <circle cx="35%" cy="22%" r="1.2" fill="#1a2e26" />
              <circle cx="42%" cy="45%" r="2" fill="#1a2e26" />
              <circle cx="20%" cy="65%" r="1.1" fill="#1a2e26" />
              <circle cx="8%" cy="75%" r="2.5" fill="#1a2e26" />
              <circle cx="30%" cy="70%" r="1.5" fill="#1a2e26" />
              <circle cx="15%" cy="88%" r="2" fill="#1a2e26" />
              <circle cx="25%" cy="92%" r="1" fill="#1a2e26" />
              <circle cx="38%" cy="80%" r="2.2" fill="#1a2e26" />
            </svg>
          </div>

          {/* Layer 2: Scroll Parallax Unorganized Dot Pattern Right */}
          <div 
            ref={layer2Ref}
            className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-35 pointer-events-none select-none will-change-transform"
            style={{
              maskImage: 'radial-gradient(circle at 85% 50%, black 30%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(circle at 85% 50%, black 30%, transparent 70%)',
            }}
          >
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <circle cx="95%" cy="12%" r="1.5" fill="#1a2e26" />
              <circle cx="88%" cy="5%" r="2.2" fill="#1a2e26" />
              <circle cx="92%" cy="25%" r="1.2" fill="#1a2e26" />
              <circle cx="78%" cy="18%" r="2.8" fill="#1a2e26" />
              <circle cx="85%" cy="32%" r="1" fill="#1a2e26" />
              <circle cx="97%" cy="45%" r="2.2" fill="#1a2e26" />
              <circle cx="89%" cy="55%" r="1.5" fill="#1a2e26" />
              <circle cx="72%" cy="38%" r="3" fill="#1a2e26" />
              <circle cx="65%" cy="20%" r="1.2" fill="#1a2e26" />
              <circle cx="58%" cy="48%" r="2" fill="#1a2e26" />
              <circle cx="80%" cy="68%" r="1.2" fill="#1a2e26" />
              <circle cx="92%" cy="78%" r="2.5" fill="#1a2e26" />
              <circle cx="70%" cy="72%" r="1.8" fill="#1a2e26" />
              <circle cx="85%" cy="85%" r="2.2" fill="#1a2e26" />
              <circle cx="75%" cy="90%" r="1.2" fill="#1a2e26" />
              <circle cx="62%" cy="82%" r="2.5" fill="#1a2e26" />
            </svg>
          </div>

          {/* Layer 3: Scroll Parallax Accent Floating Nodes (Foreground Depth) */}
          <div className="absolute inset-0 opacity-20 pointer-events-none select-none">
            <svg 
              ref={layer3Ref}
              className="w-full h-full will-change-transform" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10%" cy="30%" r="2.5" fill="#1a2e26" />
              <circle cx="25%" cy="75%" r="3.5" fill="#1a2e26" />
              <circle cx="18%" cy="45%" r="2" fill="#1a2e26" />
              <circle cx="82%" cy="25%" r="2.5" fill="#1a2e26" />
              <circle cx="75%" cy="65%" r="3.5" fill="#1a2e26" />
              <circle cx="90%" cy="50%" r="2" fill="#1a2e26" />
            </svg>
          </div>

          {/* Title Header with Seamless Text Loop */}
          <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl text-[#1a2e26] font-bold tracking-tight max-w-4xl leading-[1.15] relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-center sm:gap-x-4 gap-y-1">
            <span>{titlePrefix}</span>
            <span className="inline-block relative h-[1.25em] min-w-[200px] sm:min-w-[280px] md:min-w-[340px] text-center sm:text-left font-playfair italic font-bold">
              <AnimatePresence mode="wait">
                <motion.span
                  key={loopWords[index]}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -24, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute inset-0 text-center sm:text-left whitespace-nowrap text-[#1a2e26]"
                >
                  {loopWords[index]}.
                </motion.span>
              </AnimatePresence>
            </span>
          </h2>
          
          {/* Subtitle description */}
          <p className="text-sm sm:text-base md:text-lg text-[#1a2e26]/80 font-medium leading-relaxed max-w-2xl relative z-10">
            {subtitle}
          </p>

          {/* Action Area with capsule button */}
          <div className="flex flex-col items-center gap-4 relative z-10 mt-4">
            <Link href={buttonLink}>
              <div className="bg-[#12201b] hover:bg-[#1b2f28] active:scale-[0.98] text-white font-semibold shadow-sm hover:shadow-level-2 transition-all duration-200 px-8 py-4 rounded-full text-xs uppercase tracking-wider cursor-pointer text-center flex items-center justify-center gap-2">
                <span>{buttonText}</span>
                <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
            
            {secondaryText && (
              <Link href={secondaryLink} className="hover:underline text-xs text-[#1a2e26]/60 font-semibold transition-colors duration-200">
                {secondaryText}
              </Link>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
