/**
 * FrequentlyAskedQuestions page route (/i/frequently-asked-questions).
 * Owns the public FAQ landing page layout and introductory headers.
 * Does NOT own interactive section states or individual question details.
 */

import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CTA from "@/components/public/CTA";
import FAQInteractiveSection from "@/components/public/FAQs/FAQInteractiveSection";

const title = "Frequently Asked Questions";
const description =
  "Find answers to common questions about Cipherwill, including how it works, security measures, and account management. Get the information you need quickly and easily.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/frequently-asked-questions`,
  },
};

export default function FrequentlyAskedQuestions() {
  return (
    <div className="w-full min-h-screen bg-cream flex flex-col text-[#2A363B] antialiased">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 sm:pb-24 px-4 border-b border-black/3">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-sage font-bold mb-4">
            Security & Continuity Support
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-[#2A363B] max-w-3xl mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-neutral-500 font-medium text-base sm:text-lg max-w-2xl leading-relaxed">
            Everything you need to know about Cipherwill, digital inheritance, high-grade cryptography, and protecting your virtual legacy.
          </p>
        </div>
      </section>

      {/* Interactive FAQ Workspace */}
      <main className="grow w-full py-8">
        <FAQInteractiveSection initialSlug={null} />
      </main>

      <CTA />
      <Footer />
    </div>
  );
}
