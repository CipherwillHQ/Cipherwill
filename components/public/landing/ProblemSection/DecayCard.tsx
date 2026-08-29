/**
 * What it does: Renders a cinematic visual decay card with full-bleed image background, gradient overlay, and hover reveal.
 * What it owns: Image backdrop scaling, gradient readability layers, and micro-hover interactions.
 * What it does NOT do: Does not manage global timeline state.
 */

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { DecayTimelineItem } from "./types";

interface DecayCardProps {
  event: DecayTimelineItem;
  index: number;
}

export default function DecayCard({ event, index }: DecayCardProps) {
  const Icon = event.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`group relative h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border border-cream/15 bg-forest transition-all duration-500 select-none flex flex-col justify-between p-6 ${event.borderColor} ${event.glowColor}`}
    >
      {/* 1. Full-Bleed Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={event.imageSrc}
          alt={event.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
          priority={index === 0}
        />
        {/* Dual Gradient Overlays: Top Vignette + Bottom Deep Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest/70 via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/75 via-45% to-transparent opacity-95 group-hover:opacity-90 transition-opacity duration-500" />
      </div>

      {/* 2. Top Header Badges (Frosted Glass) */}
      <div className="relative z-10 flex justify-between items-center">
        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 ${event.badgeBg} ${event.badgeText}`}>
          {event.timeframe}
        </span>
        <div className="p-2 rounded-full backdrop-blur-md bg-forest/60 border border-white/10 text-cream/80 group-hover:text-white group-hover:scale-110 transition-all duration-300">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* 3. Bottom Text Overlay & Hover Expand */}
      <div className="relative z-10 flex flex-col justify-end">
        {/* Title */}
        <h3 className="font-gilroy font-bold text-lg sm:text-xl text-cream group-hover:text-white leading-tight mb-2 transition-colors">
          {event.title}
        </h3>

        {/* Impact Chip */}
        <div className="mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-md bg-forest/70 border border-white/10 font-mono text-[11px] font-semibold text-cream/90">
            <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse shrink-0" />
            <span className="truncate">{event.impactTag}</span>
          </span>
        </div>

        {/* Hover-Revealed Concise Description */}
        <div className="max-h-20 sm:max-h-0 sm:opacity-0 sm:group-hover:max-h-24 sm:group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden">
          <p className="font-gilroy font-medium text-xs sm:text-sm text-cream/80 leading-relaxed pt-2 border-t border-white/10">
            {event.shortDescription}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
