/**
 * EncryptionDetails component for the Cipherwill About Us page.
 * Owns the technical breakdown of the 5 key cryptographic layers securing user data.
 * Does NOT own the general story narrative or corporate organizational data.
 */

"use client";

import { TbLock, TbEyeOff, TbVector, TbKey, TbGrid3X3 } from "react-icons/tb";

const encryptionLayers = [
  {
    icon: <TbLock size={22} />,
    title: "256-bit AES Encryption",
    subtitle: "Symmetric Security",
    code: "AES-256-GCM",
    description: "The gold standard of symmetric encryption. Secures your digital will assets both at rest and in transit with unbreakable 256-bit keys, ensuring total isolation from unauthorized entities.",
  },
  {
    icon: <TbEyeOff size={22} />,
    title: "Zero Knowledge Architecture",
    subtitle: "Absolute Privacy",
    code: "ZKP-PROOF",
    description: "Your master credentials never leave your device. All data is encrypted locally before upload, meaning not even our core development team has the mathematical ability to access your digital keys.",
  },
  {
    icon: <TbVector size={22} />,
    title: "Elliptic Curve Cryptography",
    subtitle: "Asymmetric Handoff",
    code: "BLS12-381 / SECP256K1",
    description: "Leverages high-grade cryptographic curves to handle digital signatures, identity verification, and multi-factor key derivation with extreme security and mathematical proof.",
  },
  {
    icon: <TbKey size={22} />,
    title: "One-Time Pad Protocols",
    subtitle: "Information-Theoretic Security",
    code: "OTP-XOR-PROTOCOL",
    description: "Provides maximum security states by utilizing random, single-use keys of matching data length. This ensures individual encrypted structures are fundamentally mathematically unbreakable.",
  },
  {
    icon: <TbGrid3X3 size={22} />,
    title: "Lattice-Based Cryptography",
    subtitle: "Quantum-Resistant Shield",
    code: "CRYSTALS-KYBER",
    description: "Employs high-dimensional geometric lattice math to secure data keys. Built to resist future decryption efforts from quantum supercomputers and advanced adversarial attacks.",
  },
];

export default function EncryptionDetails() {
  return (
    <section className="bg-[#FBF9F1] py-16 sm:py-24 border-t border-[#2A363B]/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Block */}
        <div className="text-center flex flex-col gap-4 max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-primary">
            Cryptographic Sanctuary
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2A363B]">
            Commitment to Privacy & Security
          </h2>
          <p className="text-base text-[#2A363B]/70 font-medium leading-relaxed mt-2">
            Cipherwill's encryption is so robust that even our team cannot access
            or view your private data. This is achieved by combining five state-of-the-art cryptographic mechanisms.
          </p>
        </div>

        {/* Archival Certificate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {encryptionLayers.map((layer, index) => (
            <div
              key={index}
              className={`flex flex-col justify-between p-6 rounded-2xl bg-[#F4F1EA] border border-[#2A363B]/10 transition-all duration-300 hover:border-primary/30 hover:shadow-xs group ${
                index === 4 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="flex flex-col gap-4">
                {/* Certificate Stamp Header */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#2A363B]/10 flex items-center justify-center text-[#2A363B]/70 group-hover:text-primary transition-colors duration-300">
                    {layer.icon}
                  </div>
                  <span className="font-mono text-[10px] tracking-wider font-semibold bg-[#2A363B]/5 text-[#2A363B]/50 px-2 py-1 rounded">
                    {layer.code}
                  </span>
                </div>

                {/* Typography details */}
                <div className="mt-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-primary/70">
                    {layer.subtitle}
                  </span>
                  <h3 className="font-playfair text-xl font-bold text-[#2A363B] mt-0.5">
                    {layer.title}
                  </h3>
                </div>

                <p className="text-sm text-[#2A363B]/75 font-medium leading-relaxed mt-2">
                  {layer.description}
                </p>
              </div>

              {/* Security Seal line */}
              <div className="mt-6 pt-4 border-t border-[#2A363B]/5 flex items-center justify-between text-[10px] uppercase tracking-widest font-semibold text-[#2A363B]/40">
                <span>Certified Protocol</span>
                <span>Active Shield</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
