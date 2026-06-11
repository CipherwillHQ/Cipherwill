/**
 * LifecycleCard.tsx
 * Renders an individual flat phase block inside the "How It Works" staggered timeline.
 * Handles alternating side-by-side structures on desktop and stacked structures on mobile.
 * Uses explicit non-composited blend wrappers to dissolve white illustration backgrounds cleanly into the page.
 * Does NOT own global timeline track rendering.
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { LifecyclePhase } from "./lifecycleData";

interface LifecycleCardProps {
  phase: LifecyclePhase;
  index: number;
}

export default function LifecycleCard({ phase, index }: LifecycleCardProps) {
  const Icon = phase.btnIcon;
  
  // Alternating Column Logic:
  // index % 2 === 0 (even, Phase 1): Text on Right (isTextRight = true)
  // index % 2 !== 0 (odd, Phase 2): Text on Left (isTextRight = false)
  const isTextRight = index % 2 === 0;

  // Slide in from the side where the text is located for maximum fluid motion
  const cardVariants = {
    hidden: { opacity: 0, x: isTextRight ? 40 : -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 18,
      },
    },
  };

  return (
    <div className="relative w-full py-12 md:py-16 flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-16 lg:gap-24 items-center">
      {/* 1. Content Plane */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className={`w-full flex flex-col justify-center px-4 sm:px-8 md:px-0 ${
          isTextRight ? "md:order-2 md:text-left md:items-start" : "md:order-1 md:text-right md:items-end"
        }`}
      >
        {/* Phase Kicker */}
        <span className="text-[11px] font-bold tracking-widest uppercase text-primary-600 font-gilroy mb-3">
          {phase.tag}
        </span>

        {/* Title */}
        <h3 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-forest leading-tight mb-4 max-w-md">
          {phase.title}
        </h3>

        {/* Bullet Points */}
        <ul className={`space-y-3.5 mb-6 max-w-md ${isTextRight ? "md:items-start" : "md:items-end"}`}>
          {phase.points.map((point, idx) => (
            <li
              key={idx}
              className={`flex items-start text-[13px] sm:text-base text-forest/70 font-medium font-gilroy leading-relaxed ${
                isTextRight ? "flex-row text-left" : "md:flex-row-reverse md:text-right"
              }`}
            >
              <span className={`inline-block w-1.5 h-1.5 rounded-full bg-sage shrink-0 mt-2.5 ${isTextRight ? "mr-3" : "md:ml-3 md:mr-0 mr-3"}`} />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        {/* Optional Action Button */}
        {phase.btnHref && phase.btnTitle && (
          <Link href={phase.btnHref}>
            <button className="flex gap-2 hover:gap-3 items-center bg-primary hover:bg-primary-900 hover:cursor-pointer transition-all text-white font-gilroy text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm active:scale-[0.98]">
              {Icon && <Icon className="w-4 h-4" />}
              <span>{phase.btnTitle}</span>
            </button>
          </Link>
        )}
      </motion.div>

      {/* 2. Illustration Plane */}
      <div className={`w-full flex items-center justify-center ${isTextRight ? "md:order-1" : "md:order-2"}`}>
        {/* Non-composited outer container to guarantee mix-blend-mode multiplies on the page background */}
        <div
          style={{ mixBlendMode: "multiply" }}
          className="relative w-full max-w-70 sm:max-w-95 md:max-w-120 lg:max-w-125 aspect-square flex items-center justify-center bg-cream z-10"
        >
          {/* Flat non-animated container (completely bypasses GPU composites and isolates clean blending) */}
          <div className="w-full h-full flex items-center justify-center relative bg-transparent">
            {/* Subtle glowing wash behind the illustration */}
            <div className="absolute inset-0 m-auto w-52 h-52 rounded-full bg-sage/5 blur-xl pointer-events-none" />

            <Image
              alt={`Illustration for ${phase.title}`}
              src={phase.image}
              width={600}
              height={600}
              style={{ mixBlendMode: "multiply" }}
              className="object-contain w-full h-full relative z-10 select-none pointer-events-none"
              priority={index < 2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
