/**
 * What it does: Renders an individual client testimonial quote block.
 * What it owns: Avatar text icons, quote layouts, author name alignments, and borders.
 * What it does NOT do: Does not define the static testimonials data list.
 */

"use client";

import { Testimonial } from "./data";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-cream/10 bg-cream/5 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Large editorial quote symbol */}
        <span className="font-playfair text-4xl sm:text-5xl text-clay leading-none block h-4 select-none">
          “
        </span>
        <p className="font-gilroy font-medium text-xs sm:text-sm md:text-base text-cream/80 italic leading-relaxed">
          {testimonial.quote}
        </p>
      </div>

      {/* User profile credit */}
      <div className="mt-6 flex items-center gap-3 pt-4 border-t border-cream/5">
        <div className="h-8 w-8 rounded-full bg-clay text-forest font-gilroy font-bold text-xs flex items-center justify-center shrink-0">
          {testimonial.avatarText}
        </div>
        <div>
          <h4 className="font-gilroy font-bold text-xs sm:text-sm text-cream leading-tight">
            {testimonial.author}
          </h4>
          <p className="font-gilroy font-medium text-[10px] sm:text-xs text-cream/50 mt-0.5">
            {testimonial.role}
          </p>
        </div>
      </div>
    </div>
  );
}
