"use client";

import { useFeatureFlagEnabled } from "posthog-js/react";

export default function EncryptionDetails() {
  const flagEnabled = useFeatureFlagEnabled("show-encryption-details");
  if (!flagEnabled) return null;

  return (
    <>
      <h3 className="text-xl py-2 font-semibold mt-2">Advanced Encryption</h3>
      <div>
        Cipherwill employs a robust array of encryption techniques to ensure the
        utmost security of user data:
        <h4 className="mt-3 font-semibold">1. 256-bit AES Encryption:</h4>
        Widely recognized as one of the most secure encryption standards for
        protecting data at rest and in transit.
        <h4 className="mt-3 font-semibold">2. Zero Knowledge Proofs:</h4>
        Ensures that transactions and interactions can be verified without
        revealing any sensitive information, maintaining user privacy.
        <h4 className="mt-3 font-semibold">
          3. Elliptic Curve Cryptography (BLS12-381 & SECP256K1 Curves):
        </h4>
        Utilized for secure key generation, digital signatures, and
        cryptographic operations.
        <h4 className="mt-3 font-semibold">4. One Time Pad Encryption:</h4>
        Provides absolute security through the use of a random key that is as
        long as the message itself, ensuring each encryption is unique and
        unbreakable.
        <h4 className="mt-3 font-semibold">
          5. Lattice-based Encryption (CRYSTALS-KYBER):
        </h4>
        Utilizes mathematical structures to provide high levels of security
        against quantum computing threats and other advanced attacks.
        <br /> These encryption methods collectively ensure that
        Cipherwill&apos;s platform offers state-of-the-art protection,
        guaranteeing that user data remains confidential and secure at all
        times.
      </div>
    </>
  );
}
