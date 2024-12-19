import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const title = "Shard Switch | Cipherwill";
const description =
  "Shard switch ensures the platform's continuity and security, activating safeguards if the company ever faces unexpected challenges.";

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
          <p>
            The Shard Switch is a robust failsafe mechanism designed to
            guarantee the continuity of Cipherwill's operations, even in
            the face of unforeseen disruptions. This system leverages{" "}
            <b>Shamir's Secret Sharing</b>, a cryptographic method that
            splits a secret into multiple parts. To reconstruct the original
            secret, a predefined threshold of these parts must be combined,
            creating a decentralized and secure framework.
          </p>

          <h2 className="py-8 font-bold text-xl">How It Works</h2>

          <p>
            To enhance security and resilience, Cipherwill's secret is
            distributed among <b>seven trusted keyholders</b>, ensuring no
            single individual has full control. Keyholders perform regular
            &quot;check-ins&quot; typically once a week - to confirm the platform's
            operational integrity. These check-ins act as a &quot;heartbeat&quot; for the
            system, verifying that everything is functioning as expected.
          </p>

          <p>
            If keyholders miss a predefined number of check-ins or if another
            activation trigger occurs, the system engages a{" "}
            <b>dead man's switch</b>. At this point, keyholders collaborate
            to combine their secret shares and reconstruct the critical
            information required to activate contingency protocols, ensuring
            uninterrupted platform functionality.
          </p>

          <h2 className="py-8 font-bold text-xl">Key Benefits</h2>
          <ul className="list-disc list-inside pb-4">
            <li>
              <b>Decentralized Security: </b> By dividing the secret among
              multiple keyholders, the system eliminates single points of
              failure.
            </li>
            <li>
              <b>Operational Continuity:</b> Regular check-ins and a dead
              man's switch ensure that Cipherwill remains functional under
              extreme circumstances.
            </li>
            <li>
              <b>User Assurance: </b> This approach builds users' trust in the
              system and shows Cipherwill's dedication to protecting digital
              legacies.
            </li>
          </ul>

          <h2 className="py-8 font-bold text-xl">Future Enhancements</h2>

          <p>
            As Cipherwill evolves, we plan to expand the Shard Switch mechanism
            to include:
          </p>
          <ul className="list-disc list-inside py-4">
            <li>
              <b>Community Keyholders: </b> Trusted members of our user
              community will take on keyholder roles, further decentralizing the
              system.
            </li>
            <li>
              <b>Third-Party Providers: </b> Industry-leading infrastructure
              partners like Google Cloud, Azure, and AWS will be integrated as
              additional keyholders (automated watchdog systems with backup
              deployments). These external stakeholders will enhance the
              platform's resilience by distributing responsibility across a
              broader network.
            </li>
          </ul>

          <p>
            This collaborative approach strengthens the system's security
            and guarantees operational continuity, even in scenarios where the
            company itself faces challenges.
          </p>

          <h2 className="py-8 font-bold text-xl">Addressing Potential Risks</h2>

          <p>
            While decentralizing keyholder roles adds resilience, it also
            introduces dependencies. To mitigate these risks:
          </p>

          <ul className="list-disc list-inside py-4">
            <li>
              All keyholders, internal and external adhere to strict security
              protocols and regular audits.
            </li>
            <li>
              The threshold for secret reconstruction ensures that operations
              remain secure even if some keyholders are unavailable.
            </li>
          </ul>

          <p>
            By combining cryptographic methods with a collaborative model,
            Cipherwill ensures that your digital legacy remains protected, no
            matter what challenges arise.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
