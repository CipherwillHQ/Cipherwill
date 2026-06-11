/**
 * Lifecycle.tsx
 * The main container for the "How It Works" 8-step staggered timeline cascade.
 * Manages the vertical connector track, scroll-driven progress filling, and anchors the responsive layout.
 * Does NOT own individual card content rendering.
 */

"use client";

import React, { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { lifecyclePhases } from "./lifecycleData";
import LifecycleCard from "./LifecycleCard";

export default function Lifecycle() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of the timeline section to drive the active line fill
  const { scrollYProgress: scaleY } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  return (
    <section className="relative w-full bg-cream py-24 sm:py-32 px-6 border-t border-forest/5">
      {/* Ambient background wash */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-primary-50/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-125 h-125 bg-sage/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
        {/* Editorial Section Header */}
        <div className="text-center max-w-2xl mb-16 sm:mb-24">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary-600 font-gilroy">
            End-To-End Protection
          </span>
          <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-forest mt-4 leading-tight">
            The Cipherwill <span className="italic font-normal">Lifecycle</span>
          </h2>
          <p className="text-sm sm:text-lg text-forest/70 mt-4 leading-relaxed font-gilroy font-medium">
            Explore the complete timeline of how your assets are secured, monitored, timelocked, and seamlessly transferred to your loved ones.
          </p>
        </div>

        {/* Timeline Progress Track & Cards Container */}
        <div ref={containerRef} className="relative w-full flex flex-col items-center">
          
          {/* Static Background Spine (Muted line) */}
          <div className="absolute top-4 bottom-4 left-6 md:left-1/2 w-[1.5px] bg-forest/10 dark:bg-cream/10 -translate-x-1/2 z-0" />

          {/* Active Filling Progress Line (Fills in Sage Green as user scrolls) */}
          <motion.div
            style={{ scaleY }}
            className="absolute top-4 bottom-4 left-6 md:left-1/2 w-[1.5px] bg-sage -translate-x-1/2 origin-top z-10"
          />

          {/* Staggered Cards List */}
          <div className="w-full flex flex-col gap-6 relative z-20">
            {lifecyclePhases.map((phase, idx) => (
              <div key={phase.id} className="relative w-full pl-12 md:pl-0">
                {/* Timeline Intersection Node (Circle with phase index number) */}
                <div className="absolute left-6 md:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-forest/15 dark:border-cream/15 flex items-center justify-center font-bold text-xs text-forest shadow-sm z-30 transition-all duration-300">
                  {idx + 1}
                </div>

                {/* Staggered Side-Alternating Card Component */}
                <LifecycleCard phase={phase} index={idx} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
