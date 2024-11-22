import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import PolicyPageHeader from "@/components/public/i/PolicyPageHeader";

const title = "Privacy Policy";
const description =
  "Describes how we collects and protects the personal information of individuals. Protecting your privacy and the confidentiality is of utmost importance to us.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/privacy-policy`,
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="w-full">
      <Header />
      <PolicyPageHeader title={`Privacy\nPolicy`} />
      <div className="max-w-4xl mx-auto py-10 text-justify p-4 font-medium text-lg">
        <div className="py-2">Effective Date : 20 May 2023</div>
        <div>
          This Privacy Policy describes how CipherWill (&quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;) collects, uses, shares, and
          protects the personal information of individuals (&quot;you&quot; or
          &quot;users&quot;) who utilize our digital estate planning services
          and will management platform. Protecting your privacy and the
          confidentiality of your personal information is of utmost importance
          to us. Please read this Privacy Policy carefully to understand how we
          handle your personal information.
        </div>
        <h2 className="py-2 font-semibold">1. Information We Collect</h2>
        <div>
          1.1 Personal Information: We may collect personal information that you
          provide directly to us when you use our services, create an account,
          or communicate with us. This may include your name, email address,
          phone number, postal address, and any other information you
          voluntarily provide.
          <br />
          1.2 Financial Information: In order to facilitate payment processing
          for our services, we may collect and store financial information such
          as credit card details or other payment-related information. Please
          note that we do not store complete credit card numbers on our servers.
          We utilize a secure third-party payment processor that handles this
          information securely.
          <br />
          1.3 Usage Information: When you use our website or services, we may
          automatically collect certain information about your interaction with
          our platform. This includes your IP address, device information,
          browser type, operating system, and usage patterns. We may also
          collect information about the pages you visit, the features you use,
          and the actions you take while using our platform.
        </div>
        <h2 className="py-2 font-semibold">2. Use of Information</h2>
        <div>
          2.1 Providing Services: We use the personal information you provide to
          deliver and improve our digital estate planning services and will
          management platform. This includes creating and managing your account,
          processing your requests, communicating with you, and personalizing
          your experience.
          <br />
          2.2 Legal Compliance: We may use your information to comply with
          applicable laws, regulations, and legal processes. This includes
          responding to legal requests, enforcing our terms and policies, and
          protecting our rights, property, or safety, as well as the rights,
          property, or safety of our users and others.
          <br />
          2.3 Marketing and Communication: With your consent, we may use your
          contact information to send you promotional materials, newsletters,
          and other communications about our services, special offers, or
          updates. You can opt out of these communications at any time by
          following the instructions provided in the communication or by
          contacting us directly.
        </div>
        <h2 className="py-2 font-semibold">3. Sharing of Information</h2>
        <div>
          3.1 Service Providers: We may share your personal information with
          trusted third-party service providers who assist us in operating our
          business, delivering our services, or conducting activities on our
          behalf. These service providers have access to your personal
          information only to perform the specific tasks assigned to them and
          are obligated to maintain its confidentiality.
          <br />
          3.2 Compliance with Laws: We may share your personal information when
          required to comply with applicable laws, regulations, legal processes,
          or governmental requests. We may also disclose your information to
          protect our rights, property, or safety, or the rights, property, or
          safety of others.
          <br />
          3.3 Business Transfers: In the event of a merger, acquisition, or sale
          of assets, your personal information may be transferred to the
          acquiring entity or third party involved. We will notify you via email
          or prominent notice on our website before your personal information is
          transferred and becomes subject to a different privacy policy.
        </div>
        <h2 className="py-2 font-semibold">4. Data Security</h2>
        <div>
          We implement reasonable security measures to protect the
          confidentiality, integrity, and availability of your personal
          information. However, please note that no method of transmission over
          the internet or electronic storage is 100% secure. Therefore, while we
          strive to use commercially acceptable means to protect your personal
          information, we cannot guarantee its absolute security.
        </div>
        <h2 className="py-2 font-semibold">5. Your Choices and Rights</h2>
        <div>
          You have certain rights regarding your personal information, including
          the right to access, correct, or delete your information. You may also
          have the right to object to or restrict certain
        </div>
        <h2 className="py-2 font-semibold">6. Contact Us</h2>
        <div>
          If you have any questions, concerns, or requests regarding this
          Privacy Policy or the handling of your personal information, please
          contact us using the following information: <br /> Email:
          support@cipherwill.com <br /> We will make reasonable efforts to
          address and resolve any issues or inquiries promptly and in accordance
          with applicable laws and regulations.
        </div>
        <h2 className="py-2 font-semibold">
          7. Changes to this Privacy Policy
        </h2>
        <div>
          We may update this Privacy Policy from time to time to reflect changes
          in our practices or legal requirements. We encourage you to review
          this Privacy Policy periodically for any updates. We will notify you
          of any major material changes by posting the updated Privacy Policy on
          our website or by sending you a notification through your registered
          email address. Your continued use of our services after the effective
          date of any changes signifies your acceptance of the updated Privacy
          Policy. Please note that this Privacy Policy applies only to our
          services and does not cover the practices of third-party websites,
          platforms, or services that may be linked to or integrated with our
          platform. We encourage you to review the privacy policies of such
          third parties before providing any personal information to them.
        </div>
      </div>
      <Footer />
    </div>
  );
}
