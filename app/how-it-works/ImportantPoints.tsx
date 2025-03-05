export default function ImportantPoints() {
  return (
    <section className="my-20 bg-primary-50/25 border-y border-l-primary-800/15">
      <div className="w-full max-w-7xl mx-auto px-4 py-20 text-lg">
        <h2 className="text-6xl font-bold py-12">Important facts</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li className="bg-white rounded-md border border-l-primary-800/15 p-4">
            <b>Public/Private Cryptography</b> <br />
            Cipherwill uses public/private key cryptography to ensure secure
            communication and data transfer between you and your beneficiaries.
          </li>
          <li className="bg-white rounded-md border border-l-primary-800/15 p-4">
            <b>AES Encryption</b>
            <br /> Data pods are encrypted using 256 AES encryption, providing
            robust security against unauthorized access.
          </li>
          <li className="bg-white rounded-md border border-l-primary-800/15 p-4">
            <b>Secure Key Exchange</b>
            <br /> A secure key exchange algorithm is used to create unique
            relationship key pairs for encryption, ensuring that keys are safely
            generated and distributed.
          </li>
          <li className="bg-white rounded-md border border-l-primary-800/15 p-4">
            <b>Elliptic Curve Cryptography</b>
            <br /> Relationship keys are encrypted using Elliptic Curve
            Cryptography (ECC), offering strong security with smaller key sizes.
          </li>
          <li className="bg-white rounded-md border border-l-primary-800/15 p-4">
            <b>Cascade Encryption</b> <br /> Cascade encryption is a
            multi-layered encryption method where data is encrypted sequentially
            using multiple keys or algorithms. Each layer adds an additional
            level of security, making it harder to decrypt without all required
            keys.
          </li>
          <li className="bg-white rounded-md border border-l-primary-800/15 p-4">
            <b>Security Factor Protection</b> <br /> If you and your
            beneficiaries have security factors enabled, it is impossible for
            anyone, including Cipherwill, to access or decrypt your data.
          </li>
        </ul>
      </div>
    </section>
  );
}
