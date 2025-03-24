"use client";

import { LuDot } from "react-icons/lu";

export default function FactorsListView() {
  return (
    <div className="p-4">
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
        <div className="flex">
          <div className="p-2">Yubikeys</div>
          <div className="p-2">Passswords</div>
          <div className="p-2">FiDo2 Keys</div>
          <div className="p-2">Hardware wallets</div>
          <div className="p-2">Apple Keychain</div>
          <div className="p-2">Google Titan</div>
          <div className="p-2">Ledger Wallet</div> 
          <div className="p-2">Trezor Wallet</div>
          <div className="p-2">On device biometrics</div>
          <div className="p-2">Password managaer</div>
        </div>
      </section>
    </div>
  );
}
