import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CTA from "@/components/public/CTA";
import AskAQuestion from "@/components/public/FAQs/AskAQuestion";
import questions_list from "@/components/public/FAQs/questions";
import ScrollToSec from "@/components/public/FAQs/ScrollToSec";
import TopicsPanel from "@/components/public/FAQs/TopicsPanel";
import Link from "next/link";
import { Suspense } from "react";
import { GoDotFill } from "react-icons/go";

const title = "Frequently Asked Questions";
const description =
  "Find answers to common questions about Cipherwill, including how it works, security measures, and account management. Get the information you need quickly and easily.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/frequently-asked-questions`,
  },
};

export default function FrequentlyAskedQuestions() {
  return (
    <div className="w-full">
      <Header />

      <Suspense fallback={<div></div>}>
        <ScrollToSec />
      </Suspense>
      <div className="bg-primary-100 py-20 px-4">
        <div className="max-w-7xl mx-auto h-[30vh] flex flex-col justify-center items-center">
          <h1 className="text-4xl font-semibold text-center">
            Frequently Asked Questions
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-5xl mx-auto py-20 px-4">
        <div className="w-full p-4 flex flex-col sm:flex-row items-center sm:items-start justify-between border rounded-xl">
          <h2 className="text-3xl md:text-4xl font-semibold py-4 px-2">
            We're here,
            <br />
            to answer your questions
          </h2>
          <div className="flex flex-1 w-full min-w-[300px] max-w-md">
            <AskAQuestion />
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-4 p-4 w-full">
          <div className="grid grid-cols-1 gap-8 w-full">
            {Object.keys(questions_list).map((category, index) => {
              return (
                <section key={index} className="flex flex-col gap-4">
                  <h2 id={`q:${category}`} className="text-lg font-bold">
                    {category} questions
                  </h2>
                  {questions_list[category].map((question, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <GoDotFill className="text-gray-400 text-xs" />
                      <div>
                        <Link
                          href={`/i/frequently-asked-questions/${question.slug}`}
                          className="text-primary hover:underline"
                        >
                          <h3 className="font-semibold">{question.title}</h3>
                        </Link>
                      </div>
                    </div>
                  ))}
                </section>
              );
            })}
          </div>
          <TopicsPanel />
        </div>
      </div>
      <CTA />

      <Footer />
    </div>
  );
}
