/*
 * TimeCapsuleVisual.tsx
 * What it does: Renders an interactive Timelock and Countdown simulator to explain Time Capsule Encryption.
 * What it owns: Active states (Locked, Re-encrypt, Released), countdown timers, and technical descriptions.
 * What it does NOT do: It does not handle metadata, header, or footer.
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbClock, TbRefresh, TbLock, TbLockOpen, TbHourglass } from "react-icons/tb";

interface SimulatorState {
  id: "locked" | "refresh" | "released";
  label: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  timeRemaining: string;
  percentage: number;
}

const states: SimulatorState[] = [
  {
    id: "locked",
    label: "Active Lock Phase",
    badge: "Interval Locked",
    badgeBg: "bg-primary-50",
    badgeText: "text-primary-800",
    description: "Your files are securely locked inside the capsule. Even if an adversary manages to obtain your encrypted files, they cannot decrypt them because the secure time beacon will not broadcast the decryption trapdoor key until your chosen countdown interval matures.",
    timeRemaining: "Lock Remaining",
    percentage: 10,
  },
  {
    id: "refresh",
    label: "Auto Re-Encryption",
    badge: "Interval Reset",
    badgeBg: "bg-warning/10",
    badgeText: "text-warning",
    description: "You logged in! The platform detects your activity and automatically extends your timelock. The old keys are discarded, and files are dynamically re-encrypted for another full interval cycle. The lock slides forward seamlessly without ever exposing your files.",
    timeRemaining: "Reset Successful",
    percentage: 0,
  },
  {
    id: "released",
    label: "Matured Release",
    badge: "Released Phase",
    badgeBg: "bg-sage/10",
    badgeText: "text-sage",
    description: "In the event of continuous inactivity, the timelock countdown is allowed to hit zero. The secure time beacon immediately publishes the decryption keys. Your beneficiaries can now use their private keys to open the capsule and read your files.",
    timeRemaining: "Matured & Released",
    percentage: 100,
  },
];

export default function TimeCapsuleVisual() {
  const [activeStateId, setActiveStateId] = useState<"locked" | "refresh" | "released">("locked");
  const currentState = states.find((s) => s.id === activeStateId)!;

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      {/* Simulator Card */}
      <div className="bg-white border border-forest/10 rounded-3xl p-6 md:p-10 shadow-level-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Interactive Simulation Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-cream/30 border border-forest/5 rounded-2xl p-6 relative overflow-hidden">
          
          {/* Header of simulator */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-xs font-mono font-bold tracking-widest text-forest/40 uppercase">
              <TbHourglass className="animate-spin w-4 h-4 text-primary" style={{ animationDuration: "3s" }} />
              Live Timelock Simulator
            </div>

            {/* Interactive Selector Buttons */}
            <div className="flex flex-col gap-2">
              {states.map((state) => (
                <button
                  key={state.id}
                  onClick={() => setActiveStateId(state.id)}
                  className={`px-4 py-3 rounded-xl text-left font-bold text-sm border transition-all duration-300 flex items-center justify-between ${
                    activeStateId === state.id
                      ? "bg-white border-primary shadow-level-1 text-forest"
                      : "bg-transparent border-transparent text-forest/50 hover:bg-white/50"
                  }`}
                >
                  <span>{state.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${state.badgeBg} ${state.badgeText} font-mono`}>
                    {state.id === "refresh" && activeStateId === "refresh" ? "TRIGGERED" : "SELECT"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Visual Timelock Progress Circle/Bar */}
          <div className="mt-8 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-forest/40 uppercase">Lock Progress</span>
              <span className="text-forest">{currentState.timeRemaining}</span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-3 bg-forest/5 rounded-full overflow-hidden border border-forest/5">
              <motion.div
                animate={{ width: `${currentState.percentage}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={`h-full rounded-full ${
                  activeStateId === "released" ? "bg-sage" : activeStateId === "refresh" ? "bg-warning" : "bg-primary"
                }`}
              />
            </div>

            {/* Animated Vault Lock Status */}
            <div className="flex items-center gap-2 mt-2 text-xs font-mono font-semibold text-forest/50">
              {activeStateId === "released" ? (
                <>
                  <TbLockOpen className="w-4 h-4 text-sage stroke-[2.5px]" />
                  <span>VAULT: <strong className="text-sage">DECRYPTABLE</strong></span>
                </>
              ) : activeStateId === "refresh" ? (
                <>
                  <TbRefresh className="w-4 h-4 text-warning stroke-[2.5px] animate-spin" style={{ animationDuration: "1.5s" }} />
                  <span>VAULT: <strong className="text-warning">AUTO-RENEWING</strong></span>
                </>
              ) : (
                <>
                  <TbLock className="w-4 h-4 text-primary stroke-[2.5px]" />
                  <span>VAULT: <strong className="text-primary font-bold">TIMELOCKED</strong></span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Blueprint Explanation Panel */}
        <div className="lg:col-span-7 flex flex-col justify-between p-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStateId}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex flex-col gap-5 h-full justify-center"
            >
              {/* Header */}
              <div>
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 ${currentState.badgeBg} ${currentState.badgeText}`}>
                  {currentState.badge}
                </span>
                <h3 className="font-playfair font-bold text-2xl sm:text-3xl text-forest mt-1">
                  {currentState.label}
                </h3>
              </div>

              {/* Body */}
              <p className="text-sm sm:text-base text-forest/70 font-medium leading-relaxed">
                {currentState.description}
              </p>


            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}