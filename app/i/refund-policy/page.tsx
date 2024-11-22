import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import PolicyPageHeader from "@/components/public/i/PolicyPageHeader";

const title = "Refund Policy";
const description =
  "Read our refund policy to understand our money-back guarantee and how to request a refund. We strive to ensure your complete satisfaction with our service.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/refund-policy`,
  },
};

export default function RefundPolicy() {
  return (
    <div className="w-full">
      <Header />
      <PolicyPageHeader title={`Refund\nPolicy`} />
      <div className="max-w-4xl mx-auto py-10 text-justify p-4 font-medium text-lg">
        <div className="py-2">Effective Date : 20 May 2024</div>
        <div>
          <p>
            At Cipherwill, we strive to ensure your complete satisfaction with
            our service. However, we understand there may be rare cases where
            you are not fully satisfied and need to request a refund.
          </p>

          <h2 className="py-2 font-semibold">Refund Eligibility</h2>

          <p>
            If you are unsatisfied with the Cipherwill app for any reason, you
            may be eligible for a refund within 14 days of your initial
            purchase. Refunds are considered on a case-by-case basis. Please
            read all sections below to understand when you can request a
            Cipherwill refund.
          </p>

          <h3 className="py-2 font-semibold">Premium Subscriptions</h3>

          <p>
            For monthly, yearly, or lifetime premium subscriptions purchased in
            the Cipherwill iOS, Android, or web apps, full refunds may be
            provided if requested within 14 days of purchase. We will refund the
            entire subscription amount to your original payment method.
          </p>

          <h3 className="py-2 font-semibold">One-Time In-App Purchases</h3>

          <p>
            If you made a one-time, non-recurring purchase in the Cipherwill app
            for premium features or add-ons and are unsatisfied, you may receive
            a full refund if requested within 14 days. This includes purchases
            for things like custom themes, stickers, or enhanced exporting
            capabilities.
          </p>

          <h3 className="py-2 font-semibold">Free Version or Accounts</h3>

          <p>
            As the core Cipherwill app is provided free of charge, free user
            accounts or use of the free version are not eligible for refunds.
            Only paying users who purchased premium subscriptions or features
            are eligible.
          </p>

          <h2 className="py-2 font-semibold">
            How to Request a Cipherwill Refund
          </h2>

          <p>
            To request a refund from Cipherwill, please contact our Support Team
            by emailing support@cipherwill.com. Include your name, email address
            used for your account, and details of your purchase. We will
            investigate and respond with our refund decision within 5 business
            days.
          </p>

          <p>
            If we approve your request, refunds will be issued to your original
            payment method within 10 business days. Most refunds will go back to
            the payment used at checkout. If you used the App Store or Google
            Play billing system, refunds will go through those stores refund
            process.
          </p>

          <h2 className="py-2 font-semibold">Refund Denials & Appeals</h2>

          <p>
            Cipherwill reserves the right to deny any refund request, especially
            in cases of abuse or fraud. For example, refunds requests may be
            denied for:
          </p>

          <ul>
            <li>1. Attempting refunds for free accounts</li>
            <li>2. Requesting refunds past the 14-day refund period</li>
            <li>
              3. Violating any part of our{" "}
              <a href="/i/terms-of-service">Terms of Service</a>
            </li>
          </ul>
          <br />

          <p>
            If your refund is denied, we will notify you via email with an
            explanation. You may appeal the decision by emailing
            support@cipherwill.com. Appeals will be reviewed within 5 business
            days.
          </p>

          <p>
            We hope you enjoy using Cipherwill! Please email
            support@cipherwill.com if you have any other questions.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
