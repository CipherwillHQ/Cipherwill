// Copies text with the native clipboard in the wrapper or the browser API.
// Owns completion so callers show success only after copying.
// Does not retain clipboard history or alter copied values.
import { getMobileAuthBridge } from "@/common/auth/mobileAuthBridge";
import { requestDevice } from "./deviceBridge";
export async function copyText(text: string): Promise<void> {
  if (getMobileAuthBridge()) await requestDevice("clipboard", { text });
  else await navigator.clipboard.writeText(text);
}
