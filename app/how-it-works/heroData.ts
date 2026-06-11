/**
 * heroData.ts
 * Defines the card structural data for the "How It Works" interactive hero constellation.
 * Focuses on security, dead man's switch, and delivery mechanisms of Cipherwill.
 */

import { IconType } from "react-icons";
import {
  TbShieldCheck,
  TbKey,
  TbActivity,
  TbUsers,
  TbBinary,
  TbBellRinging,
  TbHourglass,
  TbFileCertificate,
  TbLockCode,
  TbWallet,
  TbFiles,
  TbDeviceDesktop,
} from "react-icons/tb";

export interface ConstellationCard {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  icon: IconType;
  ring: "inner" | "outer";
}

export const constellationCards: ConstellationCard[] = [
  // Inner Ring (5 cards)
  {
    id: "inner-1",
    category: "Security",
    title: "AES-256 Cascade",
    subtitle: "Multi-layer payload wrapping",
    icon: TbShieldCheck,
    ring: "inner",
  },
  {
    id: "inner-2",
    category: "Encryption",
    title: "Zero-Knowledge",
    subtitle: "Keys never leave your device",
    icon: TbKey,
    ring: "inner",
  },
  {
    id: "inner-3",
    category: "Monitoring",
    title: "Dead Man's Switch",
    subtitle: "Automatic check-in heartbeats",
    icon: TbActivity,
    ring: "inner",
  },
  {
    id: "inner-4",
    category: "Delivery",
    title: "Secure Trust Handoff",
    subtitle: "Encrypted data delivery",
    icon: TbUsers,
    ring: "inner",
  },
  {
    id: "inner-5",
    category: "Privacy",
    title: "Shamir's Shards",
    subtitle: "Split and distributed keys",
    icon: TbBinary,
    ring: "inner",
  },

  // Outer Ring (7 cards)
  {
    id: "outer-1",
    category: "Intervals",
    title: "Custom Timing",
    subtitle: "Flexible check-in schedule",
    icon: TbBellRinging,
    ring: "outer",
  },
  {
    id: "outer-2",
    category: "Timelock",
    title: "Time Capsule",
    subtitle: "Time-bound access control",
    icon: TbHourglass,
    ring: "outer",
  },
  {
    id: "outer-3",
    category: "Execution",
    title: "Automated Legacy",
    subtitle: "Self-custody execution engine",
    icon: TbFileCertificate,
    ring: "outer",
  },
  {
    id: "outer-4",
    category: "Credentials",
    title: "Password Vault",
    subtitle: "Encrypted login credentials",
    icon: TbLockCode,
    ring: "outer",
  },
  {
    id: "outer-5",
    category: "Web3",
    title: "Crypto Seed Phrases",
    subtitle: "Hardware-level security",
    icon: TbWallet,
    ring: "outer",
  },
  {
    id: "outer-7",
    category: "Auth",
    title: "YubiKey & FIDO2",
    subtitle: "Hardware authentication keys",
    icon: TbDeviceDesktop,
    ring: "outer",
  },
];
