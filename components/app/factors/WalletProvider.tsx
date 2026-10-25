// Provides one stable MetaMask configuration for factor creation and unlocking.
// Owns native wallet-launch options without reinitializing on component updates.
// Does not connect or sign until a user requests a wallet action.
"use client";
import { useMemo, type ReactNode } from "react";
import { MetaMaskProvider } from "@metamask/sdk-react";
import { getWalletSdkOptions } from "@/common/factor/walletSdk";

export default function WalletProvider({ children }: { children: ReactNode }) {
  const options = useMemo(() => getWalletSdkOptions(), []);
  return <MetaMaskProvider sdkOptions={options}>{children}</MetaMaskProvider>;
}
