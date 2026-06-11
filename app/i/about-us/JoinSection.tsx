/**
 * JoinSection component for the Cipherwill About Us page.
 * Owns the user sign-up and career opportunity Call-to-Action blocks.
 * Does NOT own corporate mission statements or technical cryptographic definitions.
 */

"use client";

import Link from "next/link";
import { TbUserPlus, TbBriefcase } from "react-icons/tb";

export default function JoinSection() {
  return (
    <section className="bg-[#FBF9F1] py-24 sm:py-32 border-t border-[#2A363B]/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* User Sign-Up Card */}
          <div className="flex flex-col justify-between p-8 sm:p-12 rounded-2xl bg-[#F4F1EA] border border-[#2A363B]/10 group transition-all duration-300 hover:border-primary/20">
            <div className="flex flex-col gap-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <TbUserPlus size={24} />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-widest font-bold text-[#2A363B]/50">
                  Platform Membership
                </span>
                <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#2A363B] leading-tight">
                  Secure Your Legacy
                </h2>
              </div>
              <p className="text-base text-[#2A363B]/75 font-medium leading-relaxed">
                Ready to secure your digital legacy with absolute confidence? Join Cipherwill today and manage your online credentials, seed phrases, and files with effortless security and profound peace of mind.
              </p>
            </div>

            <div className="mt-10">
              <Link href="/app">
                <button className="hover:cursor-pointer inline-flex items-center gap-2 bg-[#003ecb] hover:bg-[#004eff] active:scale-[0.98] text-white font-semibold shadow-xs hover:shadow-md transition-all py-3 px-6 rounded-xl text-sm leading-none duration-200">
                  Get Started &rarr;
                </button>
              </Link>
            </div>
          </div>

          {/* Careers Card */}
          <div className="flex flex-col justify-between p-8 sm:p-12 rounded-2xl bg-[#F4F1EA] border border-[#2A363B]/10 group transition-all duration-300 hover:border-primary/20">
            <div className="flex flex-col gap-6">
              <div className="w-12 h-12 rounded-xl bg-[#2A363B]/10 flex items-center justify-center text-[#2A363B]">
                <TbBriefcase size={24} />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-widest font-bold text-[#2A363B]/50">
                  Open Positions
                </span>
                <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#2A363B] leading-tight">
                  Join Our Mission
                </h2>
              </div>
              <p className="text-base text-[#2A363B]/75 font-medium leading-relaxed">
                Interested in shaping the future of digital legacy protection? We seek passionate, precision-driven cybersecurity engineers, cryptography experts, and legal minds to build trustworthy infrastructure.
              </p>
            </div>

            <div className="mt-10">
              <Link href="/careers">
                <button className="hover:cursor-pointer inline-flex items-center gap-2 bg-white border border-[#2A363B]/20 hover:bg-neutral-50 hover:border-[#2A363B]/40 active:scale-[0.98] text-[#2A363B] font-semibold shadow-xs hover:shadow-sm transition-all py-3 px-6 rounded-xl text-sm leading-none duration-200">
                  View Job Openings &rarr;
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
