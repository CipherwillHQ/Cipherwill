/**
 * What it does: Supplies timeline milestone data, image references, and concise copy for the ProblemSection.
 * What it owns: TIMELINE_EVENTS dataset and associated visual metadata.
 * What it does NOT do: Does not render UI components or manipulate DOM elements.
 */

import { TbDeviceMobile, TbDatabase, TbCloudOff, TbWallet } from "react-icons/tb";
import { DecayTimelineItem } from "./types";

export const TIMELINE_EVENTS: DecayTimelineItem[] = [
  {
    timeframe: "Day 3",
    badgeBg: "bg-error/20",
    badgeText: "text-error",
    glowColor: "group-hover:shadow-[0_12px_40px_rgba(192,57,43,0.35)]",
    borderColor: "group-hover:border-error/50",
    title: "Device Lockouts",
    shortDescription: "Passcodes lock family out. Vital 2FA verification codes remain trapped on your screen.",
    impactTag: "2FA & Banks Blocked",
    imageSrc: "/images/landing/day3.webp",
    imageAlt: "Locked smartphone with 2FA passcode requirement screen",
    icon: TbDeviceMobile,
  },
  {
    timeframe: "Day 30",
    badgeBg: "bg-warning/20",
    badgeText: "text-warning",
    glowColor: "group-hover:shadow-[0_12px_40px_rgba(200,121,65,0.35)]",
    borderColor: "group-hover:border-warning/50",
    title: "Automated Purges",
    shortDescription: "Billing cards expire. Automated scripts suspend servers and queue backups for deletion.",
    impactTag: "Cloud Data Queued",
    imageSrc: "/images/landing/day30.webp",
    imageAlt: "Server rack with expired payment card and shutdown countdown",
    icon: TbDatabase,
  },
  {
    timeframe: "Day 180",
    badgeBg: "bg-clay/20",
    badgeText: "text-clay",
    glowColor: "group-hover:shadow-[0_12px_40px_rgba(212,163,144,0.35)]",
    borderColor: "group-hover:border-clay/50",
    title: "Account Deletions",
    shortDescription: "Inactive policies trigger at Google & Apple. Drives and decades of photos are erased.",
    impactTag: "Memories Permanently Lost",
    imageSrc: "/images/landing/day180.webp",
    imageAlt: "Cloud drive and family photo frame dissolving into digital particles",
    icon: TbCloudOff,
  },
  {
    timeframe: "Forever",
    badgeBg: "bg-error/20",
    badgeText: "text-error",
    glowColor: "group-hover:shadow-[0_12px_40px_rgba(192,57,43,0.35)]",
    borderColor: "group-hover:border-error/50",
    title: "Stranded Wealth",
    shortDescription: "Seed phrases stay locked in physical drawers, permanently stranded on-chain.",
    impactTag: "$140B+ Inaccessible",
    imageSrc: "/images/landing/forever.webp",
    imageAlt: "Hardware crypto wallet and seed phrase capsule sealed inside padlock",
    icon: TbWallet,
  },
];
