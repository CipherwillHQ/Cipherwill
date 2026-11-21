/**
 * Dynamic research piece detail route (/research/[slug]).
 * Renders an individual research report with paper masthead, abstract, data summary, matrix, and FAQs.
 * Does NOT own raw research datasets or the /research publication index layout.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";
import CTA from "@/components/public/CTA";
import { FULL_HOSTNAME } from "@/common/constant";
import formatEditorialDate from "@/common/time/formatEditorialDate";
import researchPieces from "../data";
import ResearchVisualSummary from "../components/ResearchVisualSummary";
import ResearchMatrix from "../components/ResearchMatrix";
import ResearchArticleSections from "../components/ResearchArticleSections";
import ResearchFAQ from "../components/ResearchFAQ";
import { TbArrowDown, TbChevronLeft } from "react-icons/tb";

interface ResearchPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return researchPieces.map((piece) => ({ slug: piece.slug }));
}

export async function generateMetadata({ params }: ResearchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const piece = researchPieces.find((item) => item.slug === slug);
  if (!piece) return {};

  const url = `${FULL_HOSTNAME}/research/${piece.slug}`;
  return {
    title: piece.metaTitle,
    description: piece.metaDescription,
    keywords: piece.keywords,
    alternates: { canonical: `/research/${piece.slug}` },
    openGraph: {
      type: "article",
      title: piece.metaTitle,
      description: piece.metaDescription,
      url,
      publishedTime: piece.publishedAt,
      modifiedTime: piece.updatedAt,
      images: ["/og-img.png"],
    },
  };
}

export default async function ResearchDetailPage({ params }: ResearchPageProps) {
  const { slug } = await params;
  const piece = researchPieces.find((item) => item.slug === slug);
  if (!piece) notFound();

  const url = `${FULL_HOSTNAME}/research/${piece.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: piece.title,
    description: piece.metaDescription,
    datePublished: piece.publishedAt,
    dateModified: piece.updatedAt,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: "Cipherwill Research", url: FULL_HOSTNAME },
    publisher: { "@type": "Organization", name: "Cipherwill", url: FULL_HOSTNAME },
  };

  return (
    <div className="w-full bg-cream min-h-screen flex flex-col justify-between text-forest font-gilroy antialiased">
      <SmoothPageScroll />
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <main className="w-full flex-grow">
        <section className="pt-28 pb-14 sm:pt-36 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-forest/10">
            <Link
              href="/research"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-forest/60 hover:text-primary transition-colors group"
            >
              <TbChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Research</span>
            </Link>

            <span className="bg-sage/15 text-sage px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {piece.category}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <h1 className="font-playfair text-3xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.08] tracking-tight text-forest">
                {piece.title}
              </h1>

              <p className="text-lg sm:text-xl text-forest/75 font-medium leading-relaxed max-w-2xl">
                {piece.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                {piece.platformAudit && (
                  <a
                    href="#audit-matrix"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-[#004eff] text-white text-sm font-bold transition-all active:scale-[0.98] focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <span>Explore {piece.platformAudit.length} Platforms</span>
                    <TbArrowDown className="w-4 h-4" />
                  </a>
                )}
                <a
                  href="#written-analysis"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-forest/15 text-forest/85 hover:bg-parchment/70 text-sm font-bold transition-all active:scale-[0.98]"
                >
                  Read Written Findings
                </a>
                <a
                  href="#sources"
                  className="text-sm font-bold text-forest/60 hover:text-primary px-2 py-2 transition-colors"
                >
                  Sources ({piece.citations.length})
                </a>
              </div>
            </div>

            <aside className="lg:col-span-4 bg-parchment/75 border border-forest/10 rounded-2xl p-6 flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-forest/45 pb-3 border-b border-forest/10">
                Study Details
              </span>
              <dl className="divide-y divide-forest/10 text-sm">
                <div className="py-3 flex items-center justify-between gap-4">
                  <dt className="text-forest/55 font-semibold">Published</dt>
                  <dd className="text-forest font-bold text-right">
                    {formatEditorialDate(piece.publishedAt)}
                  </dd>
                </div>
                <div className="py-3 flex items-center justify-between gap-4">
                  <dt className="text-forest/55 font-semibold">Coverage</dt>
                  <dd className="text-forest font-bold text-right">{piece.sampleSize}</dd>
                </div>
                <div className="py-3 flex items-center justify-between gap-4">
                  <dt className="text-forest/55 font-semibold">Reading Time</dt>
                  <dd className="text-forest font-bold text-right">{piece.readTime}</dd>
                </div>
                <div className="pt-3 flex items-center justify-between gap-4">
                  <dt className="text-forest/55 font-semibold">References</dt>
                  <dd className="text-right">
                    <a
                      href="#sources"
                      className="text-primary font-bold hover:underline"
                    >
                      {piece.citations.length} official docs
                    </a>
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <ResearchVisualSummary
          keyFindings={piece.keyFindings}
          entries={piece.platformAudit}
        />

        {piece.platformAudit && <ResearchMatrix entries={piece.platformAudit} />}
        <ResearchArticleSections piece={piece} />
        <ResearchFAQ faqs={piece.faqs} />
      </main>

      <CTA />
      <Footer />
    </div>
  );
}
