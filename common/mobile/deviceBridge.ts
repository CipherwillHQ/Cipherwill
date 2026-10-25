// Requests native device actions through the optional WebView channel.
// Owns request matching, bounded waits and native error propagation.
// Does not exchange authentication tokens or run in ordinary browsers.
import type { MobileDeviceResponse, MobileDeviceWindow } from "@/types/interfaces";
const pending = new Map<number, (response: MobileDeviceResponse) => void>();
let nextId = 0;
export function getDeviceBridge() {
  if (typeof window === "undefined") return;
  return (window as MobileDeviceWindow).CipherwillDevice;
}
export function receiveDeviceResponse(id: number, response: MobileDeviceResponse) {
  const resolve = pending.get(id);
  pending.delete(id);
  resolve?.(response);
}
export function requestDevice<T = unknown>(type: string, payload: Record<string, unknown> = {}, timeoutMs = 15000): Promise<T> {
  const bridge = getDeviceBridge();
  if (!bridge) return Promise.reject(Error("Please update the mobile app to use this feature."));
  (window as MobileDeviceWindow).CipherwillDeviceResponse = receiveDeviceResponse;
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => receiveDeviceResponse(id, { error: "The device action timed out. Please try again." }), timeoutMs);
    pending.set(id, (response) => {
      clearTimeout(timer);
      if (response.error) reject(Error(response.error));
      else resolve(response.value as T);
    });
    try { bridge.postMessage(JSON.stringify({ ...payload, type, id })); }
    catch { receiveDeviceResponse(id, { error: "The mobile app is unavailable." }); }
  });
}
