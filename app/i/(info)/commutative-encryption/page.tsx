import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CTA from "@/components/public/CTA";
import Link from "next/link";

const title = "Commutative Encryption - Cipherwill";
const description =
  "Learn about Cipherwill's Commutative Encryption, a secure encryption method enabling seamless data transfer while maintaining privacy through advanced cryptographic techniques.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/commutative-encryption`,
  },
};

export default function CommutativeEncryotionDetails() {
  return (
    <div>
      <Header />
      <div className="mts-28 mbs-6 px-4 pt-28 pb-12 flex flex-col gap-2 items-center justify-center text-center bg-gradient-to-b from-sky-50 to-sky-100">
        <div className="py-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Commutative Encryption Explained
          </h1>
          <p className="pt-8 max-w-md mx-auto font-medium">{description}</p>
        </div>
      </div>
      <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto p-4 font-medium">
        <div>
          This page breaks down commutative encryption, showing how its layered
          approach keeps your data extra secure.
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">
            Cipherwill's Implementation of Commutative Encryption
          </h2>
          <div className="border p-2 rounded-md bg-blue-50 text-blue-900 font-semibold">
            Cipherwill uses ordered commutative encryption to ensure that data
            cannot be decrypted without first using the beneficiary's private
            key.
          </div>
          <p>
            In Cipherwill’s system, commutative encryption involves encrypting
            data in multiple steps to ensure it remains secure. First, the user
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
          <h2 className="text-2xl font-bold">
            What is Commutative Encryption?
          </h2>
          <div className="border p-2 rounded-md bg-blue-50 text-blue-900 font-semibold">
            A commutative encryption is a kind of an encryption system that
            enables a plaintext to be encrypted more than once using different
            users' public keys.
          </div>
          <p>
            Commutative encryption is a cryptographic technique where the order
            in which encryption operations are applied doesn’t affect the final
            result. In simpler terms, you can encrypt data using multiple keys,
            and regardless of the sequence in which the keys are applied, the
            outcome will be the same. This is unlike traditional encryption,
            where the order of operations matters. Commutative encryption is
            particularly useful in situations where multiple parties need to
            apply their own encryption layers without needing to trust or share
            keys with each other.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">
            How Commutative Encryption Works?
          </h2>
          <p>
            Commutative encryption relies on the concept that the order of
            encryption steps doesn't change the final outcome. It allows
            multiple keys to encrypt the same piece of data in any sequence,
            without impacting its ability to be decrypted in reverse order. For
            example, if data is first encrypted with Key A and then Key B,
            decrypting it with Key B first and then Key A will yield the
            original data. This property is what makes commutative encryption
            unique and highly versatile in secure systems.
          </p>
        </div>
      </div>
      <CTA />
      <Footer />
    </div>
  );
}
