/**
 * HeroCard.tsx
 * Renders an individual interactive card in the "How It Works" hero constellation.
 * Handles radial absolute positioning, organic floating, upright rotation on hover, and global dimming states.
 * Does NOT manage global ring layouts or page-level scroll behavior.
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import { ConstellationCard } from "./heroData";

interface HeroCardProps {
  card: ConstellationCard;
  targetX: number;
  targetY: number;
  baseRotation: number;
  isHovered: boolean;
  anyCardHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  screenSize: "mobile" | "tablet" | "desktop";
}

export default function HeroCard({
  card,
  targetX,
  targetY,
  baseRotation,
  isHovered,
  anyCardHovered,
  onHoverStart,
  onHoverEnd,
  screenSize,
}: HeroCardProps) {
  const Icon = card.icon;
  const isMobile = screenSize === "mobile";

  // Card scaling factor across breakpoints:
  // Mobile: 0.35, Tablet: 0.75, Desktop: 1.0
  const baseScale = isMobile ? 0.35 : screenSize === "tablet" ? 0.75 : 1;
  const hoverScale = isMobile ? 0.35 : screenSize === "tablet" ? 0.75 * 1.1 : 1.1;

  // On mobile, keep original rotation. On desktop/tablet, rotate upright (0 deg) on hover.
  const targetRotation = isMobile ? baseRotation : 0;

  // Opacity setup:
  // Non-hovered cards have 0.4 opacity. When a card is hovered, non-hovered ones drop to 0.1.
  const defaultOpacity = anyCardHovered && !isMobile ? 0.1 : 0.4;
  const hoverOpacity = isMobile ? 0.4 : 1;

  // Float distance scale for responsive ambient floating:
  const floatDist = isMobile ? 2.5 : 8;

  const outerVariants = {
    default: {
      x: targetX,
      y: targetY,
      rotate: baseRotation,
      scale: baseScale,
      opacity: defaultOpacity,
      zIndex: card.ring === "inner" ? 10 : 5,
      transition: {
        type: "spring" as const,
        stiffness: 150,
        damping: 20,
      },
    },
    hovered: {
      x: targetX,
      y: targetY,
      rotate: targetRotation,
      scale: hoverScale,
      opacity: hoverOpacity,
      zIndex: isMobile ? (card.ring === "inner" ? 10 : 5) : 50,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 18,
      },
    },
  };

  return (
    <motion.div
      variants={outerVariants}
      animate={isHovered ? "hovered" : "default"}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className="absolute left-1/2 top-1/2 -ml-[110px] -mt-[70px] w-[220px] h-[140px] select-none cursor-pointer"
    >
      {/* Inner container handles continuous slow organic floating */}
      <motion.div
        animate={
          isHovered && !isMobile
            ? { x: 0, y: 0 }
            : {
                x: [0, Math.cos((baseRotation * Math.PI) / 180) * floatDist, 0],
                y: [0, Math.sin((baseRotation * Math.PI) / 180) * floatDist, 0],
              }
        }
        transition={{
          repeat: Infinity,
          duration: card.ring === "inner" ? 5 : 7,
          ease: "easeInOut",
        }}
        className="w-full h-full bg-white/60 dark:bg-navy-900/60 backdrop-blur-xs border border-forest/5 dark:border-cream/5 rounded-2xl p-4 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] transition-shadow duration-300"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-widest uppercase text-forest/40 dark:text-cream/40 font-gilroy">
            {card.category}
          </span>
          <div className="p-1.5 rounded-lg bg-cream dark:bg-navy-800 text-primary-600 dark:text-primary-400">
            <Icon size={16} strokeWidth={1.8} />
          </div>
        </div>

        {/* Card Body */}
        <div className="mt-2 flex-1 flex flex-col justify-end">
          <h3 className="font-semibold text-[13px] text-forest dark:text-cream leading-snug font-gilroy">
            {card.title}
          </h3>
          <p className="text-[11px] text-forest/60 dark:text-cream/60 mt-1 font-gilroy line-clamp-2">
            {card.subtitle}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
