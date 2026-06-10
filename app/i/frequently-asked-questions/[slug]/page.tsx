/**
 * FrequentlyAskedQuestions slug page route (/i/frequently-asked-questions/[slug]).
 * Owns the dynamic metadata generation and passes the selected slug
 * to the FAQ interactive workspace.
 * Does NOT own interactive states or raw question layouts.
 */

import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CTA from "@/components/public/CTA";
import FAQInteractiveSection from "@/components/public/FAQs/FAQInteractiveSection";
import questions from "@/components/public/FAQs/questions";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}): Promise<Metadata> {
  const { slug } = await params;
  let faq;
  for (const key in questions) {
    faq = questions[key].find((f) => f.slug === slug);
    if (faq) break;
  }
  if (!faq) return redirect("/i/frequently-asked-questions");
  const title = faq.title;
  const description =
    faq.description.substring(0, 150).split(" ").slice(0, -1).join(" ") + "...";
  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      images: ["/og-img.png"],
      url: `${FULL_HOSTNAME}/i/frequently-asked-questions/${slug}`,
    },
  };
}

export default async function FAQPage({ params }) {
  const { slug } = await params;
  let faq;
  for (const key in questions) {
    faq = questions[key].find((f) => f.slug === slug);
    if (faq) break;
  }
  if (!faq) return redirect("/i/frequently-asked-questions");

  return (
    <div className="w-full min-h-screen bg-cream flex flex-col text-[#2A363B] antialiased">
      <Header />

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 border-b border-black/3">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-sage font-bold mb-4">
            Security & Continuity Support
          </span>
          <p className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-[#2A363B] max-w-3xl mb-6">
            Frequently Asked Questions
          </p>
          <p className="text-neutral-500 font-medium text-base sm:text-lg max-w-2xl leading-relaxed">
            Everything you need to know about Cipherwill, digital inheritance, high-grade cryptography, and protecting your virtual legacy.
          </p>
        </div>
      </section>

      {/* Interactive FAQ Workspace prefilled with slug */}
      <main className="grow w-full py-8">
        <FAQInteractiveSection initialSlug={slug} />
      </main>

      <CTA />
      <Footer />
    </div>
  );
}
