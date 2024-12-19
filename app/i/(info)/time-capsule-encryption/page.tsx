import { FULL_HOSTNAME } from "@/common/constant";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CTA from "@/components/public/CTA";
import Link from "next/link";

const title = "Time Capsule Encryption - Cipherwill";
const description =
  "Discover how Cipherwill's Time Capsule Encryption keeps your digital stuff safe, making sure it’s securely passed on to your loved ones with top-notch security.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/i/time-capsule-encryption`,
  },
};

export default function TimeCapsuleEncryption() {
  return (
    <div>
      <Header />
      <div className="mts-28 mbs-6 px-4 pt-28 pb-12 flex flex-col gap-2 items-center justify-center text-center bg-gradient-to-b from-sky-50 to-sky-100">
        <div className="py-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Details of Time Capsule Encryption
          </h1>
          <p className="pt-8 max-w-md mx-auto font-medium">{description}</p>
        </div>
      </div>
      <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto p-4 font-medium">
        <div>
          Timed-release encryption (TRE) is a two-factor encryption method that
          combines public key encryption with time-based controls. Decryption
          requires a special "trapdoor" key, which remains confidential until a
          specified time, managed by a secure time-server. At Cipherwill, we
          refer to this system as <b>"Time Capsule Encryption."</b>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">
            What is Time Capsule Encryption?
          </h2>
          <p>
            Time Capsule Encryption is an advanced security method that combines
            time-based controls with traditional encryption to safeguard
            sensitive data. It ensures that information remains encrypted and
            inaccessible until a pre-determined time, offering an extra layer of
            protection.
            <br />
            <br />
            The idea behind Time Capsule Encryption is to create a
            time-sensitive lock on the data. Even if someone has the necessary
            decryption keys, they won't be able to access the information until
            the appointed time, making it ideal for safeguarding valuable assets
            or sensitive information for future release.
            <br />
            <br />
            This encryption method is particularly useful for situations where
            data needs to be securely stored and only accessed at a specific
            moment. Whether for legal, personal, or business purposes, it
            provides peace of mind by ensuring that information is protected
            until the right time arrives.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">
            Why is it important for digital wills?
          </h2>
          <p>
            Time Capsule Encryption is crucial for digital wills because it
            ensures that sensitive information remains secure until it’s needed.
            With digital assets often containing personal, financial, and legal
            details, protecting this information from unauthorized access is
            essential for maintaining privacy and security.
            <br />
            <br />
            Moreover, this encryption method allows individuals to control when
            their beneficiaries can access their digital legacy. By setting a
            specific release time, users can ensure that their loved ones
            receive the information at the right moment, preventing premature
            access that could lead to complications.
            <br />
            <br />
            In the event of unexpected circumstances, Time Capsule Encryption
            guarantees that essential data is safeguarded until the appointed
            time. This feature not only protects against unauthorized access but
            also provides peace of mind, knowing that your digital will is
            secure and accessible only when intended.
          </p>
        </div>
        <div className="text-xl font-bold">
          How Time Capsule Encryption Works in Cipherwill's{" "}
          <Link
            href="/i/commutative-encryption"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            commutative encryption
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">
            How Cipherwill Determines the Duration of Encryption?
          </h2>
          <p>
            At Cipherwill, we encrypt time capsule keys for defined periods,
            typically 90 or 180 days. This initial duration ensures that your
            sensitive information remains secure during that time. After the
            period has elapsed, we automatically re-encrypt the keys for the
            same duration, maintaining the time based encryption.
            <br />
            <br />
            This process not only enhances security but also ensures that your
            information remains accessible for decryption when the{" "}
            <Link
              href="/i/how-execution-timeline-works"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              will execution process
            </Link>{" "}
            begins. By re-encrypting the keys, we strike a balance between
            safeguarding your digital assets and ensuring they are available
            when your beneficiaries need them most.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">
            First Layer: Encryption with Time Capsule Key
          </h2>
          <p>
            The first layer of security in Time Capsule Encryption involves
            encrypting your data with a unique time capsule key. This key acts
            as a protective barrier, ensuring that your sensitive information
            remains secure and inaccessible to anyone without the proper
            permissions.
            <br />
            <br />
            When you create a digital will, Cipherwill generates a time capsule
            key specifically for your data. This key encrypts the information,
            locking it away until the designated time arrives. By using this
            method, even if someone were to gain access to the encrypted data,
            they would not be able to read it without the corresponding time
            capsule key.
            <br />
            <br />
            The time capsule key remains confidential and is managed by
            Cipherwill's secure system, further enhancing the protection of your
            digital assets. This layer of encryption is crucial for safeguarding
            your information, providing you with peace of mind knowing that your
            data is secure until the right moment for release.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">
            Second Layer: Beneficiary's Public Key
          </h2>
          <p>
            The second layer of encryption adds an essential level of security
            by using the beneficiary's public key. Once your data is encrypted
            with the time capsule key, it undergoes a second encryption process
            where the beneficiary's unique public key is applied. This ensures
            that only the designated recipient can ultimately access the
            information.
            <br /> <br />
            By encrypting the data again with the beneficiary's public key, we
            create a highly secure environment that protects your digital assets
            from unauthorized access. Even if someone were to acquire the time
            capsule key, they would still be unable to decrypt the data without
            the beneficiary's private key, which is kept confidential.
            <br /> <br />
            This dual-layered approach not only enhances security but also
            ensures that the rightful heirs can access the information at the
            appropriate time. The combination of the time capsule key and the
            beneficiary's public key creates a robust framework for safeguarding
            your digital legacy, ensuring it remains secure until it's needed.
          </p>
          <div className="">
            Read more about{" "}
            <Link
              href="/i/commutative-encryption"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              commutative encryption in Cipherwill
            </Link>
          </div>
          {/* <div className="">
            Read more about{" "}
            <Link
              target="_blank"
              href="https://github.com/drand/tlock-js"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Time based encryption by drand
            </Link>{" "}
            &{" "}
            <Link
              target="_blank"
              href="https://timevault.drand.love/"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Live Demo
            </Link>
          </div> */}
        </div>
      </div>
      <CTA />
      <Footer />
    </div>
  );
}
