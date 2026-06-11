/**
 * AboutHero component for the Cipherwill About Us page.
 * Owns the minimalist, editorial-archive style hero section, platform intro, and auxiliary resource index links.
 * Does NOT own the historical narrative, core mission statements, or technical encryption details.
 */

"use client";

import Link from "next/link";
import { IoIosHeart } from "react-icons/io";

export default function AboutHero() {
  return (
    <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 px-6 max-w-7xl mx-auto border-b border-[#2A363B]/10">
      <div className="flex flex-col gap-8 md:gap-12">
        {/* Archival Grand Title */}
        <h1 className="font-playfair text-5xl sm:text-7xl lg:text-8xl font-black text-[#2A363B] leading-none tracking-tight">
          about Cipherwill
        </h1>

        {/* Asymmetric Two-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mt-6">
          {/* Main Dossier Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <p className="text-xl sm:text-2xl text-[#2A363B]/90 font-medium leading-relaxed max-w-3xl">
              Learn about our mission to protect your legacy and ensure your wishes
              are honored, providing peace of mind for you and your loved ones. We build secure, permanent digital handoffs.
            </p>

            {/* Zetapad Organization Card */}
            <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-[#F4F1EA] border border-[#2A363B]/10 max-w-2xl mt-4">
              <div className="flex flex-col gap-2 justify-center">
                <h4 className="font-playfair text-xl font-bold text-[#2A363B] leading-snug">
                  Developed with <IoIosHeart className="text-red-600 inline-block align-middle mx-1 mb-0.5" /> by
                  <span className="block mt-1 text-[#2A363B]">Zetapad Technologies</span>
                </h4>
              </div>
              <div className="sm:border-l sm:border-[#2A363B]/10 sm:pl-6 flex flex-col justify-center gap-1">
                <p className="text-xs uppercase tracking-wider font-semibold text-[#2A363B]/50">
                  Operating Address
                </p>
                <p className="text-sm text-[#2A363B]/70 font-medium leading-relaxed">
                  13th Cross, Baldwins Road, Bengaluru, Karnataka, India 560030
                </p>
              </div>
            </div>
          </div>

          {/* Directory & Index Column */}
          <div className="lg:col-span-4 flex flex-col gap-3 p-6 rounded-2xl bg-[#F4F1EA]/50 border border-[#2A363B]/5">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#2A363B]/40 pb-2 border-b border-[#2A363B]/10">
              Platform Indexes
            </h3>
            <div className="flex flex-col gap-2 mt-2">
              <Link href="/" className="w-full">
                <button className="text-left w-full hover:cursor-pointer font-semibold shadow-xs hover:shadow-sm transition-all border border-[#2A363B]/10 py-2.5 px-4 rounded-xl text-sm bg-white hover:bg-neutral-50 active:scale-[0.98]">
                  Go back to website &rarr;
                </button>
              </Link>
              <Link href="/i/live-status" className="w-full">
                <button className="text-left w-full hover:cursor-pointer font-semibold shadow-xs hover:shadow-sm transition-all border border-[#2A363B]/10 py-2.5 px-4 rounded-xl text-sm bg-white hover:bg-neutral-50 active:scale-[0.98]">
                  Servers & Status &rarr;
                </button>
              </Link>
              <Link href="/i/third-party-processors" className="w-full">
                <button className="text-left w-full hover:cursor-pointer font-semibold shadow-xs hover:shadow-sm transition-all border border-[#2A363B]/10 py-2.5 px-4 rounded-xl text-sm bg-white hover:bg-neutral-50 active:scale-[0.98]">
                  Third Party Processors &rarr;
                </button>
              </Link>
              <Link href="/i/shard-switch" className="w-full">
                <button className="text-left w-full hover:cursor-pointer font-semibold shadow-xs hover:shadow-sm transition-all border border-[#2A363B]/10 py-2.5 px-4 rounded-xl text-sm bg-white hover:bg-neutral-50 active:scale-[0.98]">
                  Shard Switch &rarr;
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
