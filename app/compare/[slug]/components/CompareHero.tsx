/**
 * CompareHero component.
 * Renders the hero header section for the comparison pages.
 * Does NOT manage metrics data or FAQs.
 */

"use client";

import Link from "next/link";
import { CompetitorData } from "@/types/interfaces/compare";
import { TbArrowRight } from "react-icons/tb";
import SymbolicLogo from "@/components/public/logo/SymbolicLogo";
import CompetitorLogo from "./CompetitorLogo";

interface CompareHeroProps {
  competitor: CompetitorData;
}

export default function CompareHero({ competitor }: CompareHeroProps) {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("compare-table");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-cream pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-6 sm:gap-8 text-center items-center">
        <div className="inline-flex items-center gap-2 bg-clay/10 text-clay px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
          <SymbolicLogo size={14} overrideTheme="light" />
          <span>Compare Alternatives</span>
        </div>

        {/* Side-by-side Brand Logo Comparison Banner */}
        <div className="flex items-center gap-5 sm:gap-8 bg-parchment/65 px-6 py-4 rounded-[20px] border border-forest/5 shadow-xs my-2 flex-wrap justify-center">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white flex items-center justify-center shadow-xs border border-forest/5 shrink-0 p-2">
              <SymbolicLogo size={36} overrideTheme="light" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-lg sm:text-xl text-forest tracking-tight">Cipherwill</span>
          </div>
          <span className="text-xs font-bold text-forest/40 uppercase tracking-wider bg-forest/5 px-2.5 py-1 rounded-md">VS</span>
          <a
            href={competitor.websiteUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="hover:opacity-90 transition-opacity inline-block"
            title={`Visit ${competitor.name} Website`}
          >
            <CompetitorLogo slug={competitor.slug} size={36} className="text-lg sm:text-xl" />
          </a>
        </div>

        <h1 className="font-playfair text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-forest max-w-4xl">
          {competitor.heroHeading}
        </h1>
        <p className="text-lg sm:text-2xl text-forest/80 font-medium leading-relaxed max-w-3xl">
          {competitor.heroSubheading}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link
            href="/app"
            className="px-8 py-3.5 bg-primary text-white text-base font-bold rounded-xl shadow-xs hover:bg-[#004eff] active:scale-[0.98] transition-all duration-200 inline-flex items-center justify-center gap-2"
          >
            Protect Your Assets
            <TbArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#compare-table"
            onClick={handleScroll}
            className="px-8 py-3.5 bg-parchment/60 hover:bg-parchment border border-forest/10 text-forest text-base font-bold rounded-xl active:scale-[0.98] transition-all duration-200 inline-flex items-center justify-center cursor-pointer"
          >
            View Feature Table
          </a>
        </div>
      </div>
    </section>
  );
}
