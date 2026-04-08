"use client";
import { createContext, useContext, useState } from "react";
import { useAuth } from "../AuthContext";
import FullscreenLoader from "../../components/loaders/FullscreenLoader";
import DevOnly from "@/components/debug/DevOnly";
import DeactivatedUserWarning from "./DeactivatedUserWarning";
import useAvailableAuthFactors from "./useAvailableAuthFactors";
import SessionFactorSelection from "./SessionFactorSelection";

const SessionContext = createContext<any>({});

export function SessionProvider({ children }) {
  const { user, logout } = useAuth();
  const [session_token, set_session_token] = useState<null | {
    publicKey: string;
    privateKey: string;
  }>(null);
  const { available_methods, inactive_user } = useAvailableAuthFactors(user);
  
  if (inactive_user) {
    return (
      <DeactivatedUserWarning inactive_user={inactive_user} logout={logout} />
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
      <SessionFactorSelection
        user={user}
        logout={logout}
        methods={available_methods}
        set_session_token={set_session_token}
      />
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
