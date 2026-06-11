/**
 * StorySection component for the Cipherwill About Us page.
 * Owns the dark-themed founding story of Cipherwill, the inspiration, and the historical context.
 * Does NOT own the technical details of encryption or the CTA section.
 */

"use client";

import { RiDoubleQuotesL } from "react-icons/ri";

export default function StorySection() {
  return (
    <section className="bg-[#2A363B] text-[#FBF9F1] py-24 sm:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Label and Headings */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <span className="text-xs uppercase tracking-widest font-bold text-[#D4A390]">
              The Genesis
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-[#FBF9F1]">
              The Story & Inspiration
            </h2>
            <div className="w-12 h-1 bg-[#D4A390] rounded-full mt-2" />
          </div>

          {/* Right Column: Journal Column and Editorial Callout */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            {/* Journal Column with Drop-Cap */}
            <div className="md:col-span-7 flex flex-col gap-6 text-[#FBF9F1]/80 text-base md:text-lg font-medium leading-relaxed">
              <p className="first-letter:text-6xl first-letter:font-black first-letter:font-playfair first-letter:text-[#D4A390] first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                Cipherwill was inspired by a sudden, tragic news story. A young man with millions in digital assets-including cryptocurrency portfolios, valuable domain names, and a prominent YouTube brand-passed away completely unexpectedly. 
              </p>
              <p>
                In the wake of his sudden passing, his loved ones and business associates were left entirely unable to access any of these critical assets. There was no transition plan, no stored passwords, and no legal handoff mechanism. This tragic oversight resulted in a permanent, devastating financial and emotional loss for his family.
              </p>
              <p>
                This incident exposed a critical gap in our modern digital lives: the absolute, urgent necessity of managing digital legacies. Inspired to prevent such losses for others, our team envisioned Cipherwill-a secure, robust platform that stores essential digital information and guarantees its seamless, secure transfer to loved ones when the time comes.
              </p>
            </div>

            {/* Archival Block-Quote */}
            <div className="md:col-span-5 flex flex-col gap-4 p-6 rounded-2xl border border-[#FBF9F1]/10 bg-white/5 relative">
              <RiDoubleQuotesL className="text-[#D4A390] text-3xl absolute -top-4 -left-2 bg-[#2A363B] px-1" />
              <p className="font-playfair italic text-lg leading-relaxed text-[#FBF9F1] pt-2">
                "The digital estates we build over a lifetime can evaporate in a single instant if we fail to build a bridge for those we leave behind."
              </p>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#D4A390] mt-2">
                - Cipherwill Editorial Team
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
