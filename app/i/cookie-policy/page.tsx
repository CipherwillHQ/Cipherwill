import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Link from "next/link";
// import CookieViewer from "./CookieViewer";
import PolicyPageHeader from "@/components/public/i/PolicyPageHeader";
import CookieManagerWrapper from "./CookieManagerWrapper";


const title = "Cookie Policy";
const description =
  "Learn how Cipherwill uses cookies to enhance your experience. Discover our cookie policy details and manage your preferences for a secure, personalized journey.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/cookie-policy`,
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="w-full">
      <Header />
      <PolicyPageHeader title={`Cookie\nPolicy`} />
      <div className="flex flex-col md:flex-row justify-center items-center gap-2 my-10 max-w-4xl mx-auto">
        <CookieManagerWrapper />
        {/* <CookieViewer /> */}
      </div>
      <div className="w-full max-w-4xl mx-auto my-10 p-4 font-medium text-lg">
        <p className="mb-6">
          At Cipherwill, we are committed to protecting your privacy and
          ensuring transparency about the data we collect. This Cookie Policy
          explains how and why we use cookies and similar technologies on our
          website.
        </p>

        <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
        <p className="mb-6">
          Cookies are small text files that are stored on your device (computer,
          tablet, or mobile) when you visit a website. They help the website
          recognize your device and remember information about your visit, such
          as your preferred language and other settings.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
        <ul className="list-disc pl-5">
          <li className="mb-4">
            <strong>Necessary Cookies:</strong> These cookies are necessary for
            the website to function properly. They allow you to navigate the
            site and use its features, such as accessing secure areas.
          </li>
          <li className="mb-4">
            <strong>Statistics Cookies:</strong> These cookies collect
            information about how visitors use our website, such as which pages
            are most popular. This data helps us improve the website's
            performance.
          </li>
          <li className="mb-4">
            <strong>Preferences Cookies:</strong> These cookies allow the
            website to remember choices you make (such as your username,
            language, or region) and provide enhanced, personalized features.
          </li>
          <li className="mb-4">
            <strong>Marketing Cookies:</strong> These cookies are used to
            deliver advertisements more relevant to you and your interests. They
            remember that you have visited our website and share this
            information with other organizations, such as advertisers.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
        <p className="mb-6">
          You can control and manage cookies in your browser settings. Please
          note that disabling cookies may affect the functionality of our
          website.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
        <p className="mb-6">
          We may update this Cookie Policy from time to time. Any changes will
          be posted on this page with an updated effective date.
        </p>

        <p className="">
          If you have any questions about our Cookie Policy, please{" "}
          <Link href={"/support"} className="text-blue-500 hover:text-blue-700">
            contact us
          </Link>
          .
        </p>
      </div>
      <Footer />
    </div>
  );
}
