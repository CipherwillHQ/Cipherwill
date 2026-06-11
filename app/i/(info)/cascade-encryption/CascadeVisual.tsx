/*
 * CascadeVisual.tsx
 * What it does: Renders an interactive concentric-layer vault diagram for Cascade Encryption.
 * What it owns: Lock/unlock state toggles, animated concentric shields, and layer-by-layer technical info.
 * What it does NOT do: It does not render main page layout, header, footer, or CTA.
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbLock, TbLockOpen, TbKey, TbUserCheck, TbFileCheck } from "react-icons/tb";

export default function CascadeVisual() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      {/* Visual Workspace & Toggle */}
      <div className="bg-white border border-forest/10 rounded-3xl p-6 md:p-10 shadow-level-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Interactive Concordance Shield */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4">
          <div className="flex gap-2 bg-parchment/60 p-1.5 rounded-full border border-forest/5 mb-8">
            <button
              onClick={() => setIsUnlocked(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider transition-all duration-200 ${
                !isUnlocked ? "bg-primary text-white" : "text-forest/60 hover:text-forest"
              }`}
            >
              Locked State
            </button>
            <button
              onClick={() => setIsUnlocked(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider transition-all duration-200 ${
                isUnlocked ? "bg-sage text-white" : "text-forest/60 hover:text-forest"
              }`}
            >
              Unlocked State
            </button>
          </div>

          {/* Concentric Layer Visual */}
          <div className="relative w-72 h-72 flex items-center justify-center">
            {/* Outer Layer: Beneficiary Key Shield */}
            <motion.div
              animate={{
                scale: isUnlocked ? 1.05 : 1,
                opacity: isUnlocked ? 0.3 : 1,
                borderColor: hoveredLayer === 2 ? "rgba(0, 62, 203, 0.8)" : "rgba(42, 54, 59, 0.15)",
              }}
              onMouseEnter={() => setHoveredLayer(2)}
              onMouseLeave={() => setHoveredLayer(null)}
              className="absolute inset-0 rounded-full border-[3px] border-dashed flex items-start justify-center pt-3 bg-forest/5 cursor-help transition-colors duration-200"
            >
              <span className="text-[9px] font-bold font-mono tracking-widest text-forest/40 uppercase bg-cream px-2 py-0.5 rounded-md border border-forest/5">
                Layer 2: Beneficiary Public Key
              </span>
            </motion.div>

            {/* Middle Layer: Time Capsule Key Shield */}
            <motion.div
              animate={{
                scale: isUnlocked ? 1.15 : 1,
                opacity: isUnlocked ? 0.15 : 1,
                borderColor: hoveredLayer === 1 ? "rgba(122, 160, 137, 0.8)" : "rgba(42, 54, 59, 0.15)",
              }}
              onMouseEnter={() => setHoveredLayer(1)}
              onMouseLeave={() => setHoveredLayer(null)}
              className="absolute inset-8 rounded-full border-[3px] border-dotted flex items-start justify-center pt-3 bg-forest/5 cursor-help transition-colors duration-200"
            >
              <span className="text-[9px] font-bold font-mono tracking-widest text-forest/40 uppercase bg-cream px-2 py-0.5 rounded-md border border-forest/5">
                Layer 1: Time Capsule Key
              </span>
            </motion.div>

            {/* Core Data Node */}
            <motion.div
              animate={{
                backgroundColor: isUnlocked ? "rgba(122, 160, 137, 0.1)" : "rgba(0, 62, 203, 0.05)",
                borderColor: isUnlocked ? "#7AA089" : "#003ecb",
                scale: isUnlocked ? 1.05 : 1,
              }}
              className="absolute inset-20 rounded-full border-2 bg-white flex flex-col items-center justify-center p-4 text-center shadow-level-1"
            >
              <AnimatePresence mode="wait">
                {isUnlocked ? (
                  <motion.div
                    key="unlocked"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center gap-1 text-sage"
                  >
                    <TbLockOpen className="w-8 h-8" />
                    <span className="text-xs font-mono font-bold tracking-tight uppercase">PLAIN TEXT DATA</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="locked"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center gap-1 text-primary"
                  >
                    <TbLock className="w-8 h-8" />
                    <span className="text-xs font-mono font-bold tracking-tight uppercase">CIPHERTEXT VAULT</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Right Side: Technical Specs & Explanation */}
        <div className="lg:col-span-6 flex flex-col justify-center min-h-[300px]">
          <h3 className="text-xs font-mono font-bold tracking-widest text-forest/40 uppercase mb-2">
            Cascade Execution Scheme
          </h3>
          <h2 className="font-playfair font-bold text-2xl text-forest mb-4 leading-snug">
            {isUnlocked ? "Decryption Pipeline (Reverse Flow)" : "Encryption Pipeline (Forward Flow)"}
          </h2>

          <div className="flex flex-col gap-4 font-medium text-sm sm:text-base leading-relaxed text-forest/70">
            {isUnlocked ? (
              <>
                <div className="flex gap-3 items-start">
                  <span className="bg-sage/10 text-sage w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">1</span>
                  <div>
                    <span className="font-bold text-forest text-sm">Beneficiary authentication</span>: Beneficiary logs in and signs using their secure private key to unlock and peel back the <span className="font-mono text-xs font-bold bg-parchment px-1.5 py-0.5 rounded">Layer 2 Shield</span>.
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="bg-sage/10 text-sage w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">2</span>
                  <div>
                    <span className="font-bold text-forest text-sm">Time release verification</span>: Once outer layer is cleared, the system releases the time capsule key to peel back <span className="font-mono text-xs font-bold bg-parchment px-1.5 py-0.5 rounded">Layer 1 Shield</span>.
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="bg-sage/10 text-sage w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">3</span>
                  <div>
                    <span className="font-bold text-forest text-sm">Vault decrypted</span>: Data is successfully restored on-device to its plain text format. Safe, private, and fully verified.
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-3 items-start">
                  <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">1</span>
                  <div>
                    <span className="font-bold text-forest text-sm">Time capsule seal</span>: Data is first locked with a unique time capsule key on the local browser (<span className="font-mono text-xs font-bold bg-parchment px-1.5 py-0.5 rounded">Layer 1 Shield</span>).
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">2</span>
                  <div>
                    <span className="font-bold text-forest text-sm">Target locking</span>: The time capsule payload is immediately encrypted *again* with the designated beneficiary's public key (<span className="font-mono text-xs font-bold bg-parchment px-1.5 py-0.5 rounded">Layer 2 Shield</span>).
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">3</span>
                  <div>
                    <span className="font-bold text-forest text-sm">Zero-knowledge storage</span>: Locked vault syncs to servers. Even with the time capsule key, nobody (including Cipherwill) can inspect the data without the beneficiary's private key.
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}