import type { Metadata } from "next";
import Link from "next/link";
import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PolicyPageHeader from "@/components/public/i/PolicyPageHeader";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";

const title = "Cipherwill Editorial Team";
const description =
  "Meet the Cipherwill Editorial Team and learn how we create clear, accurate, and trustworthy guidance on digital legacy, security, and estate readiness.";
const canonical = `${FULL_HOSTNAME}/i/editorial-team`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Cipherwill Editorial Team",
    "digital legacy editorial standards",
    "estate planning content",
    "security writing standards",
    "content governance",
    "fact checking process",
  ],
  alternates: {
    canonical,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: canonical,
    siteName: "Cipherwill",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-img.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: title,
  description,
  url: canonical,
  publisher: {
    "@type": "Organization",
    name: "Cipherwill",
    url: FULL_HOSTNAME,
  },
};

export default function EditorialTeamPage() {
  return (
    <div className="w-full">
      <SmoothPageScroll />
      <Header />
      <PolicyPageHeader title={`Editorial\nTeam`} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto py-10 text-justify p-4 font-medium text-lg">
        <div className="py-2">Last updated on March 20, 2026</div>

        <div>
          The Cipherwill Editorial Team is responsible for planning, drafting,
          and maintaining educational and policy-adjacent content across the
          platform. Our mission is simple: publish information that is precise,
          understandable, and respectful of the serious decisions users make
          when preparing digital legacy instructions for loved ones.
        </div>

        <h2 className="pt-12 pb-4 font-semibold text-xl">
          1. Scope of Editorial Work
        </h2>
        <div>
          We create and maintain product explainers, security guidance,
          onboarding articles, legal-policy summaries, and help center content.
          Every article is written with a user-first lens, including plain
          language definitions, context for high-stakes decisions, and links to
          related materials for deeper reading.
        </div>

        <h2 className="pt-12 pb-4 font-semibold text-xl">
          2. Editorial Principles
        </h2>
        <div>
          2.1 Accuracy First: We validate claims before publication and recheck
          time-sensitive information during updates.
          <br />
          <br />
          2.2 Clarity Over Complexity: We prefer direct language and practical
          examples over jargon.
          <br />
          <br />
          2.3 Security by Design: Content should never encourage unsafe handling
          of credentials, recovery phrases, or personal data.
          <br />
          <br />
          2.4 User Dignity: We write with empathy, especially in topics related
          to grief, succession, and family coordination.
          <br />
          <br />
          2.5 Transparency: Material corrections and policy-impacting revisions
          are documented with updated timestamps.
        </div>

        <h2 className="pt-12 pb-4 font-semibold text-xl">
          3. Editorial Workflow
        </h2>
        <div>
          3.1 Research and Briefing: Authors gather source material, product
          context, and audience intent.
          <br />
          <br />
          3.2 Drafting: Content is drafted to match Cipherwill voice, formatting
          patterns, and readability standards.
          <br />
          <br />
          3.3 Internal Verification: Facts, terminology, and product behavior
          are cross-checked with internal references and technical owners.
          <br />
          <br />
          3.4 Editorial Approval: A designated editor validates structure,
          claims, and consistency before release.
          <br />
          <br />
          3.5 Post-Publish Monitoring: We track user feedback and update
          low-clarity sections proactively.
        </div>

        <h2 className="pt-12 pb-4 font-semibold text-xl">
          4. Corrections and Updates
        </h2>
        <div>
          If we identify an error, we prioritize a correction as soon as
          practical. High-impact inaccuracies are fixed immediately, while
          non-critical improvements are bundled into the next scheduled update.
          For policy pages and operational notices, we maintain a clear "Last
          updated" timestamp so readers can verify recency.
        </div>

        <h2 className="pt-12 pb-4 font-semibold text-xl">
          5. Independence and Conflict Standards
        </h2>
        <div>
          The Editorial Team is expected to avoid conflicts that can undermine
          trust in our guidance. Team members do not accept incentives to shape
          recommendations, and any material relationship that could affect
          impartiality must be disclosed internally before publication.
        </div>

        <h2 className="pt-12 pb-4 font-semibold text-xl">
          6. Accessibility and Inclusive Writing
        </h2>
        <div>
          We structure content with clear headings, meaningful link text,
          readable paragraph lengths, and consistent terminology. Our goal is to
          support users across experience levels, devices, and reading contexts
          without compromising technical precision.
        </div>

        <h2 className="pt-12 pb-4 font-semibold text-xl">7. Contact</h2>
        <div>
          Questions, correction requests, or editorial feedback can be sent to
          <b> support@cipherwill.com</b>.
          <br />
          <br />
          For governance and oversight details, see the{" "}
          <Link href="/i/review-board" className="text-blue-700 hover:underline">
            Cipherwill Review Board
          </Link>{" "}
          page.
        </div>
      </div>
      <Footer />
    </div>
  );
}
