import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FULL_HOSTNAME } from "@/common/constant";
import ChecklistGenerator from "./ChecklistGenerator";

const baseUrl = FULL_HOSTNAME || "https://www.cipherwill.com";
const pagePath = "/tools/digital-asset-checklist-generator";

export const metadata: Metadata = {
  title: "Digital Asset Checklist Generator (Free) | Cipherwill",
  description:
    "Generate a personalized digital asset checklist in minutes. Track accounts, crypto, subscriptions, cloud files, and legacy instructions.",
  alternates: {
    canonical: `${baseUrl}${pagePath}`,
  },
  openGraph: {
    title: "Digital Asset Checklist Generator (Free) | Cipherwill",
    description:
      "Generate a personalized digital asset checklist in minutes. Track accounts, crypto, subscriptions, cloud files, and legacy instructions.",
    url: `${baseUrl}${pagePath}`,
    images: ["/og-img.png"],
  },
};

export default function DigitalAssetChecklistGeneratorPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a digital asset checklist?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A digital asset checklist is a structured list of online accounts, files, devices, and recovery details that helps your family or executor manage your digital life.",
        },
      },
      {
        "@type": "Question",
        name: "Can I include crypto and DeFi access details?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. This tool can add crypto-focused checklist items such as wallets, exchanges, seed phrase handling, and DeFi position mapping.",
        },
      },
      {
        "@type": "Question",
        name: "Is this checklist useful if I have no crypto?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The base checklist covers email, banking apps, subscriptions, cloud files, devices, and legacy instructions.",
        },
      },
    ],
  };

  return (
    <div className="w-full bg-white">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-8 md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Free Tool
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-zinc-900 md:text-5xl">
            Digital Asset Checklist Generator
          </h1>
          <p className="mt-4 max-w-3xl text-base text-zinc-700 md:text-lg">
            Build a complete digital legacy checklist for your accounts, files, and beneficiaries. Personalize it based on crypto, business, dependents, and creator workflows.
          </p>
        </section>

        <section className="mt-8">
          <ChecklistGenerator />
        </section>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}