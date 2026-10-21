// Supplies the landing section's digital legacy risks and illustrations.
// Owns concise explanations and qualitative timing labels for each risk.
// Does not claim fixed deletion deadlines or render the cards.

import { TbDeviceMobile, TbDatabase, TbCloudOff, TbWallet } from "react-icons/tb";
import type { DecayTimelineItem } from "@/types/interfaces";

export const TIMELINE_EVENTS: DecayTimelineItem[] = [
  {
    timeframe: "Immediately",
    title: "Locked devices",
    shortDescription: "Passcodes and verification codes can keep your family from accessing important accounts.",
    imageSrc: "/images/landing/locked-devices.svg",
    imageAlt: "Illustration of a locked phone and a verification code prompt",
    icon: TbDeviceMobile,
  },
  {
    timeframe: "Over time",
    title: "Interrupted services",
    shortDescription: "Unpaid renewals can interrupt cloud storage and put important files or backups at risk.",
    imageSrc: "/images/landing/interrupted-services.svg",
    imageAlt: "Illustration of cloud storage, a server, and a missed renewal",
    icon: TbDatabase,
  },
  {
    timeframe: "After inactivity",
    title: "Lost memories",
    shortDescription: "Inactive account policies can put years of photos, emails, and personal files at risk.",
    imageSrc: "/images/landing/lost-memories.svg",
    imageAlt: "Illustration of family photos and an inactive cloud account",
    icon: TbCloudOff,
  },
  {
    timeframe: "Without recovery",
    title: "Unreachable assets",
    shortDescription: "Without recovery phrases or clear instructions, digital assets can stay out of reach.",
    imageSrc: "/images/landing/unreachable-assets.svg",
    imageAlt: "Illustration of a crypto wallet, recovery phrase card, and a lock",
    icon: TbWallet,
  },
];
