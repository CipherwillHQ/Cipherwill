/**
 * CareersHero component for the public careers page.
 * Owns the main editorial heading and the core mission statement.
 * Does NOT own the job filtering or team pillars section.
 */

import React from "react";

export default function CareersHero() {
  return (
    <section className="w-full bg-cream text-forest pt-32 pb-24 sm:pt-40 sm:pb-32 px-4 border-b border-default">
      <div className="max-w-4xl mx-auto text-center flex flex-col gap-6">
        <span className="text-sm font-semibold tracking-wider uppercase text-primary">
          Careers at Cipherwill
        </span>
        <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-forest">
          Join the builders of digital permanence
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-forest/80 font-medium leading-relaxed font-gilroy">
          Cipherwill is at the intersection of digital infrastructure and deeply human legacy planning.
          We are a team of passionate creators, building secure, elegant, and lasting solutions
          for transferring digital assets and memories to loved ones.
        </p>
      </div>
    </section>
  );
}
