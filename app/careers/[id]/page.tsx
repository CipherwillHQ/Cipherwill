/**
 * Public Job Details route (/careers/[id]).
 * Owns the specific job posting presentation, schema markup injection, and application CTAs.
 * Does NOT own the global navigation shell or the underlying static jobs list.
 */

import React from "react";
import { FULL_HOSTNAME } from "@/common/constant";
import jobs from "@/components/app/careers/jobs_data";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import { redirect } from "next/navigation";
import Script from "next/script";
import reactElementToJSXString from "react-element-to-jsx-string";
import { TbBuilding, TbMapPin, TbBriefcase, TbArrowLeft } from "react-icons/tb";

const title = "Careers | Cipherwill";
const description =
  "Join Cipherwill and help shape the future of digital legacy management. Be part of a passionate team creating secure, elegant solutions.";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const job = jobs.find((job) => job.id === id);
  if (!job) {
    return redirect("/careers");
  }
  return {
    title: `${job.title} - Careers | Cipherwill`,
    description: `Join Cipherwill as a ${job.title} in our ${job.division} division at ${job.location} (${job.level} level) and help us shape the future of digital legacy management.`,
    openGraph: {
      type: "website",
      title,
      description,
      images: ["/og-img.png"],
      url: `${FULL_HOSTNAME}/careers/${id}`,
    },
  };
}

export default async function JobDetails({ params }) {
  const { id } = await params;
  const job = jobs.find((job) => job.id === id);
  if (!job) {
    return redirect("/careers");
  }

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: reactElementToJSXString(job.about),
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "Cipherwill",
      sameAs: "https://www.cipherwill.com",
      logo: "https://media.cipherwill.com/hq/images/mkLkn23z_ur7AFekgITAL.png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: "The Estate, Sivanchetti Gardens",
        addressLocality: "Bangalore",
        addressRegion: "KA",
        postalCode: "560038",
        addressCountry: "IN",
      },
    },
  };

  return (
    <div className="w-full min-h-screen bg-cream text-forest font-gilroy flex flex-col">
      <Header />
      <Script
        id="job-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          
          {/* Back link */}
          <div>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-forest/70 hover:text-primary font-semibold text-sm transition-colors duration-200 active:scale-95"
            >
              <TbArrowLeft className="w-4 h-4" />
              Back to Open Positions
            </Link>
          </div>

          {/* Job Hero */}
          <div className="flex flex-col gap-6 pb-8 border-b border-default">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-forest/50">
              Job ID: {job.id.slice(0, 8).toUpperCase()}
            </span>
            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-forest">
              {job.title}
            </h1>
            
            {/* Meta Tags */}
            <div className="flex flex-wrap gap-4 sm:gap-6 text-sm sm:text-base font-semibold text-forest/80">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-parchment rounded-xl border border-default">
                <TbBuilding className="w-4 h-4 text-forest/50" />
                <span>{job.division}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-parchment rounded-xl border border-default">
                <TbMapPin className="w-4 h-4 text-forest/50" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-parchment rounded-xl border border-default">
                <TbBriefcase className="w-4 h-4 text-forest/50" />
                <span>{job.level} Level</span>
              </div>
            </div>

            {/* Top Apply Button */}
            <div className="pt-4">
              <Link
                href="https://tally.so/r/3E8ZBl"
                target="_blank"
                className="inline-block bg-gradient-to-r from-primary-700 to-primary hover:from-primary-800 hover:to-primary-600 text-white font-bold py-3.5 px-8 rounded-xl text-base shadow-sm hover:shadow-level-1 active:scale-[0.98] transition-all duration-200 ease-cw-ease"
              >
                Apply for this Role →
              </Link>
            </div>
          </div>

          {/* Job Content Layout */}
          <div className="grid grid-cols-1 gap-12 pt-4">
            
            {/* About Section */}
            <div className="flex flex-col gap-4">
              <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-forest">
                About the Job
              </h2>
              <div className="text-forest/80 font-medium text-base sm:text-lg leading-relaxed space-y-4">
                {job.about}
              </div>
            </div>

            {/* Qualifications Double-Card Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="p-6 sm:p-8 bg-parchment border border-default rounded-2xl flex flex-col gap-4">
                <h2 className="font-playfair text-xl sm:text-2xl font-bold text-forest">
                  Minimum Qualifications
                </h2>
                <ul className="flex flex-col gap-2.5 list-disc list-inside text-sm sm:text-base text-forest/80 font-medium">
                  {job.min_qualifications.map((qualification) => (
                    <li key={qualification} className="leading-relaxed pl-1">
                      {qualification}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 sm:p-8 bg-parchment border border-default rounded-2xl flex flex-col gap-4">
                <h2 className="font-playfair text-xl sm:text-2xl font-bold text-forest">
                  Preferred Qualifications
                </h2>
                <ul className="flex flex-col gap-2.5 list-disc list-inside text-sm sm:text-base text-forest/80 font-medium">
                  {job.preferred_qualifications.map((qualification) => (
                    <li key={qualification} className="leading-relaxed pl-1">
                      {qualification}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Responsibilities Section */}
            <div className="flex flex-col gap-4 pb-8 border-b border-default">
              <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-forest">
                Responsibilities
              </h2>
              <ul className="flex flex-col gap-3 list-disc list-inside text-base sm:text-lg text-forest/80 font-medium leading-relaxed">
                {job.responsibilities.map((responsibility) => (
                  <li key={responsibility} className="pl-1">
                    {responsibility}
                  </li>
                ))}
              </ul>
            </div>

            {/* Final Bottom Apply CTA */}
            <div className="text-center pt-6 flex flex-col gap-4 items-center">
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-forest">
                Ready to make a lasting impact?
              </h3>
              <p className="font-gilroy text-forest/60 text-sm sm:text-base max-w-md">
                If you are excited about building the future of digital permanence, we want to hear from you.
              </p>
              <div className="pt-2">
                <Link
                  href="https://tally.so/r/3E8ZBl"
                  target="_blank"
                  className="inline-block bg-gradient-to-r from-primary-700 to-primary hover:from-primary-800 hover:to-primary-600 text-white font-bold py-3.5 px-10 rounded-xl text-lg shadow-sm hover:shadow-level-1 active:scale-[0.98] transition-all duration-200 ease-cw-ease"
                >
                  Apply Now →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
