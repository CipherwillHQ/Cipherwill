// Presents existing vault-unlock factors with native capability checks.
// Owns mobile wallet/passkey notices and the existing browser choices.
// Does not create factors or transfer encryption keys to native code.
"use client";

import Link from "next/link";
import Image from "next/image";
import { MetaMaskProvider } from "@metamask/sdk-react";
import logoBlack from "../../assets/name-black.png";
import logoWhite from "../../assets/name-white.png";
import MasterPassword from "./MasterPassword";
import Metamask from "./Metamask";
import Passkey from "./Passkey";
import ResetFactor from "./ResetFactor";
import MobileDesktopGate, { DesktopRequired } from "@/components/app/common/DesktopRequired";
import { useMobileClient, useMobilePasskeys } from "@/common/mobile/useMobileClient";

type SessionToken = {
  publicKey: string;
  privateKey: string;
};

export default function SessionFactorSelection({
  user,
  logout,
  methods,
  set_session_token,
}: {
  user: any;
  logout: () => void;
  methods: any[];
  set_session_token: (value: SessionToken | null) => void;
}) {
  const mobile = useMobileClient();
  const passkeys = useMobilePasskeys(mobile);
  return (
    <div className="flex flex-col h-screen bg-cream dark:bg-darkCanvas">
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-2 border-b sm:border-b-0">
        <Link href={"/"}>
          <Image
            alt="cipherwill logo"
            src={logoBlack}
            width={150}
            height={100}
            className="my-4 sm:my-0 dark:hidden"
          />
          <Image
            alt="cipherwill logo"
            src={logoWhite}
            width={150}
            height={100}
            className="my-4 sm:my-0 hidden dark:block"
          />
        </Link>
        <div className="flex items-center justify-between w-full sm:w-fit mx-1">
          <div className="m-1 text-xs sm:text-base">
            Logged in as <span className="font-semibold">{user.email}</span>
          </div>

          <button
            data-cy="logout-btn"
            className="text-red-700 hover:text-red-900 font-semibold rounded-sm p-1 m-1 text-sm"
            onClick={() => {
              logout();
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto px-4">
        <h1 className="p-2 my-2 text-center text-xl font-semibold">
          Select Authentication Factor
        </h1>
        <div className="flex flex-wrap justify-center">
          <MetaMaskProvider
            sdkOptions={{
              dappMetadata: {
                name: "Cipherwill",
                url: window.location.href,
              },
            }}
          >
            {methods.map((method) => {
              if (method.type === "master-password") {
                return (
                  <MasterPassword
                    key={method.id}
                    set_session_token={set_session_token}
                    method={method}
                  />
                );
              } else if (method.type === "metamask") {
                if (mobile) return <div key={method.id} className="m-2 max-w-sm">
                  <DesktopRequired action="use your wallet factor" />
                  <p className="p-2 text-sm">To use the mobile vault, add a master-password or supported passkey factor on desktop.</p>
                </div>;
                return (
                  <Metamask
                    key={method.id}
                    set_session_token={set_session_token}
                    method={method}
                  />
                );
              } else if (method.type === "passkey") {
                if (mobile && passkeys === null) return <p key={method.id}>Checking passkey support…</p>;
                if (mobile && !passkeys) return <div key={method.id} className="m-2 max-w-sm">
                  <DesktopRequired action="unlock with this passkey" />
                  <p className="p-2 text-sm">This device cannot use passkeys. You can use another master-password factor here.</p>
                </div>;
                return (
                  <Passkey
                    key={method.id}
                    set_session_token={set_session_token}
                    method={method}
                  />
                );
              } else {
                return null;
              }
            })}
          </MetaMaskProvider>
        </div>
      </div>
      <div className="py-12">
        <MobileDesktopGate action="reset your security factors">
        <ResetFactor />
        </MobileDesktopGate>
      </div>
    </div>
  );
}
