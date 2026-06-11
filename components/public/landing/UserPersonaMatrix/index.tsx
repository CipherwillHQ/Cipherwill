/**
 * What it does: Orchestrates the "User Persona Matrix" customized tab section on the landing page.
 * What it owns: Light container layout, tab buttons, headline labels, and grid alignments.
 * What it does NOT do: Does not render the isolated dashboard mock directly.
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PERSONA_PROFILES } from "./data";
import DashboardPreview from "./DashboardPreview";

export default function UserPersonaMatrix() {
  const [activeTab, setActiveTab] = useState<string>("passwords");
  const selectedPersona = PERSONA_PROFILES.find((p) => p.id === activeTab) || PERSONA_PROFILES[0];

  return (
    <div className="w-full bg-cream py-24 border-b border-forest/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="flex flex-col md:items-center text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-3xl sm:text-4xl md:text-5xl leading-tight font-black text-forest max-w-3xl"
          >
            Tailored security for your specific situation
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-gilroy font-medium text-forest/70 text-base md:text-lg max-w-2xl mt-4"
          >
            Digital legacy planning is not one-size-fits-all. Select your profile below to see how our zero-custody framework fits your digital assets and lifeflow.
          </motion.p>
        </div>

        {/* 2-Column responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">
          
          {/* Left Column: Tab Selection Buttons (Columns 1-5) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
            <span className="font-gilroy font-bold text-[9px] uppercase tracking-widest text-forest/30">
              Select Your Situation
            </span>
            {PERSONA_PROFILES.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                className={`w-full p-4 sm:p-5 text-left rounded-xl border font-gilroy font-bold transition-all ${
                  activeTab === p.id 
                    ? "bg-forest text-cream border-forest shadow-level-1" 
                    : "bg-white border-forest/10 text-forest/70 hover:bg-parchment/30"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span>{p.name}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    activeTab === p.id ? "bg-cream/10 text-cream" : "bg-forest/5 text-forest/50"
                  }`}>
                    {p.badgeLabel}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Right Column: Interactive App Preview Mock (Columns 6-12) */}
          <div className="lg:col-span-7">
            <DashboardPreview persona={selectedPersona} />
          </div>

        </div>

      </div>
    </div>
  );
}
