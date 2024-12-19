import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import PolicyPageHeader from "@/components/public/i/PolicyPageHeader";

const title = "Terms of Service";
const description =
  "These terms govern your access to and use of the Cipherwill platform and services. By accessing or using our Services, you agree to be bound by these Terms.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/terms-of-service`,
  },
};

export default function TOS() {
  return (
    <div className="w-full">
      <Header />
      <PolicyPageHeader title={`Terms of\nService`} />
      <div className="max-w-4xl mx-auto py-10 text-justify p-4 font-medium text-lg">
        <div className="py-4">Last updated on December 3, 2024</div>
        <div>
          These Terms of Use (&quot;Terms&quot;) govern your access to and use
          of the CipherWill platform and services (&quot;Services&quot;). By
          accessing or using our Services, you agree to be bound by these Terms.
          If you do not agree to these Terms, please refrain from using our
          Services.
        </div>

        <h2 className="pt-12 pb-4 font-semibold">1. Eligibility</h2>
        <div>
          By using our Services, you represent and warrant that you meet these
          eligibility requirements.
          <ul className="list-disc list-inside">
            <li>
              You must have the legal capacity to enter into a binding contract.
            </li>
            <li>
              By using Cipherwill, you confirm that all information you provide
              is accurate, current, and complete.
            </li>
            <li>Use of Cipherwill is void where prohibited by law.</li>
            <li>
              You must not have previously been banned from using Cipherwill for
              any reason.
            </li>
            <li>
              You must comply with all applicable laws and regulations in your
              jurisdiction.
            </li>
            <li>
              Accessing Cipherwill from territories where its contents are
              illegal is prohibited.
            </li>
          </ul>
        </div>

        <h2 className="pt-12 pb-4 font-semibold">
          2. Account Creation and Security
        </h2>
        <div>
          2.1 Account Creation: In order to access certain features of our
          Services, you may be required to create an account. You agree to
          provide accurate, current, and complete information during the
          registration process. You are solely responsible for maintaining the
          confidentiality of your account credentials and for any activity that
          occurs under your account.
          <br />
          <br />
          2.2 Security: You are responsible for taking appropriate measures to
          secure your account and protect your login credentials. You agree not
          to share your account information with others or allow unauthorized
          access to your account. You must promptly notify us of any
          unauthorized use or suspected breach of security.
        </div>

        <h2 className="pt-12 pb-4 font-semibold">3. Use of Services</h2>
        <div>
          3.1 License: Subject to your compliance with these Terms, we grant you
          a limited, non-exclusive, non-transferable, and revocable license to
          access and use our Services for your personal and non-commercial
          purposes.
          <br />
          <br />
          3.2 Prohibited Conduct: You agree not to engage in any of the
          following prohibited activities:
          br
          <br />3.2.1{")"} Distributing, modifying, or using our open-source code
          for commercial purposes is strictly prohibited. The code may only be
          used for personal, non-commercial purposes, and may not be sold,
          redistributed, or altered for commercial gain.
          <br />3.2.2{")"} Violating any applicable laws, regulations, or
          third-party rights;
          <br />3.2.3{")"} Using our Services for any unlawful, fraudulent, or
          malicious purposes;
          <br />3.2.4{")"} Interfering with or disrupting the integrity, security,
          or performance of our Services;
          <br />3.2.5{")"} Accessing or attempting to access the accounts, systems,
          or networks of other users without authorization;
          <br />3.2.6{")"} Uploading, transmitting, or distributing any viruses,
          malware, or other harmful content;
          <br />3.2.7{")"} Engaging in any activity that could damage our reputation
          or the reputation of our Services.
          <br />
          <br />
          3.3 Content Ownership: You retain ownership of any content you submit,
          post, or transmit through our Services. However, by using our
          Services, you grant us a worldwide, royalty-free, sublicensable, and
          transferable license to use, reproduce, modify, adapt, publish,
          display, and distribute your content for the purposes of providing and
          promoting our Services.
        </div>
        <h2 className="pt-12 pb-4 font-semibold">
          4. Intellectual Property Rights
        </h2>
        <div>
          All intellectual property rights in our Services, including but not
          limited to copyrights, trademarks, and trade secrets, belong to
          CipherWill or our licensors. You agree not to reproduce, modify,
          distribute, or create derivative works based on our Services without
          our prior written permission.
        </div>

        <h2 className="pt-12 pb-4 font-semibold">5. Limitation of Liability</h2>
        <div>
          To the maximum extent permitted by applicable law, CipherWill and its
          affiliates, directors, officers, employees, agents, and licensors
          shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages arising out of or in connection
          with your use of our Services, even if we have been advised of the
          possibility of such damages.
        </div>

        <h2 className="pt-12 pb-4 font-semibold">6. Indemnification</h2>
        <div>
          You agree to indemnify and hold CipherWill and its affiliates,
          directors, officers, employees, agents, and licensors harmless from
          any claims, losses, damages, liabilities, costs, and expenses,
          including reasonable attorneys' fees, arising out of or in
          connection with your use of our Services, your violation of these
          Terms, or your violation of any rights.
        </div>
      </div>
      <Footer />
    </div>
  );
}
