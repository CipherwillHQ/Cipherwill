// Sends checkout results to Flutter's CipherwillUpgrade JavaScript channel.
// Owns the JSON message contract and duplicate-delivery protection per attempt.
// Does not close the browser, expose account details, or activate Premium.
import type { RefObject } from "react";
import type { UpgradeWebViewMessage, UpgradeWebViewWindow } from "@/types/interfaces";

export default function notifyUpgradeWebView(
  result: Omit<UpgradeWebViewMessage, "type">,
  notificationSent: RefObject<boolean>,
) {
  if (typeof window === "undefined" || notificationSent.current) return;
  const bridge = (window as UpgradeWebViewWindow).CipherwillUpgrade;
  if (!bridge) return;

  try {
    bridge.postMessage(JSON.stringify({ type: "cipherwill.upgrade", ...result }));
    notificationSent.current = true;
  } catch {
    // A disconnected native bridge must not interrupt the browser checkout.
  }
}
