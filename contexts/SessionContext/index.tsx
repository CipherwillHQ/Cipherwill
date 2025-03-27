"use client";
import { useLazyQuery } from "@apollo/client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import Link from "next/link";
import GET_FACTORS from "../../graphql/ops/auth/queries/AVAILABLE_AUTH_FACTORS";
import FullscreenLoader from "../../components/loaders/FullscreenLoader";
import logoBlack from "../../assets/name-black.png";
import logoWhite from "../../assets/name-white.png";
import Image from "next/image";
import MasterPassword from "./MasterPassword";
import DevOnly from "@/components/debug/DevOnly";
import ResetFactor from "./ResetFactor";
import Metamask from "./Metamask";
import { MetaMaskProvider } from "@metamask/sdk-react";
import Passkey from "./Passkey";

const SessionContext = createContext<any>({});

export function SessionProvider({ children }) {
  const { user, logout } = useAuth();
  const [available_methods, set_available_methods] = useState(null);
  const [inactive_user, set_inactive_user] = useState<false | string>(false);
  const [session_token, set_session_token] = useState<null | {
    publicKey: string;
    privateKey: string;
  }>(null);
  const [getAuthFactors] = useLazyQuery(GET_FACTORS, {
    onCompleted(data) {
      const methods = data.getFactors;
      set_available_methods(methods);
    },
    onError(error) {
      const code = (error?.cause as any)?.result?.errors[0]?.extensions?.code;
      if (code === "USER_DEACTIVATED") {
        set_inactive_user(code);
      }
    },
  });
  useEffect(() => {
    if (user) {
      getAuthFactors();
    }
  }, [user, getAuthFactors]);
  if (inactive_user) {
    return (
      <div className="flex flex-col p-4 gap-2 items-center justify-center h-screen bg-white text-black">
        <h2 className="text-lg font-bold">Inactive User Account</h2>
        <div className="text-center">
          Your account has a status "{inactive_user}". Please contact support at
          support@cipherwill.com. This happens when your Cipherwill has
          triggered all the events in your will and all your account data has
          been removed from the system.
        </div>
        <button
        className="text-red-700 hover:underline"
        onClick={logout}
        >
          Logout
        </button>
      </div>
    );
  }

  if (available_methods === null) {
    return <FullscreenLoader />;
  }

  if (user === null || user === undefined)
    return (
      <div>
        <DevOnly>User not logged in</DevOnly>
      </div>
    );

  if (session_token === null && available_methods.length !== 0) {
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
              {available_methods.map((method) => {
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

  const value = {
    session: session_token,
    lock: () => {
      set_session_token(null);
      // window.location.reload();
    },
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): {
  session: {
    privateKey: string;
    publicKey: string;
  };
  lock: () => void;
} {
  return useContext(SessionContext);
}
