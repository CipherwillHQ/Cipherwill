// Explains actions reserved for desktop in the native mobile wrapper.
// Owns a reusable notice and conditional rendering of existing web controls.
// Does not redirect users or change ordinary browser functionality.
"use client";
import type { DesktopRequiredProps } from "@/types/interfaces";
import { useMobileClient } from "@/common/mobile/useMobileClient";
export function DesktopRequired({ action }: DesktopRequiredProps) {
  return <div role="note" className="rounded-xl border border-default bg-secondary p-4 text-sm">
    Please sign in on desktop to {action}.
    <p className="mt-2 text-neutral-500 dark:text-neutral-400">Visit cipherwill.com on your desktop computer.</p>
  </div>;
}
export default function MobileDesktopGate({ action, children }: DesktopRequiredProps) {
  return useMobileClient() ? <DesktopRequired action={action} /> : <>{children}</>;
}
