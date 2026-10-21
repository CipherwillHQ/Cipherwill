// Reassures visitors that preparing a digital legacy can protect their loved ones.
// Owns the solution message and its calm sage presentation.
// Does not execute transfers or manage beneficiaries.

import { TbShieldCheck } from "react-icons/tb";

export default function SolutionBanner() {
  return (
    <aside className="w-full p-5 sm:p-6 rounded-2xl bg-sage/10 border border-sage/30 text-cream">
      <div className="flex items-start sm:items-center gap-4">
        <div className="p-3 rounded-xl bg-sage/10 text-sage shrink-0">
          <TbShieldCheck aria-hidden="true" className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-gilroy font-bold text-base sm:text-lg">
            A little planning can change the outcome.
          </h3>
          <p className="font-gilroy font-medium text-sm text-cream/80 mt-2 leading-relaxed">
            Cipherwill helps you securely prepare the information and instructions
            your loved ones will need, so what matters stays within reach.
          </p>
        </div>
      </div>
    </aside>
  );
}
