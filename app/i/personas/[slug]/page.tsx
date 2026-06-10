/**
 * Persona detail page for Cipherwill.
 * Owns the specific guide article for a selected persona, explaining why a digital will is vital.
 * Does NOT own the data structure definition or global headers/footers.
 */

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";
import personas from "../data";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { FULL_HOSTNAME } from "@/common/constant";
import Link from "next/link";
import CTA from "@/components/public/CTA";
import Image from "next/image";
import { TbChevronLeft, TbClock, TbCircleCheck, TbLock } from "react-icons/tb";

type PersonaRouteParams = {
  slug: string;
};

type PersonaPageProps = {
  params: Promise<PersonaRouteParams>;
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function formatStaticDate(dateStr: string) {
  if (!dateStr) return "September 23, 2024";
  const [year, month, day] = dateStr.split("-");
  const monthName = MONTHS[parseInt(month, 10) - 1] || "September";
  return `${monthName} ${parseInt(day, 10)}, ${year}`;
}

function getDescription(job: string) {
  return `Learn how ${job}s can easily create and manage a digital will to ensure their online accounts and assets are securely passed on to their chosen beneficiaries.`;
}

export async function generateMetadata({
  params,
}: PersonaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const persona = personas.find((persona) => persona.slug === slug);
  if (!persona) return redirect("/i/personas");
  const { title: persona_title, persona: job } = persona;
  const title = `${persona_title} - Cipherwill`;
  const description = getDescription(job);

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      images: ["/og-img.png"],
      url: `${FULL_HOSTNAME}/i/personas/${slug}`,
    },
  };
}

export default async function PersonaPage({ params }: PersonaPageProps) {
  const { slug } = await params;
  const persona = personas.find((persona) => persona.slug === slug);
  if (!persona) return redirect("/i/personas");

  return (
    <div className="w-full bg-cream min-h-screen flex flex-col justify-between text-forest font-gilroy antialiased">
      <SmoothPageScroll />
      <Header />

      <main className="w-full flex-grow pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          href="/i/personas"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-forest/50 hover:text-primary transition-colors mb-8 group"
        >
          <TbChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span>Back to guides</span>
        </Link>

        {/* Responsive Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Main Article Body */}
          <article className="lg:col-span-8 flex flex-col">
            {/* Category and Title */}
            <span className="text-xs font-bold uppercase tracking-widest text-sage mb-3">
              Guide for {persona.persona}s
            </span>
            <h1 className="font-playfair text-3.5xl sm:text-5xl lg:text-6xl font-black text-forest leading-[1.15] tracking-tight mb-6">
              {persona.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-forest/50 font-semibold mb-8 pb-6 border-b border-forest/10">
              <span>Published {formatStaticDate(persona.date)}</span>
              <span className="w-1 h-1 rounded-full bg-forest/20" />
              <span className="flex items-center gap-1.5">
                <TbClock className="w-4 h-4" />
                <span>5 min read</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-forest/20" />
              <span className="flex items-center gap-1.5 text-sage">
                <TbLock className="w-4 h-4" />
                <span>End-to-End Encrypted</span>
              </span>
            </div>

            {/* Editorial Hero Image */}
            <div className="relative overflow-hidden rounded-2xl border border-forest/10 bg-cream shadow-xs mb-8">
              <Image
                src="/og-img.png"
                alt="Cipherwill Vault Preview"
                width={1200}
                height={630}
                className="w-full h-auto object-cover"
                priority
              />
            </div>

            {/* Rich Text Introductions */}
            <div className="text-lg sm:text-xl text-forest/90 font-medium leading-relaxed mb-10 flex flex-col gap-6">
              <p>
                Every modern profession builds a unique digital footprint, yet standard legal wills often fail to cover these critical assets. Whether you hold valuable source code repositories, subscription models, or decentralized cryptographic wallets, planning for a safe and seamless handover of control is paramount to protect your legacy.
              </p>
              <p>
                <strong>Cipherwill</strong> resolves this challenge with an elegant zero-knowledge digital vault. Organised by end-to-end military-grade encryption, your private data can include credentials, files, and crypto seed phrases. If your inactivity timeline is triggered, access is automatically and securely delivered to your pre-selected beneficiaries.
              </p>
            </div>

            {/* Custom Dynamic Persona Data Sections - Clean typography flowing without boxes */}
            <div className="flex flex-col gap-12 mt-4">
              {persona.data.map((data, index) => (
                <section key={index} className="flex flex-col gap-6">
                  <h2 className="font-playfair text-2xl sm:text-3.5xl font-extrabold text-forest border-b border-forest/5 pb-3 leading-tight mt-4">
                    {data.header}
                  </h2>
                  <div className="flex flex-col gap-8">
                    {data.content &&
                      data.content.map((content, idx) => (
                        <div key={idx} className="flex flex-col gap-3">
                          {content.subheading && (
                            <h3 className="font-gilroy text-xl sm:text-2xl font-bold text-forest leading-snug">
                              {content.subheading}
                            </h3>
                          )}
                          <p className="font-gilroy text-base sm:text-lg text-forest/80 font-medium leading-relaxed whitespace-pre-line">
                            {content.text}
                          </p>
                        </div>
                      ))}
                  </div>
                </section>
              ))}
            </div>
          </article>

          {/* Sticky Sidebar Guide Panel (Institutional Rigor + Empathy) */}
          <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-28 self-start">
            <div className="border-l-4 border-clay px-6 py-6 bg-clay/5 border-y border-r border-forest/10 rounded-r-2xl shadow-xs flex flex-col gap-5">
              <span className="text-xs uppercase tracking-wider font-bold text-clay">
                Guide Panel
              </span>
              <h3 className="font-playfair text-xl font-bold text-forest leading-snug">
                Why Cipherwill?
              </h3>
              <p className="text-sm text-forest/80 font-medium leading-relaxed">
                Standard legal wills fail to cover digital assets, leaving passwords, codes, and wallets locked forever. Cipherwill bridges this gap with military-grade homomorphic encryption and a zero-knowledge dead man's switch.
              </p>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-forest/75">
                  <TbCircleCheck className="w-5 h-5 text-sage shrink-0" />
                  <span>End-to-End Encryption</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-forest/75">
                  <TbCircleCheck className="w-5 h-5 text-sage shrink-0" />
                  <span>Zero-Knowledge Vault</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-forest/75">
                  <TbCircleCheck className="w-5 h-5 text-sage shrink-0" />
                  <span>Automated Handover</span>
                </div>
              </div>
              <Link href="/app" className="w-full mt-2">
                <button className="w-full text-center hover:cursor-pointer font-bold transition-all border border-[#2A363B]/10 py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider bg-forest text-white hover:bg-forest/90 active:scale-[0.98] shadow-xs">
                  Create secure plan &rarr;
                </button>
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <CTA />
      <Footer />
    </div>
  );
}
