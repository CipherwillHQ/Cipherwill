/*
 * page.tsx
 * What it does: Renders the Execution Timeline explainer public page.
 * What it owns: Page layout, SEO metadata, hero section, and structural blocks.
 * What it does NOT do: It does not implement the interactive timeline widget logic itself.
 */

import { FULL_HOSTNAME } from "@/common/constant";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CTA from "@/components/public/CTA";
import TimelineVisual from "./TimelineVisual";
import FAQs from "@/components/public/FAQs";

const title = "Execution Timeline Explained - Cipherwill";
const description =
  "Learn how Cipherwill securely executes your digital will upon predefined triggers, discover the steps involved from trigger to delivery.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/how-execution-timeline-works`,
  },
};

export default function WillExecutionTimeline() {
  return (
    <div className="bg-cream min-h-screen text-forest font-sans">
      <SmoothPageScroll />
      <Header />

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-forest/10 bg-parchment/50 text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Cipherwill Smart Schedule
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold text-forest leading-tight">
          Will Execution Timeline
        </h1>
        <p className="mt-6 text-base sm:text-lg text-forest/70 max-w-xl mx-auto font-medium leading-relaxed">
          {description}
        </p>
      </section>

      {/* Interactive Diagram Section */}
      <section className="px-4 py-8 max-w-7xl mx-auto flex flex-col items-center">
        <TimelineVisual />
        <p className="mt-8 text-xs sm:text-sm text-forest/50 font-mono font-bold tracking-wider uppercase text-center bg-parchment/40 px-4 py-2 rounded-full border border-forest/5">
          * Note: You can customize all the time periods according to your choice.
        </p>
      </section>

      {/* Architectural Guarantee Section (Alternating Rhythm: Dark Block) */}
      <section className="bg-forest text-cream py-20 px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-6">
            Our Automated Fail-Safe Guarantee
          </h2>
          <p className="text-cream/80 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
            Cipherwill's schedule is completely autonomous and trustless. At no point
            can any operator, external attacker, or unauthorized third-party speed up or delay 
            your timeline. The release of keys is strictly cryptographic, ensuring your absolute control.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
            <div className="bg-cream/5 border border-cream/10 rounded-xl p-5">
              <h3 className="font-semibold text-lg mb-2 text-white">Non-Custodial</h3>
              <p className="text-sm text-cream/70">
                Your keys remain fully encrypted on your device. We never possess plain text copies.
              </p>
            </div>
            <div className="bg-cream/5 border border-cream/10 rounded-xl p-5">
              <h3 className="font-semibold text-lg mb-2 text-white">Immutable Timeline</h3>
              <p className="text-sm text-cream/70">
                Reminders are hard-coded. Any activity instantly cancels and resets the countdown.
              </p>
            </div>
            <div className="bg-cream/5 border border-cream/10 rounded-xl p-5">
              <h3 className="font-semibold text-lg mb-2 text-white">Wipe Commitment</h3>
              <p className="text-sm text-cream/70">
                We retain zero legacy data after the purge phase to protect your absolute privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <FAQs />
      </section>

      <CTA />
      <Footer />
    </div>
  );
}