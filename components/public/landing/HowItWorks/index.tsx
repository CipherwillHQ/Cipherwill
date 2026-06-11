/**
 * What it does: Orchestrates the "How Cipherwill Works" timeline heartbeat section on the landing page.
 * What it owns: Light container wrapper, vertical step timeline blocks, and side-by-side flex grid layout.
 * What it does NOT do: Does not run heartbeat state or check-in timers.
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { WORKFLOW_STEPS } from "./data";
import HeartbeatSimulator from "./HeartbeatSimulator";

export default function HowItWorks() {
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
            How we protect against false alarms
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-gilroy font-medium text-forest/70 text-base md:text-lg max-w-2xl mt-4"
          >
            Our Multi-Channel Heartbeat is designed to watch out for you silently. We only execute transfer processes if a sequence of independent verification countdowns expire without response.
          </motion.p>
        </div>

        {/* 2-Column Responsive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">
          
          {/* Left Column: Timeline Steps (Columns 1-7) */}
          <div className="lg:col-span-7 flex flex-col space-y-6 justify-center">
            {WORKFLOW_STEPS.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="p-2 h-10 w-10 rounded-xl bg-forest/5 text-forest shrink-0 flex items-center justify-center">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-gilroy font-bold text-sm text-forest uppercase tracking-wide">
                        {step.title}
                      </h4>
                      <span className="font-gilroy font-semibold text-[9px] uppercase tracking-wider text-sage bg-sage/10 px-2 py-0.5 rounded-full">
                        {step.duration}
                      </span>
                    </div>
                    <p className="font-gilroy font-medium text-xs sm:text-sm text-forest/70 mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}

            <div className="pt-2">
              <Link 
                href="/i/how-execution-timeline-works" 
                className="inline-flex items-center gap-1.5 font-gilroy font-bold text-xs uppercase tracking-widest text-sage hover:text-forest transition-colors"
              >
                <span>View Detailed Execution Timeline →</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Heartbeat Simulator (Columns 8-12) */}
          <div className="lg:col-span-5">
            <HeartbeatSimulator />
          </div>

        </div>

      </div>
    </div>
  );
}
