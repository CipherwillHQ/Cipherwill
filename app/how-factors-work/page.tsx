import Footer from "@/components/Footer";
import Header from "@/components/Header";
import EncryptionMetrix from "./EncryptionMetrix";
import CTA from "@/components/public/CTA";
import FAQs from "@/components/public/FAQs";
import { FULL_HOSTNAME } from "@/common/constant";

const title = "How Security Factors work?";
const description =
  "Get a clear understanding of how Cipherwill's encryption works with various security factors, ensuring your digital assets are protected at every step.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/how-factors-work`,
  },
};

export default function HowFactorsWork() {
  return (
    <div>
      <Header />
      <div className="mts-28 mbs-6 px-4 pt-28 pb-12 flex flex-col gap-2 items-center justify-center text-center bg-gradient-to-b from-sky-50 to-sky-100">
        <div className="py-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Security Factors Explained
          </h1>
          <p className="mt-4 max-w-lg text-lg">
            Get a Clear Understanding of Cipherwill's Encryption Works with
            different security factors.
          </p>
        </div>
      </div>
      <div className="w-full max-w-3xl mx-auto px-4 py-12">
        <h2 className="font-bold text-lg">What are Security Factors?</h2>
        <p className="text-justify font-medium">
          Security factors are the keys used to both encrypt and decrypt your
          data, ensuring that only authorized access is possible. These factors
          act as safeguards, encrypting your data to protect it, and allowing
          decryption when you need to access it securely.
        </p>
        <h2 className="font-bold text-lg mt-4">
          How Security Factors are used to encrypt data?
        </h2>
        <p className="text-justify font-medium">
          Security Factors are the seeds used to derive public and private keys,
          which are essential for encrypting and decrypting your data.
          Basically, they generate a random 48-byte string, and from that, the
          public/private key pair is derived. The public key is used to encrypt
          the data, while the private key decrypts it. So, the Security Factors
          play a crucial role in making sure your data stays safe and can only
          be accessed by someone with the right keys.
        </p>
        <h2 className="font-bold text-lg mt-4">
          Which Security Factors are supported?
        </h2>
        <p className="text-justify font-medium">
          The main Security Factor we support is the &quot;Master Password.&quot; It's a
          simple but powerful password-based security feature. Your password,
          along with its hash, acts as the seed to derive both public and
          private keys. These keys are then used to securely encrypt and decrypt
          your data.
        </p>
      </div>
      <EncryptionMetrix />
      <FAQs />
      <CTA />
      <Footer />
    </div>
  );
}
