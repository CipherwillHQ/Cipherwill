import Footer from "@/components/Footer";
import Header from "@/components/Header";
import EncryptionMetrix from "./EncryptionMetrix";
import CTA from "@/components/public/CTA";
import FAQs from "@/components/public/FAQs";
import { FULL_HOSTNAME } from "@/common/constant";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";

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
      <SmoothPageScroll />
      <Header />
      <div className="mts-28 mbs-6 px-4 pt-28 pb-12 flex flex-col gap-2 items-center justify-center text-center bg-linear-to-b from-sky-50 to-sky-100">
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
      <div className="w-full max-w-3xl mx-auto px-4 py-12 text-lg">
        <h2 className="font-bold text-lg py-4">What are Security Factors?</h2>
        <p className="text-justify font-medium">
          Security factors are ways to protect your data by encrypting and
          decrypting it, making sure only authorized people can access it. These
          factors keep your data safe by locking it, and only someone with the
          right keys can unlock it.
        </p>
        <h2 className="font-bold text-lg  py-4">
          How Security Factors are used to encrypt data?
        </h2>
        <p className="text-justify font-medium">
          Security factors help create special keys that are used to lock
          (encrypt) and unlock (decrypt) your data. They generate a random 32 or
          48 byte string seeds, and from that, we get two keys: a public key to
          lock your data and a private key to unlock it. These factors make sure
          your data stays safe and can only be accessed by the right person.
        </p>
        <h2 className="font-bold text-lg  py-4">
          Which Security Factors are supported?
        </h2>
        <p className="text-justify">
          We support several security factors to keep your data safe:
        </p>
        <ol className="list-decimal list-inside">
          <li>
            <span className="font-semibold">Master Password:</span> A simple but
            strong password that helps create keys for locking and unlocking
            your data.
          </li>
          <li>
            <span className="font-semibold">FIDO2 Keys:</span> A secure way to
            log in and protect your data without being tricked by fake sites.
          </li>
          <li>
            <span className="font-semibold">YubiKeys:</span> A small security
            device that gives you an extra layer of protection when logging in.
          </li>
          <li>
            <span className="font-semibold">
              Device Hardware Authentication (Passkeys):
            </span>{" "}
            Uses your phone or computer to create a secure key for easy and safe
            access.
          </li>
          <li>
            <span className="font-semibold">MetaMask (Crypto Wallet):</span> You
            can unlock your data using your MetaMask wallet, which keeps your
            crypto and data secure.
          </li>
        </ol>
      </div>
      <EncryptionMetrix />
      <CTA />
      <Footer />
    </div>
  );
}
