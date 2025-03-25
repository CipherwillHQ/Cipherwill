"use client";
// export default function FactorsListView() {
//   return (
//     <div className="p-4">
//       <section className="w-full max-w-7xl mx-auto mb-20 flex flex-col rounded-md p-4">
//         <h2 className="text-3xl font-bold text-center py-4">
//           End-to-End Encryption Supported with
//         </h2>
//         <div className="sm:text-xl text-center pb-8 flex items-center gap-4 justify-center text-gray-600">
//           Your Keys
//           <LuDot />
//           Your Data
//           <LuDot />
//           Your Control
//         </div>
//         <div className="flex">
//           <div className="p-2">Yubikeys</div>
//           <div className="p-2">Passswords</div>
//           <div className="p-2">FiDo2 Keys</div>
//           <div className="p-2">Hardware wallets</div>
//           <div className="p-2">Apple Keychain</div>
//           <div className="p-2">Google Titan</div>
//           <div className="p-2">Ledger Wallet</div>
//           <div className="p-2">Trezor Wallet</div>
//           <div className="p-2">On device biometrics</div>
//           <div className="p-2">Password managaer</div>
//         </div>
//       </section>
//     </div>
//   );
// }

import { motion } from "framer-motion";
import Link from "next/link";
import { LuDot } from "react-icons/lu";

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
  return (
    <section className="w-full max-w-7xl mx-auto mb-20 flex flex-col rounded-md p-4">
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
                <div
                  key={index}
                  className="mx-4 text-xl font-bold"
                >
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
                <div
                  key={index}
                  className="mx-4 text-xl font-bold"
                >
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
