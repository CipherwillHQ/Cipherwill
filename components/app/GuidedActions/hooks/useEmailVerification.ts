// Controls verification delivery and confirmation from overview banners.
// Owns pending actions, the sent slide, and retryable verification feedback.
// Does not bypass the server's email verification status.
import { useCallback, useRef, useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import { useAuth } from "@/contexts/AuthContext";
import { checkEmailVerification, sendVerificationEmail } from "@/common/auth/emailVerification";

export default function useEmailVerification(onVerified: () => void) {
  const client = useApolloClient();
  const { user } = useAuth();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pending = useRef(false);

  const onSend = useCallback(async () => {
    if (pending.current) return;
    pending.current = true;
    setBusy(true); setError(null);
    try { await sendVerificationEmail(client); setSent(true); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to send verification email. Please try again."); }
    finally { pending.current = false; setBusy(false); }
  }, [client]);

  const onCheck = useCallback(async () => {
    if (pending.current) return;
    pending.current = true;
    setBusy(true); setError(null);
    try {
      if (!user) throw new Error("Sign in again to check your email verification.");
      if (await checkEmailVerification(client, user)) onVerified();
      else setError("Your email isn't verified yet. Open the link in your inbox, then try again.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to check verification. Please try again."); }
    finally { pending.current = false; setBusy(false); }
  }, [client, user, onVerified]);

  return { sent, busy, error, onSend, onCheck };
}
