export default function TechnicalExplainer() {
  return (
    <div className="flex flex-col gap-2 font-medium max-w-4xl mx-auto px-4">
      <h2 className="text-xl font-bold py-4">
        A Detailed Overview
      </h2>
      <p>
        Cipherwill provides a secure and comprehensive platform for managing and
        transferring digital assets through encrypted digital wills. Here&apos;s a
        step-by-step breakdown of how it works, including the advanced
        encryption techniques used at each stage:
      </p>
      <h3 className="text-xl font-bold">Creating a Digital Will</h3>
      <ul className="list-disc list-inside">
        <li>
          <b>Profile Completion:</b> You begin by completing your profile on
          Cipherwill, which includes specifying the digital assets,
          beneficiaries, and preferences for data transfer. This information
          forms the foundation of your digital will.
        </li>
        <li>
          <b>Guiding the System:</b> Your digital will serves as a set of
          instructions for the Cipherwill system, dictating how and when your
          assets should be managed and transferred in the future.
        </li>
      </ul>
      <h3 className="text-xl font-bold">Scheduling Will Execution</h3>
      <ul className="list-disc list-inside">
        <li>
          <b>Execution Timing:</b> The schedule for executing your will is
          defined within the digital will itself. You can specify conditions and
          timelines for when your assets should be transferred, providing
          flexibility and control over the process.
        </li>
      </ul>
      <h3 className="text-xl font-bold">
        Security Factors and Encryption Keys
      </h3>
      <ul className="list-disc list-inside">
        <li>
          <b>Adding Security Factors:</b> You can enhance the security of your
          account by adding multiple security factors. Each security factor is
          represented by a public/private key pair, which is used to encrypt
          your data on your device.
        </li>
        <li>
          <b>Public/Private Key Cryptography:</b> The private key is used for
          encryption, while the public key is shared with your beneficiaries for
          secure data exchange. This ensures that only authorized parties can
          access and decrypt the data.
        </li>
      </ul>

      <h3 className="text-xl font-bold">
        End-to-End Encryption with Beneficiaries
      </h3>
      <ul className="list-disc list-inside">
        <li>
          <b>Creating Key Pairs:</b> Your security factors are combined with
          those of your beneficiaries to create additional secure private/public
          key pairs. This ensures that data transfer is end-to-end encrypted,
          preventing unauthorized access.
        </li>
        <li>
          <b>Key Sharing:</b> Your public key is shared with your beneficiaries,
          and their public keys are shared with you. These keys are used to
          encrypt the data and create additional transmission keys for secure
          data exchange.
        </li>
      </ul>
      <h3 className="text-xl font-bold">Data Pods and Encryption</h3>
      <ul className="list-disc list-inside">
        <li>
          <b>Data Pods:</b> When you add data to Cipherwill, it is stored in the
          system as a &quot;data pod.&quot; Each data pod is encrypted using a key
          associated with each of your security factors.
        </li>
        <li>
          <b>Multi-Layer Encryption:</b> The data pod is encrypted with every
          public key corresponding to your security factors. This allows you to
          access the data with any of your security factors in the future.
        </li>
        <li>
          <b>Beneficiary Keys:</b> When you add or update a data pod, additional
          keys are generated for you and your beneficiaries. These keys, derived
          from your and your beneficiaries&apos; public keys, are necessary for
          decrypting the data pod when required.
        </li>
      </ul>
      <h3 className="text-xl font-bold">Secure Storage and Key Distribution</h3>
      <ul className="list-disc list-inside">
        <li>
          <b>Uploading Keys:</b> The keys are uploaded to your account for
          future access and are also uploaded to your beneficiaries&apos; Cipherwill
          accounts, ensuring they can access the data when needed.
        </li>
        <li>
          <b>Ensuring Security:</b> At this stage, Cipherwill ensures that all
          data pods are end-to-end encrypted, and the multiple keys required to
          access the data are securely stored and transferred.
        </li>
      </ul>
      <h3 className="text-xl font-bold">Time Capsule Encryption</h3>
      <ul className="list-disc list-inside">
        <li>
          <b>Commutative Encryption:</b> Cipherwill uses commutative encryption
          to encrypt data pods again, creating a &quot;time capsule&quot; key. This key
          ensures that the data remains encrypted and inaccessible until a
          specified time.
        </li>
        <li>
          <b>Time Capsule Key Creation:</b> The time capsule key is created and
          securely stored by Cipherwill for each user-beneficiary pair, ensuring
          that the data can only be decrypted in the future.
        </li>
      </ul>
      <h3 className="text-xl font-bold">Will Execution and Data Access</h3>
      <ul className="list-disc list-inside">
        <li>
          <b>Dead Man&apos;s Switch:</b> If you fail to update your will within a
          predefined time (e.g., due to death), the will is executed, and the
          time capsule keys are released to your beneficiaries.
        </li>
        <li>
          <b>Beneficiary Notification:</b> Beneficiaries are notified through
          their Cipherwill accounts and gain access to a special dashboard where
          they can view and manage the data you have left for them.
        </li>
        <li>
          <b>Security Factor Access:</b> If your beneficiaries have security
          factors enabled, they must use them to access the encrypted data pod.
        </li>
      </ul>

      <h3 className="text-xl font-bold">Final Data Decryption and Access</h3>
      <ul className="list-disc list-inside">
        <li>
          <b>Decryption Process:</b> Beneficiaries can unlock the data pod using
          a combination of the time capsule key, their security factor key, and
          a beneficiary access key. This multi-layered approach ensures that the
          data is securely decrypted and accessible only to authorized parties.
        </li>
        <li>
          <b>Data Revocation and Deletion:</b> After a predefined period
          specified in your digital will, access to the data is revoked, and the
          data is permanently deleted from both your account and your
          beneficiaries&apos; accounts.
        </li>
      </ul>
      <h2 className="text-3xl font-bold ">Important Points to Remember</h2>
      <ol className="list-decimal list-inside">
        <li>
          <b>Public/Private Cryptography:</b> Cipherwill uses public/private key
          cryptography to ensure secure communication and data transfer between
          you and your beneficiaries.
        </li>
        <li>
          <b>AES Encryption:</b> Data pods are encrypted using 256 AES
          encryption, providing robust security against unauthorized access.
        </li>
        <li>
          <b>Secure Key Exchange:</b> A secure key exchange algorithm is used to
          create unique relationship key pairs for encryption, ensuring that
          keys are safely generated and distributed.
        </li>
        <li>
          <b>Elliptic Curve Cryptography:</b> Relationship keys are encrypted
          using Elliptic Curve Cryptography (ECC), offering strong security with
          smaller key sizes.
        </li>
        <li>
          <b>Commutative Encryption:</b> Time capsule keys are encrypted using
          Commutative encryption techniques, which allow data to remain
          encrypted even during re-encryption process.
        </li>
        {/* <li>
          <b>Zero Knowledge Encryption:</b> Cipherwill has developed its
          Homomorphic encryption using zero-knowledge encryption techniques and
          one-time pad encryption, ensuring that no sensitive information is
          exposed.
        </li>
        <li>
          <b>Future Encryption Proofing:</b> Cipherwill has incorporated
          Lattice-based Encryption to future-proof its encryption methods,
          making it resistant to potential future threats like quantum
          computing.
        </li> */}
        <li>
          <b>Security Factor Protection:</b> If you and your beneficiaries have
          security factors enabled, it is impossible for anyone, including
          Cipherwill, to access or decrypt your data.
        </li>
      </ol>
      <p>
        This comprehensive approach ensures that your digital assets are
        securely managed, encrypted, and transferred according to your wishes,
        with robust protection at every step.
      </p>
    </div>
  );
}
