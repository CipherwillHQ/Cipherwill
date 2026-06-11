/**
 * What it does: Renders an ultra-premium, interactive Cascade Encryption visualizer.
 * What it owns: Overlapping cryptographic plates, state-based animations, and clean, non-clashing active/delivered text states.
 * What it does NOT do: Does not perform actual mathematical key calculations.
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbLock, TbLockOpen, TbShieldCheck, TbKey, TbUsers } from "react-icons/tb";

interface CascadeLayer {
  id: string;
  num: string;
  name: string;
  spec: string;
  description: string;
  icon: any;
  color: string;
  decryptedValue: string;
}

const LAYERS: CascadeLayer[] = [
  {
    id: "device",
    num: "Layer 01",
    name: "AES-256-GCM Sealing",
    spec: "Symmetric Cipher",
    description: "Your digital estate is locked locally in browser memory before uploading. We never hold your master passcode.",
    icon: TbLock,
    color: "text-primary-300",
    decryptedValue: "aes_gcm_unlocked::0x7C2B...2E80"
  },
  {
    id: "beneficiary",
    num: "Layer 02",
    name: "ECDH (SECP256K1) Target Lock",
    spec: "Asymmetric Public Key",
    description: "The time-capsule is locked specifically with your beneficiary's public key, preventing platform interception.",
    icon: TbUsers,
    color: "text-sage",
    decryptedValue: "ecdh_shared_secret::0x8F9E...42D1"
  },
  {
    id: "timelock",
    num: "Layer 03",
    name: "TLOCK Time-Release Gate",
    spec: "Time-Release Beacon",
    description: "Time-release keys are cryptographically locked until the silent check-in countdown timer fully expires.",
    icon: TbKey,
    color: "text-clay",
    decryptedValue: "tlock_beacon_released::0x3A1D...BF90"
  }
];

export default function ShardingVisualizer() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  return (
    <div className="w-full bg-cream/5 border border-cream/10 rounded-2xl p-6 sm:p-8 flex flex-col items-center select-none">
      
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="font-gilroy font-bold text-base text-cream flex items-center justify-center gap-2">
          <TbShieldCheck className="w-5 h-5 text-sage" />
          Concentric Cryptographic Cascade
        </h3>
        <p className="font-gilroy font-medium text-xs text-cream/60 mt-1 max-w-sm mx-auto">
          See how your secrets are secured under multiple sequential mathematical seals.
        </p>
      </div>

      {/* Interactive Visual Stage */}
      <div className="relative w-full flex flex-col items-center justify-center border border-cream/5 rounded-xl bg-forest/40 p-6 min-h-[350px] overflow-hidden">
        
        {/* Decryption Success Banner */}
        <AnimatePresence>
          {isUnlocked && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage/15 border border-sage/20 text-sage font-gilroy font-bold text-xs uppercase tracking-wider mb-6"
            >
              <TbLockOpen className="w-4 h-4" />
              <span>All Cascade Seals Cleared</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Stacked Plates */}
        <div className="w-full max-w-md flex flex-col items-center relative">
          <div className="w-full flex flex-col gap-3">
            {LAYERS.map((layer) => {
              const Icon = isUnlocked ? TbLockOpen : layer.icon;

              return (
                <motion.div
                  key={layer.id}
                  layout
                  animate={{
                    borderColor: isUnlocked ? "rgba(122, 160, 137, 0.25)" : "rgba(251, 249, 241, 0.12)",
                    backgroundColor: isUnlocked ? "rgba(122, 160, 137, 0.04)" : "rgba(251, 249, 241, 0.04)",
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="w-full p-4 rounded-xl border flex gap-4 items-center shadow-level-1 transition-all"
                >
                  {/* Left: Icon Badge */}
                  <div className={`p-2.5 rounded-lg shrink-0 transition-colors ${
                    isUnlocked ? "bg-sage/10 text-sage" : `bg-cream/5 ${layer.color}`
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Center: Details */}
                  <div className="grow min-w-0 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[8px] uppercase tracking-wider text-cream/40 font-bold">
                        {layer.num}
                      </span>
                      <span className={`font-mono text-[8px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded transition-colors ${
                        isUnlocked ? "bg-sage/10 text-sage" : "bg-cream/5 text-cream/60"
                      }`}>
                        {layer.spec}
                      </span>
                    </div>
                    <h4 className="font-gilroy font-bold text-xs sm:text-sm text-cream mt-0.5 truncate">
                      {layer.name}
                    </h4>
                    <code className="font-mono text-[9px] block mt-1 leading-none text-sage/70">
                      {isUnlocked ? layer.decryptedValue : "••••••••••••••••••••••••"}
                    </code>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>

      {/* State Toggle Buttons */}
      <div className="flex gap-2 w-full mt-4">
        <button
          onClick={() => setIsUnlocked(false)}
          className={`flex-1 py-2.5 rounded-xl text-xs font-gilroy font-bold tracking-wider uppercase transition-all cursor-pointer ${
            !isUnlocked 
              ? "bg-primary text-white shadow-level-1" 
              : "bg-cream/5 text-cream/60 hover:bg-cream/10"
          }`}
        >
          Locked (Cascade Intact)
        </button>
        <button
          onClick={() => setIsUnlocked(true)}
          className={`flex-1 py-2.5 rounded-xl text-xs font-gilroy font-bold tracking-wider uppercase transition-all cursor-pointer ${
            isUnlocked 
              ? "bg-sage text-white shadow-level-1" 
              : "bg-cream/5 text-cream/60 hover:bg-cream/10"
          }`}
        >
          Unlocked (Cascade Cleared)
        </button>
      </div>

      {/* Safety Declaration */}
      <div className="mt-4 p-3 bg-cream/5 rounded-lg border border-cream/5 text-center w-full">
        <p className="font-gilroy font-medium text-xs text-cream/70 leading-relaxed">
          {isUnlocked 
            ? "🔓 Decryption Completed: Only your beneficiary's private key combined with the released time capsule key can unlock the ciphertext on their device."
            : "🔒 Multi-Layered Protection: All mathematical seals must be cleared sequentially to read the underlying digital estate assets."
          }
        </p>
      </div>
    </div>
  );
}
