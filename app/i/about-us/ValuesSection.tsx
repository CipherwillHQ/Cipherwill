/**
 * ValuesSection component for the Cipherwill About Us page.
 * Owns the presentation of Cipherwill's core organization values and expert team introduction.
 * Does NOT own the technical security details or user onboarding CTA blocks.
 */

"use client";

const coreValues = [
  {
    num: "01",
    title: "Integrity",
    description: "We prioritize total transparency, ethical engineering, and absolute honesty in all interactions, establishing a foundation of trust with our users.",
  },
  {
    num: "02",
    title: "Security",
    description: "Our cutting-edge encryption technologies represent an unyielding standard. We secure your data mathematically, leaving zero room for human compromise.",
  },
  {
    num: "03",
    title: "User Empowerment",
    description: "We build intuitive platforms designed to hand total cryptographic control back to the individual, clarifying complex technical structures into actionable peace of mind.",
  },
  {
    num: "04",
    title: "Continuous Innovation",
    description: "We proactively refine our security architectures, integrating the latest advancements in quantum-resistant encryption and robust decentralized recovery systems.",
  },
  {
    num: "05",
    title: "Reliability & Trustworthiness",
    description: "We are committed to serving as a permanent, dependable digital custodian, preserving and transitioning legacies across generations without interruption.",
  },
];

export default function ValuesSection() {
  return (
    <section className="bg-[#FBF9F1] py-24 sm:py-32 border-t border-[#2A363B]/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Team Experts Intro */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-primary">
                Our Constitution
              </span>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2A363B] leading-tight mt-1">
                Core Principles & Our Team
              </h2>
            </div>
            <p className="text-base text-[#2A363B]/80 font-medium leading-relaxed">
              Cipherwill is engineered by dedicated cybersecurity, legal, and operational experts. Guided by our founder, we uphold the highest standards of reliability and digital preservation.
            </p>
            <p className="text-sm text-[#2A363B]/60 font-semibold uppercase tracking-wider">
              Zetapad Security Board &copy; 2026
            </p>
          </div>

          {/* Right Column: Numbered Editorial Grid with Lines */}
          <div className="lg:col-span-8 flex flex-col border-b border-[#2A363B]/10">
            {coreValues.map((val, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-8 border-t border-[#2A363B]/10 items-start hover:bg-[#F4F1EA]/30 transition-colors duration-200 px-4 -mx-4 rounded-xl"
              >
                {/* Number */}
                <span className="sm:col-span-2 font-playfair text-3xl font-bold text-[#2A363B]/30 tracking-tight leading-none pt-1">
                  {val.num}
                </span>

                {/* Content */}
                <div className="sm:col-span-10 flex flex-col gap-2">
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#2A363B] leading-tight">
                    {val.title}
                  </h3>
                  <p className="text-base text-[#2A363B]/70 font-medium leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
