/**
 * CompareFAQ component.
 * Renders an interactive FAQ accordion with schema.org JSON-LD structured data for SEO.
 * Owns FAQ list state and JSON-LD injection.
 */

"use client";

import { useState } from "react";
import { CompetitorData } from "@/types/interfaces/compare";
import { TbChevronDown } from "react-icons/tb";

interface CompareFAQProps {
  competitor: CompetitorData;
}

export default function CompareFAQ({ competitor }: CompareFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Structured data for SEO rich snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": competitor.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <section className="w-full bg-[#2A363B] text-cream py-20 sm:py-28 px-4 sm:px-6">
      {/* Schema.org FAQ Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-cream/70 font-medium">
            Clear answers about using Cipherwill compared to traditional planning services.
          </p>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-4 mt-4">
          {competitor.faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-cream/[0.03] border border-cream/10 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left font-semibold text-base sm:text-lg text-cream hover:bg-cream/[0.05] transition-colors focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <span className="pr-4">{faq.question}</span>
                  <TbChevronDown
                    className={`w-5 h-5 text-cream/50 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180 text-cream" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="p-6 sm:p-7 pt-0 text-sm sm:text-base text-cream/70 leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
