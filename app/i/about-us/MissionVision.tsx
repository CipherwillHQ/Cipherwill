/**
 * MissionVision component for the Cipherwill About Us page.
 * Owns the Light Mode presentation of Cipherwill's Mission and Vision statements.
 * Does NOT own the historical genesis story or the technical details of encryption.
 */

"use client";

import { TbCompass, TbEye } from "react-icons/tb";

export default function MissionVision() {
  return (
    <section className="bg-[#FBF9F1] py-24 sm:py-32 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        {/* Mission Card (Left Column) */}
        <div className="lg:col-span-6 flex flex-col justify-between p-8 sm:p-10 rounded-2xl bg-[#F4F1EA] border border-[#2A363B]/10 transition-colors duration-300">
          <div className="flex flex-col gap-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <TbCompass size={24} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#2A363B]/50">
                Core Directive
              </span>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#2A363B] mt-1">
                Our Mission
              </h2>
            </div>
            <p className="text-lg text-[#2A363B]/80 font-medium leading-relaxed italic border-l-2 border-primary/20 pl-4 my-2">
              "To provide a secure, user-friendly platform that empowers individuals to manage and transfer their digital assets with confidence and peace of mind."
            </p>
            <p className="text-base text-[#2A363B]/75 font-medium leading-relaxed">
              We leverage advanced encryption technologies to protect your valuable information, making it easily accessible only to your chosen beneficiaries. We strive to offer a seamless experience where users can organize their assets, set up personalized plans, and specify their wishes in a legally sound manner.
            </p>
          </div>
        </div>

        {/* Vision Card (Right Column) */}
        <div className="lg:col-span-6 flex flex-col justify-between p-8 sm:p-10 rounded-2xl bg-[#F4F1EA] border border-[#2A363B]/10 transition-colors duration-300">
          <div className="flex flex-col gap-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <TbEye size={24} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#2A363B]/50">
                Future Projection
              </span>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#2A363B] mt-1">
                Our Vision
              </h2>
            </div>
            <p className="text-lg text-[#2A363B]/80 font-medium leading-relaxed italic border-l-2 border-[#D4A390] pl-4 my-2">
              "To manage a billion digital wills, ensuring secure and seamless transfer of digital assets to loved ones around the world, protecting every legacy."
            </p>
            <p className="text-base text-[#2A363B]/75 font-medium leading-relaxed">
              We aim to foster a world where the transition of digital legacies is a smooth and trustworthy process. By combining cutting-edge, quantum-resistant encryption with an approachable and human design, we empower individuals worldwide to secure their digital footprints with total confidence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
