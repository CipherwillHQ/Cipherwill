import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CTA from "@/components/public/CTA";
import FAQs from "@/components/public/FAQs";
import Explainer from "@/components/public/how-it-works/Explainer";
import Link from "next/link";

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
      <Header />
      <div className="mt-40 p-4 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-center font-playfair italic whitespace-pre-line">
          See How It’s Done
        </h1>

        <p className="max-w-xl mx-auto py-4 text-center  sm:text-lg font-medium dark:font-normal">
          Let understand how to put your digital legacy on autopilot with
          encryption, so when the time comes, your data is delivered to your
          loved ones.
        </p>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 text-center gap-2">
        <Link href={"/i/how-execution-timeline-works"}>
          <div className="bg-orange-50 hover:bg-orange-100 rounded-md p-4">
            <div className="font-semibold text-lg">Will Execution</div>
            <div className="text-sm">
              How Cipherwill securely executes your digital will upon predefined
              triggers
            </div>
          </div>
        </Link>
        <Link href={"/how-factors-work"}>
          <div className=" bg-orange-50 hover:bg-orange-100 rounded-md p-4">
            <div className="font-semibold text-lg">Security Factors</div>
            <div className="text-sm">
              These factors act as safeguards, encrypting your data to protect
              it
            </div>
          </div>
        </Link>
        <Link href={"/i/cascade-encryption"}>
          <div className="bg-orange-50 hover:bg-orange-100 rounded-md p-4">
            <div className="font-semibold text-lg">Encryption Layers</div>
            <div className="text-sm">
              Breaks down implementation of Cascade Encryption
            </div>
          </div>
        </Link>
        <Link href={"/i/time-capsule-encryption"}>
          <div className="bg-orange-50 hover:bg-orange-100 rounded-md p-4">
            <div className="font-semibold text-lg">Time Capsule Encryption</div>
            <div className="text-sm">
              Understand Time Based Encryption used in Cipherwill
            </div>
          </div>
        </Link>
      </div>
      <Explainer />
      {/* <section className="my-10">
        <InfoSection />
      </section> */}
      <FAQs />
      <CTA />
      <Footer />
    </div>
  );
}
