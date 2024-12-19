import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CTA from "@/components/public/CTA";

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
      <Header />
      <div className="mts-28 mbs-6 px-4 pt-28 pb-12 flex flex-col gap-2 items-center justify-center text-center bg-gradient-to-b from-sky-50 to-sky-100">
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
            <h2>Birthday Reminder</h2>
            <div className="py-2 px-4 text-sm rounded-full bg-sky-50">
              On your birthday
            </div>
          </div>
          <div>
            Every year on your birthday, we will send our wishes and a reminder
            to open Cipherwill and make any changes you have in mind. This is a
            mandatory event that must be completed within 3 days of your
            birthday so that we know you're alive and well. It's okay if you
            don't have any changes - just visit the Cipherwill dashboard once.
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-lg font-bold">
            <h2>First Reminder</h2>
            <div className="py-2 px-4 text-sm rounded-full bg-sky-50">
              After 3 Days of Your Birthday
            </div>
          </div>
          <div className="bg-slate-100 p-2 rounded-md font-semibold text-sm">
            We will only send this reminder if you haven't opened Cipherwill
            within 3 days of your birthday
          </div>
          <div>
            If you haven't opened Cipherwill within 3 days of your birthday, we
            will send this reminder to inform you that you need to access
            Cipherwill to avoid will execution event.
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-lg font-bold">
            <h2>Second Reminder</h2>
            <div className="py-2 px-4 text-sm rounded-full bg-sky-50">
              After 30 Days of Your Birthday
            </div>
          </div>
          <div className="bg-slate-100 p-2 rounded-md font-semibold text-sm">
            We will only send this reminder if you haven't opened Cipherwill
            within 30 days of your birthday
          </div>
          <div>
            If you haven't opened Cipherwill within 30 days of your birthday and
            27 days after the first reminder, we will send another reminder to
            warn you about the seriousness of your inaction.
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-lg font-bold">
            <h2>Third Reminder</h2>
            <div className="py-2 px-4 text-sm rounded-full bg-sky-50">
              After 90 Days of Your Birthday
            </div>
          </div>
          <div className="bg-slate-100 p-2 rounded-md font-semibold text-sm">
            We will only send this reminder if you haven't opened Cipherwill
            within 90 days of your birthday
          </div>
          <div>
            If you haven't opened Cipherwill within 90 days of your birthday and
            60 days after the second reminder, we'll send you another gentle
            nudge, just to make sure you're aware of how important this is.
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-lg font-bold">
            <h2>Will Execution</h2>
            <div className="py-2 px-4 text-sm rounded-full bg-sky-50">
              After 100 Days of Your Birthday
            </div>
          </div>
          <div>
            At this point, we will send you a message informing you that, since
            you did not respond to the previous 4 reminders from Cipherwill, the
            "time capsule" encryption keys have been released to your
            beneficiaries on their Cipherwill dashboard. We will also notify
            your beneficiaries that they now have access to a special dashboard
            for next 100 days containing the data you have uploaded for them.
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
