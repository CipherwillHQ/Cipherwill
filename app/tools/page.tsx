import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Metadata } from "next";
import { FULL_HOSTNAME } from "@/common/constant";

const baseUrl = FULL_HOSTNAME || "https://www.cipherwill.com";

export const metadata: Metadata = {
  title: "Free Digital Legacy Tools | Cipherwill",
  description:
    "Use free digital legacy planning tools from Cipherwill. Start with our Digital Asset Checklist Generator.",
  alternates: {
    canonical: `${baseUrl}/tools`,
  },
  openGraph: {
    title: "Free Digital Legacy Tools | Cipherwill",
    description:
      "Use free digital legacy planning tools from Cipherwill. Start with our Digital Asset Checklist Generator.",
    url: `${baseUrl}/tools`,
    images: ["/og-img.png"],
  },
};

export default function ToolsHomePage() {
  return (
    <div className="w-full bg-white">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-slate-50 via-white to-cyan-50 p-8 md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Free Tools
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-zinc-900 md:text-5xl">
            Practical tools to organize your digital legacy
          </h1>
          <p className="mt-4 max-w-3xl text-base text-zinc-700 md:text-lg">
            Use these free tools to map accounts, reduce missed assets, and make life easier for your loved ones.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-zinc-200 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">
              Checklist Tool
            </p>
            <h2 className="mt-4 text-2xl font-bold text-zinc-900">
              Digital Asset Checklist Generator
            </h2>
            <p className="mt-3 text-zinc-700">
              Build a personalized checklist for crypto, subscriptions, social accounts, cloud storage, and more.
            </p>
            <Link
              href="/tools/digital-asset-checklist-generator"
              className="mt-6 inline-flex items-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
              Open Tool
            </Link>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}