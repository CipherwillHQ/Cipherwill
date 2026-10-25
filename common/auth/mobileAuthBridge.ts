// Requests native Firebase sessions and propagates web logout to Flutter.
// Owns pending bridge requests; credentials stay in memory.
// Does not run in ordinary browsers or change Firebase accounts itself.
import type { MobileAuthWindow, MobileFirebaseSession } from "@/types/interfaces";

const pending = new Map<number, (session: MobileFirebaseSession | null) => void>();
let nextId = 0;

export function getMobileAuthBridge() {
  if (typeof window === "undefined") return;
  return (window as MobileAuthWindow).CipherwillAuth;
}

export function requestMobileAuth(type: "session" | "logout"): Promise<MobileFirebaseSession | null> {
  const bridge = getMobileAuthBridge();
  if (!bridge) return Promise.resolve(null);
  const target = window as MobileAuthWindow;
  target.CipherwillAuthResponse = receiveMobileAuth;
  const id = ++nextId;
  return new Promise((resolve) => {
    const timeout = setTimeout(() => receiveMobileAuth(id, null), 15000);
    pending.set(id, (session) => {
      clearTimeout(timeout);
      resolve(session);
    });
    try {
      bridge.postMessage(JSON.stringify({ type, id }));
    } catch {
      receiveMobileAuth(id, null);
    }
  });
}

export function receiveMobileAuth(id: number, session: MobileFirebaseSession | null) {
  const resolve = pending.get(id);
  pending.delete(id);
  resolve?.(session);
}
