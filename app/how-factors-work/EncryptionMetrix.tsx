/*
 * EncryptionMetrix.tsx
 * What it does: Renders a beautifully redesigned, highly clean encryption status matrix table.
 * What it owns: Table structures, color-coded state indicators (Sage/Clay), and data representation.
 * What it does NOT do: It does not handle user authenticator settings or individual page scaffolds.
 */

"use client";

import { TbCircleCheck, TbCircleX } from "react-icons/tb";

const FactorNotAdded = (
  <div className="flex items-center gap-2 text-clay">
    <TbCircleX size={20} className="stroke-[2.5px]" />
    <span className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider">Unsecured</span>
  </div>
);

const FactorAdded = (
  <div className="flex items-center gap-2 text-sage">
    <TbCircleCheck size={20} className="stroke-[2.5px]" />
    <span className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider">Secured</span>
  </div>
);

const table_data = [
  {
    me: FactorNotAdded,
    ben: FactorNotAdded,
    status: "Data is completely unencrypted across both endpoints.",
    highlight: false,
  },
  {
    me: FactorAdded,
    ben: FactorNotAdded,
    status: "Data is securely encrypted for your vault, but remains unencrypted for your beneficiary's delivery pipeline.",
    highlight: false,
  },
  {
    me: FactorNotAdded,
    ben: FactorAdded,
    status: "Data is unencrypted for your primary access, but securely pre-encrypted for beneficiary delivery.",
    highlight: false,
  },
  {
    me: FactorAdded,
    ben: FactorAdded,
    status: "Full End-to-End Cryptographic Security. Maximum privacy and secure delivery unlocked for both endpoints.",
    highlight: true,
  },
];

export default function EncryptionMetrix() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col gap-3 py-8 text-center max-w-2xl mx-auto">
        <h2 className="font-playfair font-bold text-3xl sm:text-4xl text-forest">
          Encryption Status Matrix
        </h2>
        <p className="text-forest/70 font-medium text-sm sm:text-base leading-relaxed">
          The table below maps how your cryptographic protection scales depending on
          the security factors configured on both your account and your beneficiary's pipeline.
        </p>
      </div>

      <div className="border border-forest/10 rounded-2xl overflow-hidden bg-white shadow-level-1">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap table-fixed border-collapse">
            <thead>
              <tr className="bg-parchment/60 border-b border-forest/10 text-xs sm:text-sm text-forest/70 uppercase font-bold tracking-wider">
                <th scope="col" className="px-6 py-4 w-1/4">My Vault Node</th>
                <th scope="col" className="px-6 py-4 w-1/4">Beneficiary Node</th>
                <th scope="col" className="px-6 py-4 w-1/2">End-to-End Result</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-forest/5 font-medium">
              {table_data.map((data, index) => (
                <tr
                  className={`transition-colors duration-200 ${
                    data.highlight
                      ? "bg-sage/5 hover:bg-sage/10 font-semibold"
                      : "hover:bg-parchment/25"
                  }`}
                  key={index}
                >
                  <td className="px-6 py-5 align-middle">{data.me}</td>
                  <td className="px-6 py-5 align-middle">{data.ben}</td>
                  <td className="px-6 py-5 text-wrap leading-relaxed text-forest/80 align-middle">
                    {data.status}
                    {data.highlight && (
                      <span className="inline-block bg-sage text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ml-2 font-bold font-mono">
                        Recommended
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}