import Link from "next/link";
import questions from "./questions";
import ComeupTransition from "@/components/animated/transitions/ComeUp";
import SimpleButton from "@/components/common/SimpleButton";

export default function FAQs() {
  return (
    <ComeupTransition>
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="flex flex-col gap-4 sm:flex-row items-center justify-between py-20">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl md:text-4xl font-bold">
              Looking for answers?
            </h2>
            <div className="font-medium">
              Stuck on something? We've got you covered. Check out our
              frequently asked questions page.
            </div>
          </div>
          <Link
            href="/i/frequently-asked-questions"
            className="font-semibold text-center text-sm hidden md:block hover:underline hover:bg-grad"
          >
            View more
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {questions.Important.slice(0, 4).map((question, index) => (
            <div key={index} className="flex gap-2">
              <div className="border p-2 h-fit w-fit rounded-md text-xl">
                {question.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{question.title}</h3>
                <div className="font-medium py-2">{question.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="block relative
         bg-gradient-to-b from-white/5  via-white/75 via-30% to-white to-90% 
         px-2 py-12 text-center -mt-40 w-full max-w-7xl mx-auto"
      >
        <h2 className="text-3xl font-semibold pt-14 mb-8">
          Have more questions?
        </h2>
        <Link
          href={"/i/frequently-asked-questions"}
          className="border p-2 rounded-md font-bold hover:bg-black/5"
        >
          Look at more questions or ask your own
        </Link>
      </div>
    </ComeupTransition>
  );
}