/**
 * What it does: Renders a beautifully styled Trust Strip component with user rating, open source status, encryption, and audit validation.
 * What it owns: Presentational layout of the 4 primary security/trust proofs below the Hero on the landing page.
 * What it does NOT do: Does not manage complex app state or user sessions.
 */

import { TbBrandGithub, TbLock, TbShieldCheck } from "react-icons/tb";
import { BsStarFill, BsStarHalf } from "react-icons/bs";

export default function TrustStrip() {
  return (
    <div className="w-full bg-cream py-10 border-b border-forest/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Trust Heading */}
        <h2 className="text-center font-gilroy font-bold text-xs uppercase tracking-widest text-forest/50 mb-8">
          Trusted by individuals worldwide
        </h2>

        {/* 4-Column trust proof grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-center justify-center">
          
          {/* 1. Stars & User Rating */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="h-8 flex items-center justify-center">
              <div className="flex items-center gap-0.5 text-sage">
                <BsStarFill className="w-4 h-4" />
                <BsStarFill className="w-4 h-4" />
                <BsStarFill className="w-4 h-4" />
                <BsStarFill className="w-4 h-4" />
                <BsStarHalf className="w-4 h-4" />
              </div>
            </div>
            <p className="font-gilroy font-semibold text-sm text-forest">
              4.6/5 User Rating
            </p>
          </div>

          {/* 2. GitHub Logo & Open Source */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-1 rounded-full bg-sage/10 text-sage h-8 w-8 flex items-center justify-center">
              <TbBrandGithub className="w-6 h-6" />
            </div>
            <p className="font-gilroy font-semibold text-sm text-forest">
              Auditable Open-Source Code
            </p>
          </div>

          {/* 3. Lock & AES-256 */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-1 rounded-full bg-sage/10 text-sage h-8 w-8 flex items-center justify-center">
              <TbLock className="w-6 h-6" />
            </div>
            <p className="font-gilroy font-semibold text-sm text-forest">
              AES-256 End-to-End Encryption
            </p>
          </div>

          {/* 4. Shield & Audited */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-1 rounded-full bg-sage/10 text-sage h-8 w-8 flex items-center justify-center">
              <TbShieldCheck className="w-6 h-6" />
            </div>
            <p className="font-gilroy font-semibold text-sm text-forest">
              Independently Third-Party Audited
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
