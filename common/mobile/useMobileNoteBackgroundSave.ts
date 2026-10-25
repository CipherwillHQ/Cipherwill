// Flushes a pending note when the native wrapper moves into the background.
// Owns a mobile-only event subscription using the latest editor content.
// Does not change normal browser autosave or persist decrypted drafts.
"use client";
import { useEffect } from "react";
import { getMobileAuthBridge } from "@/common/auth/mobileAuthBridge";
export function useMobileNoteBackgroundSave(content: string | null, saved: string | null, save: (value: string) => Promise<void>) {
  useEffect(() => {
    if (!getMobileAuthBridge()) return;
    const flush = () => { if (content !== null && content !== saved) void save(content); };
    window.addEventListener("cipherwill:background", flush);
    return () => window.removeEventListener("cipherwill:background", flush);
  }, [content, saved, save]);
}
