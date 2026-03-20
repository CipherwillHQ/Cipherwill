import type { Metadata } from "next";
import Link from "next/link";
import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PolicyPageHeader from "@/components/public/i/PolicyPageHeader";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";

const title = "Cipherwill Review Board";
const description =
  "Learn how the Cipherwill Review Board oversees quality, risk controls, and policy integrity across editorial and trust-focused content.";
const canonical = `${FULL_HOSTNAME}/i/review-board`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Cipherwill Review Board",
    "content governance",
    "policy oversight",
    "risk and compliance review",
    "digital legacy standards",
    "trust and safety review",
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
  "@type": "WebPage",
  name: title,
  description,
  url: canonical,
  publisher: {
    "@type": "Organization",
    name: "Cipherwill",
    url: FULL_HOSTNAME,
  },
};

export default function ReviewBoardPage() {
  return (
    <div className="w-full">
      <SmoothPageScroll />
      <Header />
      <PolicyPageHeader title={`Review\nBoard`} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto py-10 text-justify p-4 font-medium text-lg">
        <div className="py-2">Last updated on March 20, 2026</div>

        <div>
          The Cipherwill Review Board provides governance oversight for
          high-impact content and policy decisions. The board exists to preserve
          trust, reduce risk, and ensure that what we publish aligns with our
          security posture, legal responsibilities, and user protection
          commitments.
        </div>

        <h2 className="pt-12 pb-4 font-semibold text-xl">
          1. Board Mandate
        </h2>
        <div>
          The Review Board evaluates materials that can materially affect user
          understanding, safety, or legal interpretation. This includes
          platform-wide policy documents, security claim language, sensitive
          operational notices, and content flagged for elevated risk.
        </div>

        <h2 className="pt-12 pb-4 font-semibold text-xl">
          2. Core Responsibilities
        </h2>
        <div>
          2.1 Quality Assurance: Confirm that high-impact documents are accurate
          and internally consistent.
          <br />
          <br />
          2.2 Risk Review: Identify ambiguity, overstatement, or omissions that
          could create user harm or compliance issues.
          <br />
          <br />
          2.3 Standards Alignment: Ensure content aligns with Cipherwill
          principles for privacy, cryptographic security, and transparency.
          <br />
          <br />
          2.4 Escalation Governance: Route unresolved concerns to relevant
          technical, legal, and operations stakeholders.
          <br />
          <br />
          2.5 Release Readiness: Approve, request revisions, or defer publication
          until risk is reduced to an acceptable level.
        </div>

        <h2 className="pt-12 pb-4 font-semibold text-xl">
          3. Review Triggers
        </h2>
        <div>
          Content is escalated to the board when one or more of the following
          are present:
          <br />
          <br />
          3.1 New or materially changed policy commitments.
          <br />
          3.2 Security disclosures, incident communication, or threat-model
          updates.
          <br />
          3.3 Claims involving regulatory interpretation or legal exposure.
          <br />
          3.4 High-traffic pages where inaccuracy could produce broad user
          impact.
          <br />
          3.5 Disputed editorial decisions that require governance arbitration.
        </div>

        <h2 className="pt-12 pb-4 font-semibold text-xl">
          4. Decision and Documentation Process
        </h2>
        <div>
          The board records decision rationale, required revisions, and final
          publication status for each escalated item. Decisions are tracked so
          future revisions can be assessed against prior risk assumptions and
          precedent. Where needed, update windows and owner assignments are
          defined before publication.
        </div>

        <h2 className="pt-12 pb-4 font-semibold text-xl">
          5. Accountability and Cadence
        </h2>
        <div>
          The board conducts periodic retrospective checks to confirm published
          guidance remains accurate as the product evolves. Urgent reviews are
          handled on priority, while routine governance checks follow a recurring
          review cadence aligned to product and policy changes.
        </div>

        <h2 className="pt-12 pb-4 font-semibold text-xl">
          6. Relationship with the Editorial Team
        </h2>
        <div>
          The Review Board does not replace editorial ownership; it strengthens
          it. The{" "}
          <Link href="/i/editorial-team" className="text-blue-700 hover:underline">
            Cipherwill Editorial Team
          </Link>{" "}
          owns drafting, clarity, and user readability, while the board enforces
          governance guardrails and adjudicates high-risk publication decisions.
        </div>

        <h2 className="pt-12 pb-4 font-semibold text-xl">7. Contact</h2>
        <div>
          For governance-related inquiries, policy concern escalation, or review
          requests, contact <b>support@cipherwill.com</b> with the subject line
          "Review Board".
        </div>
      </div>
      <Footer />
    </div>
  );
}
