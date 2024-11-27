import { FULL_HOSTNAME } from "@/common/constant";
import SimpleButton from "@/components/common/SimpleButton";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CTA from "@/components/public/CTA";
import FAQs from "@/components/public/FAQs";
import QuestionFeedback from "@/components/public/FAQs/QuestionFeedback";
import questions from "@/components/public/FAQs/questions";
import TopicsPanel from "@/components/public/FAQs/TopicsPanel";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export async function generateMetadata({
  params,
  searchParams,
}): Promise<Metadata> {
  const { slug } = params;
  const faq = questions.General.find((faq) => faq.slug === slug);
  if (!faq) return redirect("/i/frequently-asked-questions");
  const title = faq.title;
  const description =
    faq.description.substring(0, 150).split(" ").slice(0, -1).join(" ") + "...";
  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      images: ["/og-img.png"],
      url: `${FULL_HOSTNAME}/i/frequently-asked-questions/${slug}`,
    },
  };
}

export default function FAQPage({ params, searchParams }) {
  const slug = params.slug;
  const faq = questions.General.find((faq) => faq.slug === slug);
  if (!faq) return redirect("/i/frequently-asked-questions");

  return (
    <div className="w-full">
      <Header />
      <div className="flex items-center sm:flex-row flex-col p-4 gap-2 max-w-5xl mx-auto">
        <div className="mt-40 mb-20 w-full flex flex-col gap-4 max-w-7xl mx-auto p-2 text-lg">
          <h1 className="font-medium text-3xl pr-4">{faq.title}</h1>
          {faq.content}
          <QuestionFeedback question={faq.title} />
        </div>
        <TopicsPanel />
      </div>
      <CTA />

      <Footer />
    </div>
  );
}
