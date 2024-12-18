import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const title = "Shard Switch | Cipherwill";
const description =
  "Cipherwill's dead man's switch ensures the platform's continuity and security, activating safeguards if the company ever faces unexpected challenges.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/shard-switch`,
  },
};

export default function ShardSwitch() {
  return (
    <div>
      <Header />
      <section className="mt-20 py-20 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl md:text-7xl font-bold text-center">
            Shard Switch
          </h1>
          <p className="py-6 max-w-3xl text-center">{description}</p>
        </div>
        <div className="max-w-4xl mx-auto text-lg pt-20">
          Cipherwill&apos;s dead man&apos;s switch is a sophisticated failsafe
          designed to ensure the platform&apos;s continuity in the unlikely
          event of a company-wide disruption. This system operates using
          Shamir&apos;s Secret Sharing, a cryptographic method that divides a
          secret into multiple parts, requiring a threshold of these parts to
          reconstruct it. Cipherwill&apos;s secret is distributed among seven
          trusted keyholders, creating a decentralized mechanism that ensures no
          single person holds all the power, enhancing security and resilience.
          <br />
          <br />
          Each keyholder is responsible for their portion of the secret and must
          check in regularly—typically once a week—to confirm the
          platform&apos;s operational integrity. This routine check-in acts as a
          heartbeat for the system, verifying that Cipherwill is functioning as
          expected. If a predefined number of check-ins are missed or another
          activation trigger occurs, the dead man&apos;s switch engages. The
          keyholders then collaborate to combine their secret shares,
          reconstructing the critical information needed to activate the
          contingency protocols.
          <br />
          <br />
          This approach not only ensures Cipherwill&apos;s operations remain
          transparent and secure but also guarantees that user assets and
          information are never at risk, even under extreme circumstances. By
          leveraging a trusted team and cutting-edge cryptographic methods,
          Cipherwill underscores its commitment to protecting your digital
          legacy, no matter what challenges arise.
          <br />
          <br />
          <div className="border p-4 rounded-xl">
            <h2 className="font-semibold text-xl mb-4">Just a note</h2>
            Cipherwill&apos;s dead man&apos;s switch is also designed to evolve
            as the platform grows. In the future, we plan to include trusted
            members from our user community, as well as third-party service
            providers like Google Cloud, Azure, and AWS, as additional
            keyholders. This will further decentralize the system, ensuring that
            the responsibility of maintaining operational continuity is spread
            across both our community and industry-leading infrastructure
            partners. By incorporating these external stakeholders, we can
            further strengthen the platform&apos;s resilience, guaranteeing that
            Cipherwill remains functional and secure, even if challenges arise
            with the company itself. This collaborative approach ensures that
            our users&apos; legacies are protected and that services continue
            seamlessly without interruption.
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
