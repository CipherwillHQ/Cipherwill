/**
 * Competitor comparison dynamic route page.
 * Statically renders comparison pages comparing Cipherwill with selected competitors.
 * Does NOT own the data structure definitions or the individual section layouts.
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTA from "@/components/public/CTA";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";
import { competitorsData } from "./data";
import CompareHero from "./components/CompareHero";
import CompareGrid from "./components/CompareGrid";
import CompareTable from "./components/CompareTable";
import CompareFAQ from "./components/CompareFAQ";

interface ComparePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(competitorsData).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { slug } = await params;
  const competitor = competitorsData[slug];

  if (!competitor) {
    return {};
  }

  return {
    title: competitor.metaTitle,
    description: competitor.metaDescription,
    openGraph: {
      type: "website",
      title: competitor.metaTitle,
      description: competitor.metaDescription,
      images: ["/og-img.png"],
    },
  };
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { slug } = await params;
  const competitor = competitorsData[slug];

  if (!competitor) {
    notFound();
  }

  return (
    <div className="w-full bg-cream min-h-screen flex flex-col justify-between text-forest font-gilroy antialiased">
      <SmoothPageScroll />
      <Header />

      <main className="w-full flex-grow">
        <CompareHero competitor={competitor} />
        <CompareGrid competitor={competitor} />
        <CompareTable competitor={competitor} />
        <CompareFAQ competitor={competitor} />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
