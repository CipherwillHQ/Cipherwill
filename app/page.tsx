/**
 * Root/Home page for the Cipherwill application.
 * Renders the main public landing layout (Header, SmoothPageScroll, Hero, Footer).
 * It does not manage complex dynamic user state or internal application panels.
 */

import Header from "../components/Header";
import { Metadata } from "next";
import { FULL_HOSTNAME } from "@/common/constant";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";
import Hero from "@/components/public/landing/Hero";
import TrustStrip from "@/components/public/landing/TrustStrip";
import ProblemSection from "@/components/public/landing/ProblemSection";
import AlternativesFlaw from "@/components/public/landing/AlternativesFlaw";
import TrustArchitecture from "@/components/public/landing/TrustArchitecture";
import HowItWorks from "@/components/public/landing/HowItWorks";
import WhatCanYouSecure from "@/components/public/landing/WhatCanYouSecure";
import UserPersonaMatrix from "@/components/public/landing/UserPersonaMatrix";
import WhyNow from "@/components/public/landing/WhyNow";
import Pricing from "@/components/public/landing/Pricing";
import SocialProofAudits from "@/components/public/landing/SocialProofAudits";
import FAQs from "@/components/public/FAQs";
import CTA from "@/components/public/CTA";
import Footer from "@/components/Footer";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: any;
  searchParams: Promise<{ og_img?: string }>;
}): Promise<Metadata> {
  const { og_img } = await searchParams;
  let cover = "/og-img.png";
  if (og_img && og_img.startsWith("https://media.cipherwill.com")) {
    cover = og_img;
  }
  return {
    openGraph: {
      images: [cover],
      url: `${FULL_HOSTNAME}/`,
    },
  };
}

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      <SmoothPageScroll />
      {/* Header solves: How do I easily navigate this platform or log into my existing secure storage */}
      <Header />
      {/* Hero Section solves: What exactly is Cipherwill and why should I care within the next 5 seconds */}
      <Hero />
      {/* Trust strip small solves: Can I see instant validation that this platform is secure before I keep reading */}
      <TrustStrip />
      {/* The Problem Section solves: What actually happens to my digital life assets and memories if I pass away tomorrow */}
      <ProblemSection />
      {/* The Alternatives Flaw solves: Why can not I just use a traditional paper will or a standard password manager for this */}
      <AlternativesFlaw />
      {/* Trust Architecture solves: If I give you my most sensitive access keys how do I know you won t steal them or get hacked */}
      <TrustArchitecture />
      {/* How Cipherwill Works solves: How does the system verify I am actually gone without accidentally triggering a false alarm */}
      <HowItWorks />
      {/* What Can You Secure solves: What exactly am I allowed to put inside my Cipherwill secure storage */}
      <WhatCanYouSecure />
      {/* User Persona Matrix solves: Does this platform actually understand my specific life situation and asset types */}
      <UserPersonaMatrix />
      {/* Why Now solves: Why should I secure my digital legacy today instead of putting it off until next year */}
      <WhyNow />
      {/* Pricing solves: Which plan fits my asset size and how much does it cost to secure my digital legacy */}
      <Pricing />
      {/* Social Proof and Audits solves: Are real people and independent security experts actually trusting this platform */}
      <SocialProofAudits />
      {/* The FAQ Accordion solves: What about the tiny edge cases and what ifs that are still making me hesitate */}
      <FAQs />
      {/* Final Call to Action solves: How much time money and effort is it going to take me to secure my first asset right now */}
      <CTA />
      {/* Footer solves: Where can I find your open source repository company data and legal privacy terms */}
      <Footer />
    </div>
  );
}
