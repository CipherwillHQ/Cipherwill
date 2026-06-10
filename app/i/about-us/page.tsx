/**
 * AboutUs Page Component for Cipherwill.
 * Owns the main container, layout orchestrations, metadata config, and smooth page scrolling triggers.
 * Does NOT own the independent component logic of each specific section.
 */

import { FULL_HOSTNAME } from "@/common/constant";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";
import AboutHero from "./AboutHero";
import StorySection from "./StorySection";
import MissionVision from "./MissionVision";
import EncryptionDetails from "./EncryptionDetails";
import ValuesSection from "./ValuesSection";
import JoinSection from "./JoinSection";

const title = "About us";
const description =
  "Learn about our mission to protect your legacy with our encrypted platform. Manage and transfer digital assets effortlessly, ensuring your wishes are honored.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/about-us`,
  },
};

export default function AboutUs() {
  return (
    <div className="w-full bg-[#FBF9F1] min-h-screen flex flex-col justify-between">
      <SmoothPageScroll />
      
      {/* Global Public Navigation Header */}
      <Header />

      <main className="w-full flex-grow">
        {/* Hero Section */}
        <AboutHero />

        {/* Founding Genesis Narrative Section (Dark Mode alternating block) */}
        <StorySection />

        {/* Core Directives & Vision Section */}
        <MissionVision />

        {/* Cryptographic Security Details Section */}
        <EncryptionDetails />

        {/* Brand Core Values Grid Section */}
        <ValuesSection />

        {/* Community & Careers CTA Section */}
        <JoinSection />
      </main>

      {/* Global Public Footer */}
      <Footer />
    </div>
  );
}
