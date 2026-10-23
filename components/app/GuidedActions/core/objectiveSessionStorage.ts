// Removes plaintext drafts left by the retired server-step client.
// Owns only cleanup of the legacy localStorage entry.
// Does not persist or recover the browser engine's in-memory conversation.
export function clearLegacyObjectiveSession() {
  if (typeof window === "undefined") return;
  try { window.localStorage.removeItem("guided-actions-objective-session-v1"); } catch { /* Storage may be unavailable. */ }
}
