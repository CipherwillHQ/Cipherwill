/**
 * ResearchFeaturedBanner component.
 * Renders the flagship dark-slate study spotlight card on the /research index page.
 * Does NOT own the archival masthead, full study catalog, or individual report layout.
 */

import Link from "next/link";
import { ResearchPiece } from "@/types/interfaces";
import formatEditorialDate from "@/common/time/formatEditorialDate";
import { TbArrowRight } from "react-icons/tb";

interface ResearchFeaturedBannerProps {
  piece: ResearchPiece;
}

export default function ResearchFeaturedBanner({ piece }: ResearchFeaturedBannerProps) {
  return (
    <section className="max-w-7xl mx-auto mb-16">
      <div className="bg-[#2A363B] text-cream rounded-3xl p-6 sm:p-10 lg:p-12 border border-forest/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider text-cream/65">
            <span className="bg-clay/20 text-clay px-3 py-1 rounded-full">
              Latest Report
            </span>
            <span>{piece.category}</span>
            <span>{formatEditorialDate(piece.publishedAt)}</span>
          </div>

          <h2 className="font-playfair text-2xl sm:text-4xl font-bold leading-tight text-cream">
            {piece.title}
          </h2>
          <p className="text-sm sm:text-base text-cream/75 font-medium leading-relaxed max-w-2xl">
            {piece.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={`/research/${piece.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-[#004eff] text-white text-sm font-bold transition-all active:scale-[0.98]"
            >
              Read Full Report
              <TbArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/research/${piece.slug}#audit-matrix`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-cream/20 text-cream/85 hover:bg-cream/10 text-sm font-bold transition-all"
            >
              Explore the {piece.sampleSize} Table
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4 grid grid-cols-2 gap-3">
          {piece.keyFindings.slice(0, 4).map((stat) => (
            <div
              key={stat.label}
              className="bg-cream/[0.05] border border-cream/10 rounded-2xl p-4 flex flex-col gap-1"
            >
              <span className="font-gilroy tabular-nums tracking-tight text-2xl font-extrabold text-cream">
                {stat.value}
              </span>
              <span className="text-xs font-semibold text-cream/70 leading-snug">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
