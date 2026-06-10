/**
 * Hero.tsx
 * The interactive hero component for the "How It Works" page.
 * Renders a unified responsive card constellation for mobile, tablet, and desktop.
 * Keeps the exact circular constellation design centered behind the copy on all devices, with zero clumping.
 * Does NOT control sub-sections or page footer layouts.
 */

"use client";

import React, { useState, useEffect } from "react";
import { constellationCards } from "./heroData";
import HeroCard from "./HeroCard";

export default function Hero() {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScreenSize("mobile");
      } else if (window.innerWidth < 1200) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Split cards by ring
  const innerCards = constellationCards.filter((c) => c.ring === "inner");
  const outerCards = constellationCards.filter((c) => c.ring === "outer");

  // Radial configurations
  const getRadius = () => {
    if (screenSize === "mobile") {
      return { inner: 95, outer: 150 };
    }
    if (screenSize === "tablet") {
      return { inner: 200, outer: 380 };
    }
    return { inner: 300, outer: 540 }; // Desktop default
  };

  const radii = getRadius();

  // Helper to compute coordinates and base rotation
  const getCardPosition = (index: number, total: number, radius: number, isOuter: boolean) => {
    // Offset outer ring angles to interleave cards nicely
    const startAngle = isOuter ? Math.PI / total : 0;
    const angle = (index * 2 * Math.PI) / total + startAngle;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const rotation = (angle * 180) / Math.PI + 90;
    return { x, y, rotation };
  };

  const isAnyCardHovered = hoveredCardId !== null;

  return (
    <section className="relative w-full bg-cream dark:bg-navy text-forest dark:text-cream overflow-hidden">
      {/* Radial Layout Constellation Container */}
      <div className="relative w-full h-[620px] md:h-[950px] lg:h-[1100px] overflow-hidden">
        
        {/* Static Center Typographic Anchor */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center max-w-[240px] sm:max-w-xl lg:max-w-3xl px-2 md:px-6 z-20 pointer-events-none w-full">
          <h1 className="font-playfair text-4xl sm:text-6xl lg:text-7xl font-bold text-forest dark:text-cream tracking-tight leading-none mx-auto">
            See How It’s Done
          </h1>
          <p className="mx-auto mt-4 sm:mt-6 max-w-[220px] sm:max-w-xl lg:max-w-2xl text-base lg:text-lg text-forest/70 dark:text-cream/70 font-medium leading-relaxed font-gilroy">
            Let understand how to put your digital legacy on autopilot with encryption, so when the time comes, your data is delivered to your loved ones.
          </p>
        </div>

        {/* Radial Cards Constellation Container */}
        <div className="absolute inset-0 z-10">
          {/* Inner Ring Cards */}
          {innerCards.map((card, idx) => {
            const pos = getCardPosition(idx, innerCards.length, radii.inner, false);
            return (
              <HeroCard
                key={card.id}
                card={card}
                targetX={pos.x}
                targetY={pos.y}
                baseRotation={pos.rotation}
                isHovered={hoveredCardId === card.id}
                anyCardHovered={isAnyCardHovered}
                onHoverStart={() => {
                  if (screenSize !== "mobile") {
                    setHoveredCardId(card.id);
                  }
                }}
                onHoverEnd={() => {
                  if (screenSize !== "mobile") {
                    setHoveredCardId(null);
                  }
                }}
                screenSize={screenSize}
              />
            );
          })}

          {/* Outer Ring Cards */}
          {outerCards.map((card, idx) => {
            const pos = getCardPosition(idx, outerCards.length, radii.outer, true);
            return (
              <HeroCard
                key={card.id}
                card={card}
                targetX={pos.x}
                targetY={pos.y}
                baseRotation={pos.rotation}
                isHovered={hoveredCardId === card.id}
                anyCardHovered={isAnyCardHovered}
                onHoverStart={() => {
                  if (screenSize !== "mobile") {
                    setHoveredCardId(card.id);
                  }
                }}
                onHoverEnd={() => {
                  if (screenSize !== "mobile") {
                    setHoveredCardId(null);
                  }
                }}
                screenSize={screenSize}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
