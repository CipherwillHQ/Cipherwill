// Defines the data contracts for the landing page's digital legacy risk cards.
// Owns each risk's content, illustration, icon, and card props.
// Does not render the section or store runtime state.

import type { IconType } from "react-icons";

export interface DecayTimelineItem {
  timeframe: string;
  title: string;
  shortDescription: string;
  imageSrc: string;
  imageAlt: string;
  icon: IconType;
}

export interface DecayCardProps {
  event: DecayTimelineItem;
}
