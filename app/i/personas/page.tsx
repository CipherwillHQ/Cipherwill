/**
 * Personas index page for Cipherwill.
 * Owns the role-based selection of personas, guiding visitors to the tailored digital legacy plans.
 * Does NOT own the individual subpages or core data logic.
 */

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";
import personas from "./data";
import Link from "next/link";
import { FULL_HOSTNAME } from "@/common/constant";
import { TbCode, TbCoins, TbCircleCheck, TbArrowRight } from "react-icons/tb";
import CTA from "@/components/public/CTA";

const title = "Guide to Manage Your Digital Will - Cipherwill";
const description =
  "Learn how professionals like developers, marketers, and entrepreneurs can manage their digital assets with tailored guides for creating a secure digital will.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/personas`,
  },
};

const personaMeta: Record<
  string,
  {
    icon: React.ComponentType<any>;
    color: string;
    bgColor: string;
    highlights: string[];
    description: string;
  }
> = {
  "why-software-engineers-should-have-digital-will": {
    icon: TbCode,
    color: "text-primary",
    bgColor: "bg-primary/5",
    description: "Your code is your legacy. Protect your repositories, access credentials, domains, and cloud resources from being lost in limbo.",
    highlights: [
      "Preserving git repositories & contributions",
      "Automating transfer of hosting & server controls",
      "Securing proprietary code & intellectual property",
      "Protecting software licenses & API access",
    ],
  },
  "why-crypto-traders-must-have-a-digital-will": {
    icon: TbCoins,
    color: "text-clay",
    bgColor: "bg-clay/10",
    description: "Don't take your coins to the grave. Ensure safe, encrypted, and seamless handoff of your wallets, exchanges, and private seed phrases.",
    highlights: [
      "Securing cold storage & hardware wallet instructions",
      "Ensuring transfer of centralized exchange access",
      "Documenting private keys and seed phrases securely",
      "Preventing permanent asset loss in DeFi and Web3",
    ],
  },
};

export default function PersonasPage() {
  return (
    <div className="w-full bg-cream min-h-screen flex flex-col justify-between text-forest font-gilroy antialiased">
      <SmoothPageScroll />
      <Header />

      <main className="w-full flex-grow pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6">
        {/* Editorial Hero Section */}
        <section className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 mb-16 sm:mb-24">
          <div className="flex flex-col gap-3">
            <span className="bg-clay/10 text-clay px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase self-start">
              Persona Guides
            </span>
            <h1 className="font-playfair text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-forest max-w-4xl mt-2">
              Guide to Manage Your Digital Will
            </h1>
          </div>
          <p className="text-lg sm:text-2xl text-forest/80 font-medium leading-relaxed max-w-3xl">
            Every profession builds a unique digital life. Choose your guide to understand how to secure your repositories, cryptographic holdings, and unique online footprint with end-to-end encryption.
          </p>
        </section>

        {/* Grid of Persona Cards */}
        <section className="max-w-7xl mx-auto mb-16 sm:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {personas.map((persona, index) => {
              const meta = personaMeta[persona.slug] || {
                icon: TbCode,
                color: "text-primary",
                bgColor: "bg-primary/5",
                description: "",
                highlights: [],
              };
              const Icon = meta.icon;

              return (
                <Link
                  href={`/i/personas/${persona.slug}`}
                  key={index}
                  className="group bg-parchment/60 backdrop-blur-xs border border-forest/10 rounded-[24px] p-6 sm:p-10 flex flex-col justify-between gap-8 hover:bg-parchment hover:border-primary/30 hover:shadow-level-1 hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 ease-cw-ease cursor-pointer"
                >
                  <div className="flex flex-col gap-6">
                    {/* Top Row: Icon badge */}
                    <div className={`p-4 ${meta.bgColor} ${meta.color} rounded-2xl border border-forest/5 w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xs`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    {/* Text block */}
                    <div className="flex flex-col gap-3">
                      <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-forest group-hover:text-primary transition-colors duration-200 leading-snug">
                        {persona.title}
                      </h2>
                      <p className="text-sm sm:text-base text-forest/70 font-medium leading-relaxed">
                        {meta.description}
                      </p>
                    </div>

                    {/* Highlights list */}
                    {meta.highlights.length > 0 && (
                      <div className="border-t border-forest/5 pt-6 mt-2">
                        <h3 className="text-xs uppercase tracking-wider font-bold text-forest/40 mb-4">
                          Key Areas Covered
                        </h3>
                        <ul className="flex flex-col gap-3">
                          {meta.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-forest/80 font-medium">
                              <TbCircleCheck className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Card Action Link */}
                  <div className="inline-flex items-center gap-2 text-primary font-bold text-sm sm:text-base mt-4">
                    <span>Read the guide</span>
                    <TbArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA section */}
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
