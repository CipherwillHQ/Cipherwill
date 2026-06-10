/**
 * Main public Careers page route (/careers).
 * Owns the high-level layout, page metadata, and core editorial structure.
 * Does NOT own individual section logic, filtering algorithms, or job cards.
 */

import React from "react";
import { FULL_HOSTNAME } from "@/common/constant";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import jobs from "@/components/app/careers/jobs_data";
import CareersHero from "@/components/public/careers/CareersHero";
import CareersPillars from "@/components/public/careers/CareersPillars";
import JobsFilterList from "@/components/public/careers/JobsFilterList";

const title = "Careers | Cipherwill";
const description =
  "Join Cipherwill and help shape the future of digital legacy management. Be part of a passionate team creating secure, elegant solutions for transferring digital assets to loved ones.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/careers`,
  },
};

export default function Careers() {
  return (
    <div className="w-full min-h-screen bg-cream text-forest font-gilroy flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Section 1: Hero Section (Light Warm Cream bg-cream) */}
        <CareersHero />

        {/* Section 2: Core Philosophy Pillars (Dark Forest Slate bg-forest) */}
        <CareersPillars />

        {/* Section 3: Open Positions list with interactive filtering (Light Warm Cream bg-cream) */}
        <JobsFilterList jobs={jobs} />
      </main>

      <Footer />
    </div>
  );
}
