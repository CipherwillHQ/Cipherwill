"use client";
import SimpleButton from "@/components/common/SimpleButton";
import { useState } from "react";
import AddMasterPassword from "./add/AddMasterPassword";
import AddMetamask from "./add/AddMetamask";
import AddPasskey from "./add/AddPasskey";

export default function FactorChoice({ continuous }) {
  const [choice, setChoice] = useState(null);
  return (
    <div className="bg-secondary p-4 rounded-md text-black dark:text-white w-full max-w-sm">
      {choice === null && (
        <div className="w-full flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-center">
            Select Factor Type
          </h2>
          <div className="w-full p-2">
            <button
              className="w-full text-center p-2 mb-2 border border-default rounded-md hover:cursor-pointer bg-primary text-white"
              onClick={() => {
                setChoice("masterpassword");
              }}
            >
              Master Password
            </button>
            <div className="text-sm">
              A strong password that you can remember and will be used as a seed
              to encrypt all your account data.
            </div>
          </div>

          <div className="w-full p-2">
            <button
              className="w-full text-center p-2 mb-2 border border-default rounded-md hover:cursor-pointer bg-primary text-white"
              onClick={() => {
                setChoice("metamask");
              }}
            >
              Metamask
            </button>
            <ul className="text-sm list-disc list-inside text-left font-medium">
              <li>
                Use your Metamask wallet account to use as a seed to encrypt
                your account with.
              </li>
              <li>
                Can be used with Hardware Wallets such as Ledger or Trezor.
              </li>
            </ul>
          </div>
          {navigator.credentials && (
            <div
              className="w-full p-2"
            >
              <button 
              className="w-full text-center p-2 mb-2 border border-default rounded-md hover:cursor-pointer bg-primary text-white"
              onClick={() => {
                 setChoice("passkey");
               }}
              >Passkey</button>
              <ul className="text-sm list-disc list-inside text-left font-medium">
                <li>
                  Use a passkey stored in your device to encrypt your account
                  with.
                </li>
                <li>
                  Can be used with Password Managers such as OnePass or Apple
                  Keychain.
                </li>
                <li>
                  Can be used with FIDO2 devices such as Yubikey or Google
                  Titan.
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
      {choice === "masterpassword" && (
        <AddMasterPassword continuous={continuous} />
      )}
      {choice === "metamask" && <AddMetamask continuous={continuous} />}
      {choice === "passkey" && <AddPasskey continuous={continuous} />}
    </div>
  );
}
