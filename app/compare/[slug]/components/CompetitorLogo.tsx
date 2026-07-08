/**
 * CompetitorLogo component.
 * Renders the official brand logo from the public/compare-logos folder inside a high-contrast white badge.
 * Supports showing just the icon logo or logo + text brand label.
 * Does NOT own the layout grid or metrics data.
 */

import { HTMLAttributes } from "react";

interface CompetitorLogoProps extends HTMLAttributes<HTMLDivElement> {
  slug: string;
  size?: number;
  showText?: boolean;
}

const competitorNames: Record<string, string> = {
  "trust-and-will": "Trust & Will",
  "legalzoom": "LegalZoom",
  "everplans": "Everplans",
  "goodtrust": "GoodTrust",
};

export default function CompetitorLogo({
  slug,
  size = 32,
  showText = true,
  className = "",
  ...props
}: CompetitorLogoProps) {
  const brandName = competitorNames[slug] || "Competitor";
  const logoFileName = slug.replace(/-/g, "");
  const logoSrc = `/compare-logos/${logoFileName}.svg`;

  // Dynamically select badge dimensions to keep it symmetrical with Cipherwill's logo wrapper
  const badgeClass = size > 24
    ? "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl p-2"
    : "w-8 h-8 rounded-lg p-1";

  const logoImg = (
    <div className={`${badgeClass} bg-white flex items-center justify-center shadow-xs border border-forest/5 shrink-0 overflow-hidden`}>
      <img
        src={logoSrc}
        alt={`${brandName} logo`}
        className="w-full h-full object-contain"
      />
    </div>
  );

  if (!showText) {
    return (
      <div className={`inline-flex items-center ${className}`} {...props}>
        {logoImg}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`} {...props}>
      {logoImg}
      <span className="font-bold text-forest tracking-tight hidden sm:inline" style={{ fontSize: size * 0.55 }}>
        {brandName}
      </span>
    </div>
  );
}
