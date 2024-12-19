import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CTA from "@/components/public/CTA";
import Link from "next/link";

const title = "Dead Man's Switch - Cipherwill";
const description =
  "Cipherwill is End-to-End Encrypted Dead Man's Switch, securely automating asset transfers to loved ones when you're gone, with advanced encryption and ease.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/dead-mans-switch`,
  },
};

export default function DeadMansSwitch() {
  return (
    <div>
      <Header />
      <div className="mts-28 mbs-6 px-4 pt-28 pb-12 flex flex-col gap-2 items-center justify-center text-center bg-gradient-to-b from-sky-50 to-sky-100">
        <div className="py-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Dead Man's Switch
          </h1>
          <p className="pt-8 max-w-md mx-auto font-medium">{description}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-3xl mx-auto p-4 font-medium">
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-2xl">What is a Dead Man's Switch?</h2>
          <p className="text-justify">
            A dead man's switch is basically a backup plan for when you're not
            around anymore. It makes sure that your important stuff, like bank
            accounts, passwords, or even digital assets, gets passed on to the
            right people automatically. In today's world, so much of our life is
            online, and without a way to share that info when you're gone, your
            loved ones could be left struggling. A dead man's switch like
            Cipherwill steps in when you can't, so your important things are
            taken care of and your family doesn't have to stress about it.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-2xl">How a Dead Man's Switch works?</h2>
          <p className="text-justify">
            A Dead Man's Switch is like your safety net for when you're no
            longer around. When you set up your Cipherwill account, you add all
            your important info, including your assets and wishes, just like
            filling out a form for your future. You then follow your{" "}
            <Link
              href="/i/how-execution-timeline-works"
              className="text-blue-700 hover:text-blue-900 underline"
            >
              Cipherwill execution schedule
            </Link>
            , You can set reminders to help you remember.
            <br />
            <br />
            If you forget to check in by the time you're supposed to, the Dead
            Man's Switch kicks in. This means that if something happens to you
            and you can't check in, the system knows to take action. Once
            activated, your loved ones automatically receive access to your
            important information and assets. It's like passing the baton to
            someone you trust.
            <br />
            <br />
            With this setup, you can enjoy peace of mind knowing that your
            wishes will be fulfilled even when you can't voice them yourself!
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-2xl">
            Importance of End-to-End Encryption
          </h2>
          <p className="text-justify">
            End-to-end encryption is the superhero of digital security, and it
            plays a crucial role in keeping your sensitive information safe.
            When you use Cipherwill, your data is encrypted from the moment you
            enter it until it's securely delivered to your chosen beneficiaries.
            This means that only you and the people you trust can access your
            information.
            <br />
            <br />
            Think of it this way: when you send a message, end-to-end encryption
            locks it in a secure vault that only the intended recipient can
            open. Even if someone intercepts the message along the way, they
            won't be able to read it without the special key. This keeps your
            assets, passwords, and personal wishes safe from prying eyes.
            <br />
            <br />
            In a world where data breaches and hacks are all too common,
            end-to-end encryption ensures that your information remains private
            and protected. It gives you peace of mind, knowing that your digital
            legacy is secure and that your loved ones will only access what you
            want them to see when the time comes. With Cipherwill, you can trust
            that your important data is guarded every step of the way!
            <br />
            <br />
            Check{" "}
            <Link
              className="text-blue-700 hover:text-blue-900 underline"
              href="/how-factors-work"
            >
              Encrytion Metrix
            </Link>{" "}
            to see how end-to-end encryption secures your data.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-2xl">How to use?</h2>
          <p className="text-justify">
            To store your data in Cipherwill and keep it updated each year,
            follow these steps: <br />
            <b>1. Sign up and log in:</b> Create your account on Cipherwill and
            log in to access your dashboard. <br />
            <b>2. Add important data:</b> Input key details like bank info,
            passwords, investments, digital assets, and any other data you want
            secured. <br />
            <b>3. Choose beneficiaries:</b> Select who should receive the data
            when you're no longer around. <br />
            <b>4. Set reminders:</b> Cipherwill will remind you to log in and
            update your data at least once a year to ensure everything stays
            current and secure. <br />
            <b>5. Update yearly:</b> Every year, review and update any changes
            to your information (like new accounts or passwords). <br />
            <br />
            This keeps your data active and ensures nothing gets lost. By
            updating yearly, you keep your data safe and ready to be passed on
            when needed.
          </p>
        </div>
      </div>
      <CTA />
      <Footer />
    </div>
  );
}
