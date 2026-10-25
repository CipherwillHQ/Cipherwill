// Adapts MetaMask's SDK to the native app while retaining its encrypted transport.
// Owns wallet launch feedback, the return scheme and bounded mobile requests.
// Does not send wallet signatures or vault keys through the native bridge.
import type { MetaMaskSDK, MetaMaskSDKOptions } from "@metamask/sdk-react";
import { getMobileAuthBridge } from "@/common/auth/mobileAuthBridge";
import { requestDevice } from "@/common/mobile/deviceBridge";

const launchFailures = new Set<(error: Error) => void>();

export function openWalletDeeplink(url: string): void {
  const pendingRequests = [...launchFailures];
  void requestDevice("wallet-open", { url }).catch(() => {
    const error = new Error("Unable to open MetaMask. Install or update MetaMask on this device, then retry.");
    for (const reject of pendingRequests) reject(error);
  });
}

export function getWalletSdkOptions(): MetaMaskSDKOptions {
  const mobile = Boolean(getMobileAuthBridge());
  return {
    dappMetadata: {
      name: "Cipherwill",
      url: typeof window === "undefined" ? "https://cipherwill.com" : window.location.href,
      ...(mobile ? { scheme: "cipherwill-wallet" } : {}),
    },
    ...(mobile ? { preferDesktop: false, useDeeplink: true, openDeeplink: openWalletDeeplink } : {}),
  };
}

export async function requestWallet<T>(sdk: MetaMaskSDK | undefined, request: () => Promise<T>): Promise<T> {
  if (!sdk) throw new Error("MetaMask is still loading. Please try again.");
  if (!getMobileAuthBridge()) return request();
  let fail: (error: Error) => void = () => {};
  let timer: ReturnType<typeof setTimeout> | undefined;
  const failure = new Promise<never>((_, reject) => {
    fail = reject;
    launchFailures.add(fail);
    timer = setTimeout(() => reject(new Error("MetaMask did not respond. Return to Cipherwill and try again.")), 120000);
  });
  try {
    return await Promise.race([request(), failure]);
  } catch (error) {
    // Clear abandoned requests so a missing wallet or cancelled request can be retried.
    await sdk.terminate().catch(() => {});
    throw error;
  } finally {
    clearTimeout(timer);
    launchFailures.delete(fail);
  }
}
