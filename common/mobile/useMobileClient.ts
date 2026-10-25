// Detects the native wrapper after hydration without changing browser sessions.
// Owns the shared mobile flag and passkey capability lookup.
// Does not infer mobile mode from screen size or user agent.
"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { getMobileAuthBridge } from "@/common/auth/mobileAuthBridge";
import { requestDevice } from "./deviceBridge";
import type { MobileCapabilities } from "@/types/interfaces";
export function subscribeMobileClient() { return () => {}; }
export function isMobileClient() { return Boolean(getMobileAuthBridge()); }
export function browserSnapshot() { return false; }
export function useMobileClient() {
  return useSyncExternalStore(subscribeMobileClient, isMobileClient, browserSnapshot);
}
export function useMobilePasskeys(mobile: boolean) {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    if (!mobile) return;
    let active = true;
    requestDevice<MobileCapabilities>("capabilities").then((value) => {
      if (active) setSupported(value.passkeys);
    }).catch(() => { if (active) setSupported(false); });
    return () => { active = false; };
  }, [mobile]);
  return supported;
}
