/**
 * FAQs component for general public pages.
 * Owns the high-impact open-concept trust portal with compact hover cards.
 * Sourced dynamically from the standard FAQ questions list.
 */

"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import questions from "./questions";

export default function FAQs() {
  const faqList = questions.Important.slice(0, 3);

  return (
    <section className="bg-cream/40 py-20 sm:py-28 border-t border-forest/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Open, Borderless Asymmetric Layout (No enclosing box) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Bold Cinematic Showcase (Direct Canvas) */}
          <div className="lg:col-span-5 flex flex-col justify-between py-2">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-sage font-bold">
                Guaranteed Cryptography
              </span>
              <h3 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-forest leading-tight mt-6">
                Trust should be <br />
                <span className="italic font-normal text-forest/80">mathematical,</span><br />
                not corporate.
              </h3>
              <p className="mt-6 text-sm sm:text-base text-forest/70 leading-relaxed font-medium">
                We don't believe in security theater or blind faith. From server survivability to data subpoena protection, we have documented every policy in absolute, rigorous detail.
              </p>
            </div>
          </div>

          {/* Right Column: Compact Tactile List (No box or borders) */}
          <div className="lg:col-span-7 flex flex-col gap-6 py-2">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-sage font-semibold">
                Common Inquiries
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-forest mt-2">
                Confronting your deepest concerns.
              </h2>
            </div>

            {/* Compact Interactive Stack */}
            <div className="divide-y divide-forest/10">
              {faqList.map((question, idx) => (
                <Link key={idx} href={`/i/frequently-asked-questions/${question.slug}`}>
                  <div className="group py-4 flex items-start gap-4 hover:opacity-85 transition-opacity duration-200 cursor-pointer">
                    
                    {/* Small Symbol / Icon */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sage/5 text-sage group-hover:bg-sage/10 transition-colors duration-300 shrink-0 text-base">
                      {question.icon}
                    </div>
                    
                    <div className="grow">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-forest group-hover:text-sage transition-colors duration-200">
                          {question.title}
                        </h4>
                        <span className="text-[11px] text-forest/40 group-hover:text-sage transition-all duration-200 shrink-0 ml-4 flex items-center gap-1">
                          Details <FiArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                      
                      <p className="text-xs text-forest/70 font-medium leading-relaxed mt-1.5 line-clamp-1">
                        {question.description}
                      </p>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Perfectly Centered Bottom Navigation Link */}
        <div className="text-center mt-16 sm:mt-20">
          <Link
            href="/i/frequently-asked-questions"
            className="text-sm sm:text-base font-semibold text-sage hover:text-forest underline transition-colors duration-200 inline-flex items-center gap-1"
          >
            Show all frequently asked questions →
          </Link>
        </div>

      </div>
    </section>
  );
}
