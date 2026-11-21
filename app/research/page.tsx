/**
 * Cipherwill Research publication directory page (/research).
 * Owns the research library masthead, featured study highlight, and catalog list of all reports.
 * Does NOT own individual study datasets, charts, or full report prose.
 */

import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";
import { FULL_HOSTNAME } from "@/common/constant";
import formatEditorialDate from "@/common/time/formatEditorialDate";
import researchPieces from "./data";
import ResearchFeaturedBanner from "./components/ResearchFeaturedBanner";
import { TbArrowRight, TbClock, TbDatabase } from "react-icons/tb";

const title = "Cipherwill Research: Digital Legacy & Platform Policy Studies";
const description =
  "Plain-English research on what actually happens to your accounts, files, and money after you pass away or go inactive.";
const canonical = `${FULL_HOSTNAME}/research`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/research" },
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: canonical,
  },
};

export default function ResearchIndexPage() {
  const [featuredPiece, ...olderPieces] = researchPieces;

  return (
    <div className="w-full bg-cream min-h-screen flex flex-col justify-between text-forest font-gilroy antialiased">
      <SmoothPageScroll />
      <Header />

      <main className="w-full flex-grow pt-28 pb-20 sm:pt-36 sm:pb-24 px-4 sm:px-6">
        {/* Archival Masthead */}
        <section className="max-w-7xl mx-auto border-b-2 border-forest/15 pb-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-clay">
                Research Library
              </span>
              <h1 className="font-playfair text-4xl sm:text-6xl font-bold leading-[1.08] tracking-tight text-forest">
                Cipherwill Research
              </h1>
              <p className="text-base sm:text-xl text-forest/75 font-medium leading-relaxed max-w-2xl">
                We read the fine print across tech platforms, banks, and crypto apps so you don&apos;t have to, looking at who deletes old accounts, who locks families out, and what actually works.
              </p>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <div className="bg-parchment/80 border border-forest/10 rounded-2xl px-6 py-4 flex flex-col gap-1 min-w-44">
                <span className="font-gilroy tabular-nums tracking-tight text-2xl sm:text-3xl font-extrabold text-forest">
                  {researchPieces.length}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-forest/55">
                  Published Studies
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Latest Report */}
        {featuredPiece && <ResearchFeaturedBanner piece={featuredPiece} />}

        {/* Catalog List of Research Pieces */}
        <section className="max-w-7xl mx-auto mb-16">
          <div className="flex items-center justify-between border-b border-forest/15 pb-4 mb-6">
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-forest">
              All Published Research
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider text-forest/50">
              {researchPieces.length} {researchPieces.length === 1 ? "Piece" : "Pieces"}
            </span>
          </div>

          <div className="divide-y divide-forest/10 border-y border-forest/10">
            {researchPieces.map((piece, index) => (
              <Link
                key={piece.slug}
                href={`/research/${piece.slug}`}
                className="group py-7 px-2 sm:px-4 hover:bg-parchment/55 transition-colors grid grid-cols-1 lg:grid-cols-12 gap-4 items-center"
              >
                <div className="lg:col-span-2 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-forest/50">
                  <span className="font-mono text-sm text-forest/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{formatEditorialDate(piece.publishedAt)}</span>
                </div>

                <div className="lg:col-span-7 flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-sage uppercase tracking-wider">
                    <span>{piece.category}</span>
                  </div>
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-forest group-hover:text-primary transition-colors leading-snug">
                    {piece.title}
                  </h3>
                  <p className="text-sm text-forest/70 font-medium leading-relaxed line-clamp-2">
                    {piece.subtitle}
                  </p>
                </div>

                <div className="lg:col-span-3 flex flex-wrap lg:flex-col lg:items-end justify-between gap-2 text-xs font-semibold text-forest/55">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <TbDatabase className="w-3.5 h-3.5" />
                      {piece.sampleSize}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <TbClock className="w-3.5 h-3.5" />
                      {piece.readTime}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                    Read report
                    <TbArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {olderPieces.length === 0 && (
            <p className="text-xs font-medium text-forest/50 mt-4">
              More studies on crypto self-custody recovery and password manager emergency access are in progress.
            </p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
