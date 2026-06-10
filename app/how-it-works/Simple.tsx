/**
 * Simple.tsx
 * Renders the "Getting Started is Simple" section on the "How It Works" public page.
 * Displays a connected 3-phase horizontal/vertical process timeline with viewport-driven spring reveal animations.
 * Does NOT own the hero constellation above or the downstream lifecycle detail sections below.
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import { TbUserPlus, TbUsers, TbCircleCheck, TbChevronDown, TbArrowRight } from "react-icons/tb";

interface Step {
  phase: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const steps: Step[] = [
  {
    phase: "Phase 01",
    title: "Secure Account Setup",
    description: "Create your account and add credentials, seed phrases, notes, or secure files directly into your locally encrypted vault.",
    icon: TbUserPlus,
    accentColor: "bg-clay/10 text-clay border-clay/20",
  },
  {
    phase: "Phase 02",
    title: "Assign Beneficiaries",
    description: "Designate the trusted individuals who will receive specific assets, configuring access boundaries and verifying contact channels securely.",
    icon: TbUsers,
    accentColor: "bg-sage/10 text-sage border-sage/20",
  },
  {
    phase: "Phase 03",
    title: "All Set & Done",
    description: "Cipherwill monitors your activity. If you miss your check-in interval and fail to respond to reminders, we execute secure delivery automatically.",
    icon: TbCircleCheck,
    accentColor: "bg-primary-50 text-primary-600 border-primary-100 dark:bg-primary-950/20 dark:text-primary-400 dark:border-primary-900/30",
  },
];

export default function Simple() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section className="relative w-full bg-cream dark:bg-navy py-24 sm:py-32 px-6 overflow-hidden border-t border-forest/5 dark:border-cream/5">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-96 h-96 bg-sage/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
        {/* Editorial Section Header */}
        <div className="text-center max-w-2xl mb-16 sm:mb-20">
          <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-forest dark:text-cream tracking-tight leading-[1.15]">
            Getting Started is <span className="italic font-normal">Simple</span>
          </h2>
          <p className="text-sm sm:text-lg text-forest/70 dark:text-cream/70 mt-4 leading-relaxed font-gilroy font-medium">
            As easy as saving a password—just secure your assets, assign your trusted beneficiaries, and rest knowing your digital legacy is protected on autopilot.
          </p>
        </div>

        {/* Steps Grid Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 w-full px-2"
        >
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            const isLast = idx === steps.length - 1;

            return (
              <div key={idx} className="relative w-full h-full">
                {/* Individual Card */}
                <motion.div
                  variants={cardVariants}
                  whileHover={{ y: -8, transition: { duration: 0.2, ease: "easeOut" } }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group bg-parchment dark:bg-navy-900 border border-forest/10 dark:border-cream/10 rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] transition-all duration-300 overflow-hidden w-full h-full"
                >
                  <div>
                    {/* Phase Tag & Accent Icon */}
                    <div className="flex items-center justify-between mb-8">
                      <span className={`text-[10px] font-bold font-mono tracking-widest uppercase border px-3 py-1.5 rounded-full ${step.accentColor}`}>
                        {step.phase}
                      </span>
                      <div className="p-3 rounded-xl bg-white dark:bg-navy-800 text-forest dark:text-cream border border-forest/5 dark:border-cream/5 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                        <StepIcon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Step Title */}
                    <h3 className="font-bold text-xl lg:text-2xl text-forest dark:text-cream mb-3 font-gilroy tracking-tight">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-sm text-forest/70 dark:text-cream/70 font-gilroy font-medium leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>

                {/* Grid Connection Arrow/Line on Desktop */}
                {!isLast && (
                  <div className="hidden md:flex absolute top-1/2 left-[calc(100%_+_16px)] lg:left-[calc(100%_+_24px)] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none text-forest/20 dark:text-cream/20">
                    <TbArrowRight className="w-5 h-5 lg:w-6 lg:h-6 animate-[pulse_3s_infinite_ease-in-out]" />
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Scroll down pill navigation button */}
        <button
          onClick={() => {
            window.scrollBy({
              top: window.innerHeight * 0.9,
              behavior: "smooth",
            });
          }}
          className="flex items-center gap-2 mx-auto mt-16 text-sm font-semibold text-forest/50 dark:text-cream/50 hover:text-forest dark:hover:text-cream transition-colors duration-300 group hover:cursor-pointer"
        >
          <span className="tracking-wider uppercase text-xs font-gilroy font-bold">Scroll to explore details</span>
          <TbChevronDown className="animate-bounce text-base group-hover:translate-y-0.5 transition-transform duration-300" />
        </button>
      </div>
    </section>
  );
}
