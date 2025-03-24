import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import CTA from "@/components/public/CTA";
import SimplePricing from "@/components/pricing/SimplePricing";
import FAQs from "@/components/public/FAQs";
import { PaymentGatewayProvider } from "@/contexts/PaymentGatewayContext";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";

const title = "Pricing";
const description =
  "Explore Cipherwill's pricing plans for secure digital estate planning. Choose the plan that best fits your needs and protect your digital legacy today.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/pricing`,
  },
};

export default function Pricing() {
  return (
    <div className="w-full">
      <SmoothPageScroll/>
      <Header />
      <div className="mt-40 mb-6 p-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          Choose a plan that works for you
        </h1>
        <div className="p-4 text-center text-xl font-semibold">
          Try it for free, no credit card required.
        </div>

        <p className="max-w-xl mx-auto py-2 text-center sm:text-lg font-medium dark:font-normal">
          Cipherwill offers a range of plans to suit your needs. Choose the plan
          that best fits your requirements and protect your digital legacy
          today.
        </p>
      </div>

      <SimplePricing />
      <PaymentGatewayProvider>
        <div className="hidden">Payment Gateway Integrated</div>
      </PaymentGatewayProvider>

      {/* Dynamic pricing with country selector */}
      {/* <PricingTable /> */}
      <FAQs />
      <CTA />
      <Footer />
    </div>
  );
}
