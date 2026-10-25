// Restores native authentication using Firebase's supported custom-token sign-in.
// Owns one bootstrap per page and in-memory WebView persistence.
// Does not transfer native refresh tokens or change ordinary browser sessions.
import { inMemoryPersistence, setPersistence, signInWithCustomToken, type Auth } from "firebase/auth";
import { getMobileAuthBridge, requestMobileAuth } from "./mobileAuthBridge";

const initializations = new WeakMap<Auth, Promise<void>>();

export function initializeMobileAuth(auth: Auth): Promise<void> {
  if (!getMobileAuthBridge()) return Promise.resolve();
  const existing = initializations.get(auth);
  if (existing) return existing;
  const initialization = requestMobileAuth("session").then(async (session) => {
    if (!session) throw Error("Native session unavailable");
    const endpoint = new URL("/rest/v1/mobile-auth", process.env.NEXT_PUBLIC_API_HOST!);
    const response = await fetch(endpoint, {
      method: "POST", headers: { Authorization: `Bearer ${session.idToken}` }, cache: "no-store",
    });
    if (!response.ok) throw Error("Unable to authenticate the web session");
    const { token } = await response.json();
    await setPersistence(auth, inMemoryPersistence);
    const credential = await signInWithCustomToken(auth, token);
    if (credential.user.uid !== session.uid) {
      await auth.signOut();
      throw Error("Native account changed");
    }
  }).catch((error) => {
    try { getMobileAuthBridge()?.postMessage('{"type":"error","id":0}'); } catch { /* The native view may have closed. */ }
    throw error;
  });
  initializations.set(auth, initialization);
  return initialization;
}
