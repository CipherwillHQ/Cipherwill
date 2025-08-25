"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { LuDot } from "react-icons/lu";
import { TbBorderCornerSquare } from "react-icons/tb";

const companyNames = [
  "Yubikeys",
  "Passswords",
  "FiDo2 Keys",
  "Hardware wallets",
  "Apple Keychain",
  "Google Titan",
  "Ledger Wallet",
  "Trezor Wallet",
  "On device biometrics",
  "Password managaer",
];
export default function FactorsListView() {
  const sectionRef = useRef(null);
  // const { scrollYProgress } = useScroll({
  //   target: sectionRef,
  //   offset: ["start end", "end start"],
  // });
  // const topTransform = useTransform(scrollYProgress, [0, 0.5], ["50%", "0%"]);
  // const sideTransform = useTransform(scrollYProgress, [0, 0.5], ["10%", "0%"]);
  // const opacityTransform = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="w-full max-w-7xl mx-auto mb-20 flex flex-col rounded-md p-4 py-20 relative"
    >
      {/* <div className="absolute top-0 left-0 right-0 bottom-0 z-20 text-black">
        {[
          { top: topTransform, left: sideTransform },
          { bottom: topTransform, left: sideTransform },
          { top: topTransform, right: sideTransform },
          { bottom: topTransform, right: sideTransform },
        ].map((pos, idx) => (
          <motion.div
            key={idx}
            className="absolute w-6 h-6"
            style={{
              top: pos.top,
              bottom: pos.bottom,
              left: pos.left,
              right: pos.right,
              opacity: opacityTransform,
              margin: "16px",
            }}
          >
            <TbBorderCornerSquare
              className={`w-6 h-6 ${
                idx === 1
                  ? "rotate-270"
                  : idx === 2
                  ? "rotate-90"
                  : idx === 3
                  ? "rotate-180"
                  : ""
              }`}
            />
          </motion.div>
        ))}
      </div> */}
      <h2 className="text-3xl font-bold text-center py-4">
        End-to-End Encryption Supported with
      </h2>
      <div className="sm:text-xl text-center pb-8 flex items-center gap-4 justify-center text-gray-600">
        Your Keys
        <LuDot />
        Your Data
        <LuDot />
        Your Control
      </div>
      <div className="relative w-full max-w-6xl mx-auto overflow-hidden py-4 group">
        <div className="absolute left-0 bottom-0 top-0 right-0 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex z-20 items-center justify-center font-semibold transition-all duration-500">
          <Link href="/how-factors-work" className="">
            View Encryption Details
          </Link>
        </div>
        <div className="absolute left-0 bottom-0 top-0 bg-gradient-to-l from-transparent to-white w-8 sm:w-48 z-10" />
        <div className="absolute right-0 bottom-0 top-0 bg-gradient-to-r from-transparent to-white w-8 sm:w-48 z-10" />
        <div className="flex flex-col space-y-8 text-slate-600">
          <motion.div
            className="flex w-max"
            animate={{ x: ["-80%", "20%"] }}
            transition={{ repeat: Infinity, duration: 300, ease: "linear" }}
          >
            {[...companyNames, ...companyNames, ...companyNames].map(
              (name, index) => (
                <div key={index} className="mx-4 text-xl font-bold">
                  {name}
                </div>
              )
            )}
          </motion.div>
          <motion.div
            className="flex w-max"
            animate={{ x: ["0%", "-80%"] }}
            transition={{ repeat: Infinity, duration: 300, ease: "linear" }}
          >
            {[...companyNames, ...companyNames, ...companyNames].map(
              (name, index) => (
                <div key={index} className="mx-4 text-xl font-bold">
                  {name}
                </div>
              )
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
