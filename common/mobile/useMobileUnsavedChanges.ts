// Reports pending edits to native back handling and guards web link navigation.
// Owns mobile-only leave confirmations while a note is not saved.
// Does not alter browser warnings or perform note encryption.
"use client";
import { useEffect } from "react";
import { getMobileAuthBridge } from "@/common/auth/mobileAuthBridge";
import { requestDevice } from "./deviceBridge";
export function useMobileUnsavedChanges(dirty: boolean) {
  useEffect(() => {
    if (!getMobileAuthBridge()) return;
    void requestDevice("dirty", { dirty }).catch(() => {});
    const guard = (event: MouseEvent) => {
      const anchor = (event.target as Element)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!dirty || !anchor || anchor.href === window.location.href || event.defaultPrevented) return;
      if (!window.confirm("Your latest changes have not finished saving. Leave anyway?")) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener("click", guard, true);
    return () => {
      document.removeEventListener("click", guard, true);
      void requestDevice("dirty", { dirty: false }).catch(() => {});
    };
  }, [dirty]);
}
