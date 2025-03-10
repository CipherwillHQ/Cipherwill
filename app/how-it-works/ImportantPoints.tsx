import Image from "next/image";
import facts_bg from "./facts_bg.jpeg";

export default function ImportantPoints() {
  return (
    <section className="relative my-20 bg-primary-50/25 border-y border-l-primary-800/15">
      <Image
        src={facts_bg}
        alt="Facts background image"
        layout="fill"
        objectFit="cover"
        quality={50}
        placeholder="blur"
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/60"></div>

      <div className="w-full max-w-7xl mx-auto px-4 py-20 text-lg relative text-white">
        <h2 className="text-6xl font-bold py-12">Important facts</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <li className="bg-black/5 backdrop-blur-md rounded-xl p-6 border border-white/25">
            <b>Public/Private Cryptography</b> <br />
            Cipherwill uses public/private key cryptography to ensure secure
            communication and data transfer between you and your beneficiaries.
          </li>
          <li className="bg-black/5 backdrop-blur-md rounded-xl p-6 border border-white/25">
            <b>AES Encryption</b>
            <br /> Data pods are encrypted using 256 AES encryption, providing
            robust security against unauthorized access.
          </li>
          <li className="bg-black/5 backdrop-blur-md rounded-xl p-6 border border-white/25">
            <b>Secure Key Exchange</b>
            <br /> A secure key exchange algorithm is used to create unique
            relationship key pairs for encryption, ensuring that keys are safely
            generated and distributed.
          </li>
          <li className="bg-black/5 backdrop-blur-md rounded-xl p-6 border border-white/25">
            <b>Elliptic Curve Cryptography</b>
            <br /> Relationship keys are encrypted using Elliptic Curve
            Cryptography (ECC), offering strong security with smaller key sizes.
          </li>
          <li className="bg-black/5 backdrop-blur-md rounded-xl p-6 border border-white/25">
            <b>Cascade Encryption</b> <br /> Cascade encryption is a
            multi-layered encryption method where data is encrypted sequentially
            using multiple keys or algorithms. Each layer adds an additional
            level of security, making it harder to decrypt without all required
            keys.
          </li>
          <li className="bg-black/5 backdrop-blur-md rounded-xl p-6 border border-white/25">
            <b>Security Factor Protection</b> <br /> If you and your
            beneficiaries have security factors enabled, it is impossible for
            anyone, including Cipherwill, to access or decrypt your data.
          </li>
        </ul>
      </div>
    </section>
  );
}
