// Explains why digital legacy planning matters on the public landing page.
// Owns the dark section, responsive risk cards, and reassuring solution banner.
// Does not manage account access or inheritance execution.

import { TIMELINE_EVENTS } from "./data";
import DecayCard from "./DecayCard";
import SolutionBanner from "./SolutionBanner";

export default function ProblemSection() {
  return (
    <section
      aria-labelledby="digital-legacy-heading"
      className="w-full bg-forest text-cream py-20 sm:py-24 lg:py-32 border-b border-cream/10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center flex flex-col items-center mb-10 sm:mb-12">
          <p className="font-gilroy font-semibold text-xs uppercase tracking-widest text-clay mb-4">
            Why planning matters
          </p>
          <h2
            id="digital-legacy-heading"
            className="font-playfair text-3xl sm:text-4xl md:text-5xl leading-tight font-bold text-cream max-w-3xl text-balance"
          >
            What happens to your digital life without a plan?
          </h2>
          <p className="font-gilroy font-medium text-cream/80 text-base md:text-lg leading-relaxed max-w-2xl mt-5 text-balance">
            Without clear instructions, your family can lose access to the
            accounts, assets, and memories that matter.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-10">
          {TIMELINE_EVENTS.map((event) => (
            <DecayCard key={event.title} event={event} />
          ))}
        </div>

        <SolutionBanner />
      </div>
    </section>
  );
}
