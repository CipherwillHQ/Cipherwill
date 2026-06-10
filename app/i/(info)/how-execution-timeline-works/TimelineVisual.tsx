/*
 * TimelineVisual.tsx
 * What it does: Renders an interactive, step-by-step schematic timeline of the Will Execution schedule.
 * What it owns: The interactive visual state, step selection, progress filling animation, and Framer Motion effects.
 * What it does NOT do: It does not render the main page layout, header, footer, or CTA.
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbClock,
  TbBell,
  TbBellRinging,
  TbAlertTriangle,
  TbKey,
  TbTrash,
  TbChevronRight,
} from "react-icons/tb";

interface Step {
  id: number;
  title: string;
  duration: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgLight: string;
  textLight: string;
  content: string;
  note: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Trigger Check",
    duration: "Default 3 Months",
    badge: "Customizable",
    icon: TbClock,
    color: "#003ecb",
    bgLight: "bg-blue-50",
    textLight: "text-blue-900",
    content: "We monitor your login activity. If zero activity is detected during your chosen check-in interval, the automated timeline is safely initiated.",
    note: "You can change this interval to weekly, monthly, quarterly, semi-annually, or annually inside your settings.",
  },
  {
    id: 2,
    title: "First Reminder",
    duration: "Day 3 of Silence",
    badge: "Activity Check",
    icon: TbBell,
    color: "#7AA089",
    bgLight: "bg-sage/10",
    textLight: "text-sage",
    content: "To prevent premature triggers, we dispatch our first secure check-in notification across all registered contact channels.",
    note: "We only send this if you haven't accessed the platform within your selected interval.",
  },
  {
    id: 3,
    title: "Second Warning",
    duration: "Day 30 of Silence",
    badge: "Urgent Attention",
    icon: TbBellRinging,
    color: "#C87941",
    bgLight: "bg-warning/10",
    textLight: "text-warning",
    content: "If no check-in is registered 27 days after the first reminder, we issue a heightened alert emphasizing the critical countdown.",
    note: "Logging in once at any time immediately stops and resets the entire countdown process.",
  },
  {
    id: 4,
    title: "Final Notice",
    duration: "Day 90 of Silence",
    badge: "Last Call",
    icon: TbAlertTriangle,
    color: "#C0392B",
    bgLight: "bg-error/10",
    textLight: "text-error",
    content: "The final nudge is sent to your registered channels. Only 10 days remain before keys are permanently distributed.",
    note: "This is the absolute final opportunity to log in and cancel execution.",
  },
  {
    id: 5,
    title: "Will Execution",
    duration: "Day 100 of Silence",
    badge: "Key Release",
    icon: TbKey,
    color: "#003ecb",
    bgLight: "bg-primary-50",
    textLight: "text-primary-800",
    content: "The secure time-capsule decryption keys are compiled and securely released to your beneficiaries' dashboards. They are notified via secure mail.",
    note: "Your beneficiaries will have read-only access to their specific data for exactly 100 days.",
  },
  {
    id: 6,
    title: "Account Purge",
    duration: "Day 200 of Silence",
    badge: "Zero-Data Purge",
    icon: TbTrash,
    color: "#C0392B",
    bgLight: "bg-error/10",
    textLight: "text-error",
    content: "After 100 days of active beneficiary access, the will is revoked. To protect your privacy, we execute a complete, permanent zero-data system purge.",
    note: "All uploaded files, keys, and account records are completely destroyed from our systems.",
  },
];

export default function TimelineVisual() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const currentStep = steps[activeStep - 1];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full max-w-5xl mx-auto py-8">
      {/* Left side: Step Selector */}
      <div className="lg:col-span-5 flex flex-col gap-3 relative">
        {/* Decorative connecting track */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-forest/10 -z-10" />

        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;

          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex items-center gap-4 p-3 rounded-xl border text-left transition-all duration-300 w-full ${
                isActive
                  ? "bg-white border-primary shadow-level-1"
                  : "bg-parchment/30 border-forest/5 hover:bg-parchment/60"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                  isActive ? "bg-primary text-white" : "bg-forest/5 text-forest/60"
                }`}
                style={{
                  backgroundColor: isActive ? step.color : undefined,
                  color: isActive ? "#FBF9F1" : undefined,
                }}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-forest/40 uppercase tracking-wider">
                    {step.duration}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${step.bgLight} ${step.textLight}`}
                  >
                    {step.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-forest truncate mt-0.5">
                  {step.title}
                </h3>
              </div>
              <TbChevronRight
                className={`w-4 h-4 text-forest/30 transition-transform duration-300 ${
                  isActive ? "translate-x-1 opacity-100" : "opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Right side: Detailed Visualization Panel */}
      <div className="lg:col-span-7 flex">
        <div className="bg-white border border-forest/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-level-1 w-full min-h-[360px] relative overflow-hidden">
          {/* Subtle background glow representing active step */}
          <div
            className="absolute -right-16 -top-16 w-32 h-32 rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: currentStep.color }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex flex-col gap-5 flex-grow"
            >
              {/* Step Header */}
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: currentStep.color }}
                >
                  {<currentStep.icon className="w-8 h-8" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold tracking-widest text-forest/40 uppercase">
                      Timeline Step 0{currentStep.id}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${currentStep.bgLight} ${currentStep.textLight}`}
                    >
                      {currentStep.badge}
                    </span>
                  </div>
                  <h2 className="font-playfair text-2xl font-bold text-forest mt-0.5">
                    {currentStep.title}
                  </h2>
                </div>
              </div>

              {/* Time Indicator Badge */}
              <div className="bg-cream border border-forest/5 rounded-xl p-3 flex items-center justify-between text-sm">
                <span className="text-forest/60 font-medium">Activation Threshold</span>
                <span className="font-mono font-bold text-forest bg-parchment px-3 py-1 rounded-md">
                  {currentStep.duration}
                </span>
              </div>

              {/* Detailed Explanation */}
              <div className="text-forest/80 font-medium text-base leading-relaxed">
                {currentStep.content}
              </div>

              {/* Secure Caveat/Note */}
              <div className={`p-4 rounded-xl text-sm border font-medium ${currentStep.bgLight} ${currentStep.textLight} border-current/10 mt-auto`}>
                <span className="font-bold block mb-1">Security Guard Note</span>
                {currentStep.note}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}