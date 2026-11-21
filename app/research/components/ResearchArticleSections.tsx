/**
 * ResearchArticleSections component.
 * Renders a sticky paper navigation rail alongside the long-form findings, methodology, and sources.
 * Does NOT own the interactive audit matrix, visual summary bars, or FAQ accordion.
 */

import Link from "next/link";
import { ResearchPiece } from "@/types/interfaces";
import { TbCircleCheck, TbExternalLink, TbShieldLock } from "react-icons/tb";

interface ResearchArticleSectionsProps {
  piece: ResearchPiece;
}

export default function ResearchArticleSections({ piece }: ResearchArticleSectionsProps) {
  return (
    <section id="written-analysis" className="w-full bg-cream py-16 sm:py-24 px-4 sm:px-6 border-t border-forest/10 scroll-mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-28">
          <div className="bg-parchment/70 border border-forest/10 rounded-2xl p-6 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-wider font-bold text-forest/50">
              In This Report
            </span>
            <nav aria-label="Report sections" className="flex flex-col gap-2">
              {piece.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-sm font-semibold text-forest/80 hover:text-primary transition-colors py-1 border-b border-forest/5 last:border-b-0"
                >
                  {section.heading}
                </a>
              ))}
              {piece.citations.length > 0 && (
                <a
                  href="#sources"
                  className="text-sm font-semibold text-forest/80 hover:text-primary transition-colors py-1"
                >
                  Primary Sources ({piece.citations.length})
                </a>
              )}
            </nav>
          </div>

          <div className="bg-parchment/50 border border-forest/10 rounded-2xl p-6 flex flex-col gap-2.5">
            <span className="text-xs font-bold uppercase tracking-widest text-sage">
              How We Checked This
            </span>
            <p className="text-sm text-forest/75 font-medium leading-relaxed">
              {piece.methodology}
            </p>
          </div>

          <div className="border-l-4 border-clay px-5 py-5 bg-clay/5 border-y border-r border-forest/10 rounded-r-2xl flex flex-col gap-3">
            <span className="text-xs uppercase tracking-wider font-bold text-clay">
              Protect Your Own Accounts
            </span>
            <p className="text-sm text-forest/80 font-medium leading-relaxed">
              Store your recovery instructions, 2FA backup codes, and crypto keys in an encrypted vault that only unlocks if you go inactive.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-sage">
              <TbShieldLock className="w-4 h-4 shrink-0" />
              <span>End-to-end encrypted</span>
            </div>
            <Link
              href="/app"
              className="w-full text-center font-bold transition-all py-3 px-4 rounded-xl text-xs uppercase tracking-wider bg-forest text-cream hover:bg-forest/90 active:scale-[0.98]"
            >
              Start Your Plan &rarr;
            </Link>
          </div>
        </aside>

        <div className="lg:col-span-8 flex flex-col gap-12 max-w-3xl">
          {piece.sections.map((section) => (
            <article key={section.id} id={section.id} className="flex flex-col gap-4 scroll-mt-28">
              <h2 className="font-playfair text-2xl sm:text-3xl font-extrabold text-forest leading-tight border-b border-forest/10 pb-3">
                {section.heading}
              </h2>
              {section.summary && (
                <p className="text-base sm:text-lg font-semibold text-forest/90 leading-relaxed">
                  {section.summary}
                </p>
              )}
              {section.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base text-forest/80 font-medium leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="flex flex-col gap-2.5 mt-1 bg-parchment/45 border border-forest/10 rounded-xl p-5">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2.5 text-sm sm:text-base text-forest/85 font-medium"
                    >
                      <TbCircleCheck className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}

          {piece.citations.length > 0 && (
            <div id="sources" className="flex flex-col gap-4 pt-6 border-t border-forest/10 scroll-mt-28">
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-forest">
                Where We Got This Info
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {piece.citations.map((citation) => (
                  <li key={citation.url}>
                    <a
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start justify-between gap-3 p-4 rounded-xl bg-parchment/55 border border-forest/10 hover:border-primary/40 transition-colors group"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-forest group-hover:text-primary transition-colors">
                          {citation.label}
                        </span>
                        <span className="text-xs font-semibold text-forest/55">
                          {citation.source}
                        </span>
                      </div>
                      <TbExternalLink className="w-4 h-4 text-forest/40 group-hover:text-primary shrink-0 mt-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
