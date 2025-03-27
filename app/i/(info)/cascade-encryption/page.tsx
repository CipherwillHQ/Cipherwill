import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CTA from "@/components/public/CTA";
import Link from "next/link";

const title = "Cascade Encryption - Cipherwill";
const description =
  "Learn about Cipherwill's Cascade Encryption, a secure encryption method enabling seamless data transfer while maintaining privacy through advanced cryptographic techniques.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/cascade-encryption`,
  },
};

export default function CascadeEncryotionDetails() {
  return (
    <div>
      <Header />
      <div className="mts-28 mbs-6 px-4 pt-28 pb-12 flex flex-col gap-2 items-center justify-center text-center bg-linear-to-b from-sky-50 to-sky-100">
        <div className="py-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Cascade Encryption Explained
          </h1>
          <p className="pt-8 max-w-md mx-auto font-medium">{description}</p>
        </div>
      </div>
      <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto p-4 font-medium">
        <div>
          This page breaks down Cascade encryption, showing how its layered
          approach keeps your data extra secure.
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">
            Cipherwill's Implementation of Cascade Encryption
          </h2>
          <div className="border p-2 rounded-md bg-blue-50 text-blue-900 font-semibold">
            Cipherwill uses ordered cascade encryption to ensure that data
            cannot be decrypted without first using the beneficiary's private
            key.
          </div>
          <p>
            In Cipherwill's system, cascade encryption involves encrypting data
            in multiple steps to ensure it remains secure. First, the user
            encrypts their data with a time capsule key provided by Cipherwill.
            This key locks the data for future use, but it cannot be used to
            decrypt the information directly until another layer of encryption
            is removed.
            <br />
            <br />
            After applying the{" "}
            <Link
              href="/i/time-capsule-encryption"
              className="text-blue-700 hover:underline hover:text-blue-800"
            >
              time capsule encryption
            </Link>
            , the user encrypts the data again using the beneficiary's public
            key. This extra layer of security ensures that only the designated
            recipient, using their private key, can access the data. When the
            beneficiary wants to decrypt the data, they must first use their
            private key to remove the outer layer of encryption. Only after this
            step can the time capsule key be used to decrypt the inner layer and
            fully access the data.
            <br />
            <br />
            This process provides a high level of security because even if
            someone gets hold of the time capsule key, they can't decrypt the
            data without first having the beneficiary's private key. This
            layered approach makes it nearly impossible for unauthorized parties
            to access sensitive information.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">What is Cascade Encryption?</h2>
          <div className="border p-2 rounded-md bg-blue-50 text-blue-900 font-semibold">
            Cascade encryption is a method of securing data by applying multiple
            layers of encryption sequentially, often using different encryption
            keys or algorithms at each layer.
          </div>
          <p>
            Each layer in cascade encryption acts as an additional safeguard,
            ensuring that even if one layer is compromised, the remaining layers
            protect the data. This technique is particularly useful in scenarios
            requiring high levels of security, such as safeguarding sensitive
            digital assets or confidential communications. By combining
            different encryption algorithms or key structures, cascade
            encryption mitigates vulnerabilities associated with any single
            encryption method, offering robust and layered protection.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">How Cascade Encryption Works?</h2>
          <div>
            Cascade encryption works by encrypting data multiple times in
            sequential layers, each using a different encryption algorithm or
            key. This multi-layer approach enhances data security, ensuring that
            breaking one layer does not compromise the overall encryption.
            <ul className="list-disc list-inside mt-2">
              <li>
                First Layer Encryption: The data is encrypted using a specific
                algorithm and key.
              </li>
              <li>
                Subsequent Layers: The already-encrypted data is encrypted again
                with a new algorithm or key, repeating this process for as many
                layers as needed.
              </li>
              <li>
                Decryption Process: To decrypt the data, the layers are removed
                in reverse order, using the corresponding decryption keys for
                each layer.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <CTA />
      <Footer />
    </div>
  );
}
