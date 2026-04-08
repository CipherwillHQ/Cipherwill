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
  return (
    <div className="flex flex-col h-screen bg-dark-50 dark:bg-dark">
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
                return (
                  <Metamask
                    key={method.id}
                    set_session_token={set_session_token}
                    method={method}
                  />
                );
              } else if (method.type === "passkey") {
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
        <ResetFactor />
      </div>
    </div>
  );
}
