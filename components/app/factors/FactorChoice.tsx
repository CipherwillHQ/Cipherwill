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
          <SimpleButton
            className="w-full p-2"
            onClick={() => {
              setChoice("masterpassword");
            }}
          >
            <div className="font-semibold">Master Password</div>
            <div className="text-sm">
              A strong password that you can remember and will be used as a seed
              to encrypt all your account data.
            </div>
          </SimpleButton>

          <SimpleButton
            className="w-full p-2"
            onClick={() => {
              setChoice("metamask");
            }}
          >
            <div className="font-semibold">Metamask</div>
            <ul className="text-sm list-disc list-inside text-left font-medium">
                <li>
                Use your Metamask wallet account to use as a seed to encrypt your account with.
                </li>
                <li>
                  Can be used with Hardware Wallets such as Ledger or Trezor.
                </li>
              </ul>
          </SimpleButton>
          {navigator.credentials && (
            <SimpleButton
              className="w-full p-2"
              onClick={() => {
                setChoice("passkey");
              }}
            >
              <div className="font-semibold">Passkey</div>
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
            </SimpleButton>
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
