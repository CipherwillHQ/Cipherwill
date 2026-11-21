/**
 * ResearchFAQ component.
 * Renders study FAQs in an accessible accordion and emits FAQPage JSON-LD for search rich results.
 * Does NOT own research matrix tables or study narrative sections.
 */

"use client";

import { useState } from "react";
import { ResearchFAQ as ResearchFAQItem } from "@/types/interfaces";
import { TbChevronDown } from "react-icons/tb";

interface ResearchFAQProps {
  faqs: ResearchFAQItem[];
}

export default function ResearchFAQ({ faqs }: ResearchFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs.length) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="w-full bg-[#2A363B] text-cream py-16 sm:py-24 px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col gap-3 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-cream/50">
            Common Questions
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold leading-tight">
            Questions People Ask
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="bg-cream/[0.04] border border-cream/10 rounded-2xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-semibold text-base sm:text-lg text-cream hover:bg-cream/[0.06] transition-colors cursor-pointer"
                >
                  <span className="pr-4">{faq.question}</span>
                  <TbChevronDown
                    className={`w-5 h-5 text-cream/60 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-cream" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-cream/75 leading-relaxed font-medium">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
