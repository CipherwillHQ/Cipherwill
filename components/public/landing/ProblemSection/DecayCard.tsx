// Presents one digital legacy risk in a cream card within the dark section.
// Owns the milestone label, illustration, explanation, and gentle hover feedback.
// Does not manage timeline state or require hover to reveal information.

import Image from "next/image";
import type { DecayCardProps } from "@/types/interfaces";
import styles from "./DecayCard.module.css";

export default function DecayCard({ event }: DecayCardProps) {
  const Icon = event.icon;

  return (
    <article className={`${styles.card} h-full rounded-2xl overflow-hidden border border-cream/20 bg-cream text-forest flex flex-col`}>
      <div className="flex justify-between items-center gap-3 p-4 bg-parchment">
        <span className={`${styles.badge} px-3 py-1.5 rounded-full bg-cream border border-forest/10 font-gilroy text-xs font-semibold text-forest`}>
          {event.timeframe}
        </span>
        <div className={`${styles.icon} p-2 rounded-xl bg-cream text-forest/70 shrink-0`}>
          <Icon aria-hidden="true" className="w-5 h-5" />
        </div>
      </div>

      <div className="relative aspect-[3/2] overflow-hidden bg-parchment">
        <Image
          src={event.imageSrc}
          alt={event.imageAlt}
          fill
          sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(50vw - 40px), (max-width: 1151px) calc(25vw - 34px), 254px"
          className={`${styles.illustration} object-contain`}
        />
      </div>

      <div className="p-5 flex-1">
        <h3 className="font-gilroy font-bold text-lg text-forest leading-tight">
          {event.title}
        </h3>

        <p className="font-gilroy font-medium text-sm text-forest/80 leading-relaxed mt-2">
          {event.shortDescription}
        </p>
      </div>
    </article>
  );
}
