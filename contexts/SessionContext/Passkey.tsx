// Unlocks existing passkey factors on supported browsers and Android devices.
// Owns request state and recoverable credential-provider feedback.
// Does not create credentials or transfer vault keys to native code.
"use client";
import { useRef, useState } from "react";
import SimpleButton from "@/components/common/SimpleButton";
import getShortKey from "@/factory/publicKey/getShortKey";
import toast from "react-hot-toast";
import { unlockPasskeyFactor, passkeyErrorMessage } from "@/common/factor/passkeyFactor";

export default function Passkey({ set_session_token, method }: {
  set_session_token: Function;
  method: any;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);
  return (
    <div data-cy="passkey-box" className="border border-default rounded-sm p-2 m-1 w-80 bg-secondary">
      <div>Name: <span data-cy="passkey-name">{method.name}</span></div>
      <div>Type: {method.type}</div>
      <div>Key: {getShortKey(method.publicKey)}</div>
      <SimpleButton className="w-full" disabled={isSubmitting}
        onClick={async () => {
          if (submitting.current) return;
          submitting.current = true;
          setIsSubmitting(true);
          try {
            set_session_token(await unlockPasskeyFactor(method.nonce, method.publicKey));
          } catch (error) {
            toast.error(passkeyErrorMessage(error));
          } finally {
            submitting.current = false;
            setIsSubmitting(false);
          }
        }}>
        {isSubmitting ? "Waiting for passkey..." : "Sign with Passkey"}
      </SimpleButton>
    </div>
  );
}
