// Refreshes mobile billing and account data when returning from browser checkout.
// Owns the native foreground subscription while the billing screen is mounted.
// Does not infer payment success or grant Premium access.
"use client";
import { useEffect } from "react";
import { useApolloClient } from "@apollo/client/react";
import { isMobileClient } from "@/common/mobile/useMobileClient";
import ME from "@/graphql/ops/auth/queries/ME";
import GET_MY_SUBSCRIPTION from "@/graphql/ops/app/billing/queries/GET_MY_SUBSCRIPTION";
import logger from "@/common/debug/logger";

export default function useMobileBillingRefresh() {
  const client = useApolloClient();
  useEffect(() => {
    if (!isMobileClient()) return;
    const refresh = () => {
      void client.refetchQueries({ include: [ME, GET_MY_SUBSCRIPTION] }).catch(logger.error);
    };
    window.addEventListener("cipherwill:foreground", refresh);
    return () => window.removeEventListener("cipherwill:foreground", refresh);
  }, [client]);
}
