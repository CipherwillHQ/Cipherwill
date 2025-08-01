"use client";
import SimpleButton from "@/components/common/SimpleButton";
import { useState } from "react";
import AddMasterPassword from "./add/AddMasterPassword";
import AddMetamask from "./add/AddMetamask";
import AddPasskey from "./add/AddPasskey";

export default function FactorChoice({ continuous }) {
  const [choice, setChoice] = useState<string | null>(null);
  return (
    <div className="bg-white dark:bg-neutral-800 text-black dark:text-white rounded-md p-2 w-[700px] max-w-[250px] sm:max-w-sm">
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
            <div className="text-sm">
              Use your Metamask wallet to encrypt your account with. Also can be
              used with Hardware Wallets such as Ledger or Trezor.
            </div>
          </SimpleButton>
          {navigator.credentials && <SimpleButton
            className="w-full p-2"
            onClick={() => {
              setChoice("passkey");
            }}
          >
            <div className="font-semibold">Passkey</div>
            <div className="text-sm">
              Use a passkey stored in your browser to encrypt your account with.
              Also can be used with Password Managers such as OnePass or Apple
              Keychain.
            </div>
          </SimpleButton>}
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