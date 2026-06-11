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
      <Header />
      <Hero />
      <Footer />
    </div>
  );
}
