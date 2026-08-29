/**
 * What it does: Defines TypeScript data types and interfaces for the ProblemSection timeline cards.
 * What it owns: DecayTimelineItem interface, visual glow accents, and hover overlay properties.
 * What it does NOT do: Does not render components or hold runtime state.
 */

import { IconType } from "react-icons";

export interface DecayTimelineItem {
  timeframe: string;
  badgeBg: string;
  badgeText: string;
  glowColor: string;
  borderColor: string;
  title: string;
  shortDescription: string;
  impactTag: string;
  imageSrc: string;
  imageAlt: string;
  icon: IconType;
}
