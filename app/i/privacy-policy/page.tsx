import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import PolicyPageHeader from "@/components/public/i/PolicyPageHeader";
import Link from "next/link";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";

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
      <SmoothPageScroll />
      <Header />
      <PolicyPageHeader title={`Privacy\nPolicy`} />

      <div className="max-w-4xl mx-auto py-10 text-justify p-4 font-medium text-lg">
        <div className="py-2">Last updated on December 3, 2024</div>
        <br />
        <div>
          This Privacy Policy describes how Cipherwill ("we," "us," or "our")
          collects, uses, shares, discloses, manages and protects the personal
          information of individuals ("you" or "users") who utilize our digital
          estate planning services and will management platform. Protecting your
          privacy and the confidentiality of your personal information is of
          utmost importance to us. Please read this Privacy Policy carefully to
          understand how we handle your personal information.
        </div>
        <div className="py-12">
          <b className="py-4 text-red-900">
            Cipherwill cannot access or view encrypted data you store on the
            platform.
          </b>
          <div>
            All data referenced in this Privacy Policy, including personal data,
            collected data, and input data, does not include the information you
            store within your digital will on the platform. That data is
            classified as <b>Segment Data</b> and is encrypted (If you added
            Security Factors) on your device before being stored on Cipherwill.
            As a result, Cipherwill cannot access or view this data.
            <br />
            <br />
            This Privacy Policy specifically refers to information such as your
            name, email address, preferences, and account settings.
          </div>
        </div>
        <h2 className="py-4 font-semibold text-xl">
          1. Information We Collect
        </h2>
        <div>
          1.1 Personal Information: We may collect personal information that you
          provide directly to us when you use our services, create an account,
          or communicate with us. This may include your name, email address,
          phone number, postal address, and any other information you
          voluntarily provide.
          <br />
          <br />
          1.2 Financial Information: In order to facilitate payment processing
          for our services, we may collect and store financial information such
          as credit card details or other payment-related information. Please
          note that we do not store complete credit card numbers on our servers.
          We utilize a secure third-party payment processor that handles this
          information securely.
          <br />
          <br />
          1.3 Usage Information: When you use our website or services, we may
          automatically collect certain information about your interaction with
          our platform. This includes your IP address, device information,
          browser type, operating system, and usage patterns. We may also
          collect information about the pages you visit, the features you use,
          and the actions you take while using our platform.
        </div>
        <h2 className="pt-12 pb-4 font-semibold text-xl">
          2. Use of Information
        </h2>
        <div>
          2.1 Providing Services: We use the personal information you provide to
          deliver and improve our digital estate planning services and will
          management platform. This includes creating and managing your account,
          processing your requests, communicating with you, and personalizing
          your experience.
          <br />
          <br />
          2.2 Legal Compliance: We may use your information to comply with
          applicable laws, regulations, and legal processes. This includes
          responding to legal requests, enforcing our terms and policies, and
          protecting our rights, property, or safety, as well as the rights,
          property, or safety of our users and others.
          <br />
          <br />
          2.3 Marketing and Communication: With your consent, we may use your
          contact information to send you promotional materials, newsletters,
          and other communications about our services, special offers, or
          updates. You can opt out of these communications at any time by
          following the instructions provided in the communication or by
          contacting us directly.
        </div>
        <h2 className="pt-12 pb-4 font-semibold text-xl">
          3. Sharing of Information
        </h2>
        <div>
          3.1 Service Providers: We may share your personal information with
          trusted third-party service providers who assist us in operating our
          business, delivering our services, or conducting activities on our
          behalf. These service providers have access to your personal
          information only to perform the specific tasks assigned to them and
          are obligated to maintain its confidentiality.
          <br />
          <Link
            href={`/i/third-party-processors`}
            className="text-blue-700 hover:underline"
          >
            List of Third Party Service Providers
          </Link>
          <br />
          <br />
          3.2 Compliance with Laws: We may share your personal information when
          required to comply with applicable laws, regulations, legal processes,
          or governmental requests. We may also disclose your information to
          protect our rights, property, or safety, or the rights, property, or
          safety of others.
          <br />
          <br />
          3.3 Business Transfers: In the event of a merger, acquisition, or sale
          of assets, your personal information may be transferred to the
          acquiring entity or third party involved. We will notify you via email
          or prominent notice on our website before your personal information is
          transferred and becomes subject to a different privacy policy.
        </div>
        <h2 className="pt-12 pb-4 font-semibold text-xl">
          4. Data Disclosure{" "}
        </h2>
        <div>
          4.1 Legal Compliance: We may disclose your personal information if
          required to do so by law, regulation, legal process, or governmental
          request, ensuring compliance with legal obligations and protecting our
          legal rights.
          <br />
          <br />
          4.2 Security and Fraud Prevention: We may disclose information to
          prevent or investigate potential security breaches, fraud, or other
          violations of our terms of service to protect you, other users, and
          Cipherwill.
        </div>
        <h2 className="pt-12 pb-4 font-semibold text-xl">5. Data Security</h2>
        <div>
          5.1. Encryption: All personal data is encrypted both in transit and at
          rest using industry leading AES-256 encryption, ensuring your
          information is secure from unauthorized access.
          <br />
          <br />
          5.2. Access Controls: We implement strict access controls, allowing
          only authorized personnel to access your data. Multi-factor
          authentication (MFA) and role-based permissions are enforced to
          prevent unauthorized access.
          <br />
          <br />
          5.3. Regular Audits and Monitoring: Our systems are continuously
          monitored for any suspicious activity, and we conduct regular security
          audits to identify and address potential vulnerabilities.
          <br />
          <br />
          5.4. Data Anonymization: Where possible, we anonymize data to reduce
          the risk of exposure. Anonymized data is used for internal analytics
          and system improvements without compromising your privacy.
          <br />
          <br />
          5.5. Third-Party Security: Any third-party service providers we work
          with are vetted to ensure they meet our high security standards and
          comply with data protection laws.
          <br />
          <br />
          5.6. Incident Response: In the unlikely event of a data breach, we
          have a comprehensive incident response plan to contain the issue,
          notify affected users, and take corrective action promptly.
        </div>
        <h2 className="pt-12 pb-4 font-semibold text-xl">
          6. Your Choices and Rights
        </h2>
        <div>
          We believe in empowering you to control your personal information. You
          have the right to access, update, or delete your personal data at any
          time. You can also manage your communication preferences, opting in or
          out of certain notifications.
          <br />
          <br />
          If you wish to restrict or object to the processing of your data, or
          request data portability, you can contact our support team for
          assistance. We are committed to honoring your rights and providing
          transparency, ensuring you have full control over your information and
          how it is used.
        </div>
        <h2 className="pt-12 pb-4 font-semibold text-xl">7. Contact Us</h2>
        <div>
          If you have any questions, concerns, or requests regarding this
          Privacy Policy or the handling of your personal information, please
          contact us using the following information:
          <br />
          <b>Email: support@cipherwill.com</b>
          <br />
          We are committed to promptly addressing and resolving any issues or
          inquiries in compliance with applicable laws and regulations.
        </div>
        <h2 className="pt-12 pb-4 font-semibold text-xl">
          8. Changes to this Privacy Policy
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
