import { FULL_HOSTNAME } from "@/common/constant";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CTA from "@/components/public/CTA";
import Link from "next/link";

const title = "Cipherwill Execution Timeline";
const description =
  "Learn how Cipherwill securely executes your digital will upon predefined triggers, discover the steps involved from trigger to delivery.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/how-execution-timeline-works`,
  },
};

export default function WillExecutionTimeline() {
  return (
    <div>
      <SmoothPageScroll/>
      <Header />
      <div className="mts-28 mbs-6 px-4 pt-28 pb-12 flex flex-col gap-2 items-center justify-center text-center bg-linear-to-b from-sky-50 to-sky-100">
        <div className="py-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Cipherwill Execution Explained
          </h1>
          <p className="pt-8 max-w-md mx-auto font-medium">{description}</p>
        </div>
      </div>
      <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto p-4 font-medium">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-lg font-bold">
            <h2>Trigger</h2>
            <div className="py-2 px-4 text-sm rounded-full bg-sky-50">
              Default 3 Months
            </div>
          </div>
          <div className="bg-slate-100 p-2 rounded-md font-semibold text-sm">
            You can change this to weekly, monthly, quarterly, semi-annually or
            annually
          </div>
          <div>
            We check if you've logged in to Cipherwill within the trigger period
            you've selected (default 3 months). If you have not done any activity
            for the trigger period. we will start sending reminders and
            described below.
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-lg font-bold">
            <h2>First Reminder</h2>
            <div className="py-2 px-4 text-sm rounded-full bg-sky-50">
              After 3 Days
            </div>
          </div>
          <div className="bg-slate-100 p-2 rounded-md font-semibold text-sm">
            We will only send this reminder if you haven't opened Cipherwill
            within the trigger period you've selected.
          </div>
          <div>
            If you haven't opened Cipherwill within 3 days of your trigger, we
            will send this reminder to inform you that you need to access
            Cipherwill to avoid will execution event.
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-lg font-bold">
            <h2>Second Reminder</h2>
            <div className="py-2 px-4 text-sm rounded-full bg-sky-50">
              After 30 Days
            </div>
          </div>
          <div className="bg-slate-100 p-2 rounded-md font-semibold text-sm">
            We will only send this reminder if you haven't opened Cipherwill
            within 30 days of your trigger
          </div>
          <div>
            If you haven't opened Cipherwill within 30 days of your trigger and
            27 days after the first reminder, we will send another reminder to
            warn you about the seriousness of your inaction.
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-lg font-bold">
            <h2>Third Reminder</h2>
            <div className="py-2 px-4 text-sm rounded-full bg-sky-50">
              After 90 Days
            </div>
          </div>
          <div className="bg-slate-100 p-2 rounded-md font-semibold text-sm">
            We will only send this reminder if you haven't opened Cipherwill
            within 90 days of your trigger
          </div>
          <div>
            If you haven't opened Cipherwill within 90 days of your trigger and
            60 days after the second reminder, we'll send you another gentle
            nudge, just to make sure you're aware of how important this is.
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-lg font-bold">
            <h2>Will Execution</h2>
            <div className="py-2 px-4 text-sm rounded-full bg-sky-50">
              After 100 Days
            </div>
          </div>
          <div>
            At this point, we will send you a message informing you that, since
            you did not respond to the previous 3 reminders from Cipherwill, the{" "}
            <Link
              href={`/i/time-capsule-encryption`}
              className="text-blue-600 hover:underline"
            >
              "time capsule" encryption
            </Link>{" "}
            keys have been released to your beneficiaries on their Cipherwill
            dashboard. We will also notify your beneficiaries that they now have
            access to a special dashboard for next 100 days containing the data
            you have uploaded for them.
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-lg font-bold">
            <h2>Will Revocation & Account Deletion</h2>
            <div className="py-2 px-4 text-sm rounded-full bg-sky-50">
              After 100 Days of Your Will Execution
            </div>
          </div>
          <div>
            After 100 days of your will execution, we will send your
            beneficiaries a message informing them that your will has been
            revoked and that they will no longer have access to your data. We
            will also delete your account and all your data from blockchains,
            systems, and databases.
          </div>
        </div>
      </div>
      <CTA />
      <Footer />
    </div>
  );
}
