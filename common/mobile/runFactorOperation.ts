// Keeps native back navigation aware of in-flight factor synchronization and removal.
// Owns the pending-operation count and cleanup after success or failure.
// Does not persist vault secrets or promise work after the app is terminated.
import { getMobileAuthBridge } from "@/common/auth/mobileAuthBridge";
import { requestDevice } from "./deviceBridge";

let pending = 0;

export async function runFactorOperation<T>(operation: () => Promise<T>): Promise<T> {
  if (!getMobileAuthBridge()) return operation();
  pending++;
  await requestDevice("dirty", { dirty: true }).catch(() => {});
  try {
    return await operation();
  } finally {
    pending--;
    await requestDevice("dirty", { dirty: pending > 0 }).catch(() => {});
  }
}
