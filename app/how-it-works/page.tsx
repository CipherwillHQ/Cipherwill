import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CTA from "@/components/public/CTA";
import FAQs from "@/components/public/FAQs";
import Simple from "./Simple";
import OpenSourceSection from "./OpenSourceSection";
import Lifecycle from "./Lifecycle";
import Hero from "./Hero";
import ImportantPoints from "./ImportantPoints";

const title = "How it works";
const description =
  "Learn how we securely manages your digital assets. Our step-by-step guide explains the process of creating a digital will and ensuring your data is protected.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/how-it-works`,
  },
};

export default function HowItWorks() {
  return (
    <div className="w-full flex flex-col ">
      <Header
        expandedClassOverride="bg-white"
        nonExpandedClassOverride="text-white"
        nonExpandedLogo="white"
      />
      <Hero />
      <Simple />
      <OpenSourceSection />
      {/* <Lifecycle /> */}
      <ImportantPoints/>
      <FAQs />
      <CTA />
      <Footer />
    </div>
  );
}