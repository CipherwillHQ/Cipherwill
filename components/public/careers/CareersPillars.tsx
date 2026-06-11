/**
 * CareersPillars component for the public careers page.
 * Owns the team's core values, aligning with the Dual Engine Principle.
 * Does NOT own the hero section or the job postings list.
 */

import React from "react";
import { TbShieldLock, TbSparkles, TbCompass } from "react-icons/tb";

const pillars = [
  {
    icon: TbShieldLock,
    title: "Institutional Rigor",
    description:
      "We design digital vaults built to outlast generations. There is no room for structural ambiguity or security shortcuts. Our engineering standard is absolute correctness.",
  },
  {
    icon: TbSparkles,
    title: "Radical Calmness",
    description:
      "We treat legacy transition not as a cold legal task, but as an act of profound care. Our interfaces use space, softness, and deliberate pacing to actively lower cognitive load.",
  },
  {
    icon: TbCompass,
    title: "Absolute Empathy",
    description:
      "We guide families through some of life's most sensitive transitions. We strip away technical intimidation, speak in plain language, and design with deep, human respect.",
  },
];

export default function CareersPillars() {
  return (
    <section className="w-full bg-forest text-cream py-24 sm:py-32 px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        <div className="max-w-2xl flex flex-col gap-4">
          <span className="text-sm font-semibold tracking-wider uppercase text-clay">
            Our Philosophy
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            The values that anchor our work
          </h2>
          <p className="font-gilroy text-lg text-cream/70">
            We are working on a problem that is simultaneously deeply human and highly technical.
            Our daily work is guided by three non-negotiable principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className="flex flex-col gap-6 p-8 border border-cream/10 rounded-2xl bg-forest/50 hover:border-cream/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-cream/10 flex items-center justify-center text-clay group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-cream">
                    {pillar.title}
                  </h3>
                  <p className="font-gilroy text-sm sm:text-base text-cream/70 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
