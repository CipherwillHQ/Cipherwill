/*
 * FactorsGrid.tsx
 * What it does: Renders interactive, high-fidelity schematic cards for each supported security factor.
 * What it owns: Visual grid layout, hover-states, and detailed security property cards.
 * What it does NOT do: It does not render the encryption status matrix or the main page wrapper.
 */

"use client";

import { motion } from "framer-motion";
import {
  TbLock,
  TbShieldLock,
  TbDeviceUsb,
  TbFingerprint,
  TbWallet,
} from "react-icons/tb";

interface Factor {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  keySize: string;
  storage: string;
  strength: "High" | "Extreme" | "Ultimate";
  description: string;
  badgeBg: string;
  badgeText: string;
}

const factors: Factor[] = [
  {
    title: "Master Password",
    subtitle: "User-generated client passphrase",
    icon: TbLock,
    keySize: "256-bit PBKDF2 / AES",
    storage: "Decrypted on-device dynamically",
    strength: "High",
    description: "A secure, user-managed password. We apply intense key-stretching (PBKDF2 with SHA-256) on your local device to generate robust cryptographic locks.",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-900",
  },
  {
    title: "FIDO2 Keys",
    subtitle: "Hardware cryptographic credential",
    icon: TbShieldLock,
    keySize: "256-bit ECC (secp256r1)",
    storage: "On-chip secure enclave",
    strength: "Extreme",
    description: "Industry-standard hardware keys that resist phishing attacks by using asymmetric cryptography tied specifically to our origin hostname.",
    badgeBg: "bg-sage/10",
    badgeText: "text-sage",
  },
  {
    title: "YubiKeys",
    subtitle: "Physical authenticator device",
    icon: TbDeviceUsb,
    keySize: "HMAC-SHA1 / Asymmetric RSA",
    storage: "Physical cryptographic chip",
    strength: "Ultimate",
    description: "Integrate premium hardware authenticators. Decryption keys are unlocked via hardware-bound touch-to-approve user actions.",
    badgeBg: "bg-clay/10",
    badgeText: "text-clay",
  },
  {
    title: "Device Passkeys",
    subtitle: "Biometric Hardware Auth",
    icon: TbFingerprint,
    keySize: "256-bit ECC / WebAuthn",
    storage: "Secure Enclave (Apple/Android)",
    strength: "Extreme",
    description: "Leverage TouchID, FaceID, or Windows Hello. Generates unique, tamper-proof device credentials that are completely un-phishable.",
    badgeBg: "bg-warning/10",
    badgeText: "text-warning",
  },
  {
    title: "Web3 Wallets",
    subtitle: "MetaMask & Ethereum keys",
    icon: TbWallet,
    keySize: "secp256k1 Elliptic Curve",
    storage: "Local wallet extension storage",
    strength: "Ultimate",
    description: "Sign on-device payloads with your Web3 keys. Cipherwill uses standard elliptic curve cryptography to link your decentralized identity securely.",
    badgeBg: "bg-primary-50",
    badgeText: "text-primary-800",
  },
];

export default function FactorsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto py-8">
      {factors.map((factor, index) => {
        const Icon = factor.icon;
        return (
          <motion.div
            key={factor.title}
            whileHover={{ y: -4, borderColor: "rgba(0, 62, 203, 0.3)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white border border-forest/10 rounded-2xl p-6 shadow-level-1 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Schematic Top Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-parchment/60 text-forest flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${factor.badgeBg} ${factor.badgeText}`}
                >
                  {factor.strength}
                </span>
              </div>

              {/* Title & Sub */}
              <h3 className="font-playfair text-xl font-bold text-forest leading-tight">
                {factor.title}
              </h3>
              <p className="text-xs text-forest/40 font-mono mt-1 font-bold">
                {factor.subtitle}
              </p>

              {/* Body Description */}
              <p className="text-sm text-forest/70 font-medium mt-4 leading-relaxed">
                {factor.description}
              </p>
            </div>

            {/* Technical Spec Footer (Schematic Details) */}
            <div className="border-t border-forest/5 pt-4 mt-6 flex flex-col gap-2">
              <div className="flex justify-between items-center text-[11px] font-mono font-semibold">
                <span className="text-forest/40 uppercase">Algorithm</span>
                <span className="text-forest/80 text-right truncate max-w-[150px]">{factor.keySize}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono font-semibold">
                <span className="text-forest/40 uppercase">Storage</span>
                <span className="text-forest/80 text-right truncate max-w-[150px]">{factor.storage}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}