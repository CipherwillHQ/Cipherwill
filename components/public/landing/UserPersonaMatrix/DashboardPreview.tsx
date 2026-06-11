/**
 * What it does: Renders a mockup of the secure application dashboard customized for each selected persona.
 * What it owns: Mock dashboard layouts, active checklist counters, and visual status checks.
 * What it does NOT do: Does not connect to real databases or authentications.
 */

"use client";

import { motion } from "framer-motion";
import { TbCircleCheck, TbAward, TbUserCircle, TbShield } from "react-icons/tb";
import { PersonaProfile } from "./data";

interface DashboardPreviewProps {
  persona: PersonaProfile;
}

export default function DashboardPreview({ persona }: DashboardPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-white border border-forest/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-level-1 h-full"
    >
      <div className="space-y-6">
        {/* Mock Top Title */}
        <div className="flex items-center justify-between border-b border-forest/5 pb-4">
          <div className="flex items-center gap-2">
            <TbUserCircle className="w-5 h-5 text-forest/40" />
            <span className="font-gilroy font-bold text-xs text-forest uppercase tracking-wider">
              Cipherwill App Preview
            </span>
          </div>
          <span className="font-gilroy font-semibold text-[9px] uppercase tracking-wider text-sage bg-sage/15 border border-sage/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            <TbShield className="w-3 h-3" /> Zero-Custody Active
          </span>
        </div>

        {/* Persona Quote Block */}
        <div className="border-l-4 border-clay pl-4">
          <p className="font-gilroy font-medium text-xs sm:text-sm text-forest/60 italic leading-relaxed">
            "{persona.quote}"
          </p>
          <p className="font-gilroy font-bold text-xs text-forest uppercase tracking-wider mt-2">
            — {persona.name}
          </p>
        </div>

        {/* Recommended Setup Box (Clay Panel as per Design.md) */}
        <div className="p-4 rounded-xl bg-clay/10 border border-clay/15 text-forest/80">
          <div className="flex items-center gap-2 mb-1">
            <TbAward className="w-4 h-4 text-clay" />
            <span className="font-gilroy font-bold text-xs uppercase tracking-wide text-clay">
              Recommended Setup Guide
            </span>
          </div>
          <p className="font-gilroy font-medium text-xs text-forest/70 leading-relaxed">
            {persona.setupBrief}
          </p>
        </div>

        {/* Personalized Checklist */}
        <div className="space-y-2.5">
          <span className="font-gilroy font-bold text-[9px] uppercase tracking-widest text-forest/30 block mb-1">
            Digital Estate Checklist
          </span>
          {persona.checklist.map((item, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <TbCircleCheck className="w-4 h-4 text-sage shrink-0" />
              <span className="font-gilroy font-semibold text-xs sm:text-sm text-forest/80">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
