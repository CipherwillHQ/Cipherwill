// Creates passkey factors on supported browsers and Android devices.
// Owns credential enrollment, API creation and subsequent key synchronization.
// Does not change the key derivation of existing passkey factors.
"use client";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useApolloClient, useMutation } from "@apollo/client/react";
import SimpleButton from "@/components/common/SimpleButton";
import CREATE_FACTOR from "@/graphql/ops/auth/mutations/CREATE_FACTOR";
import { useSession } from "@/contexts/SessionContext";
import { useUserContext } from "@/contexts/UserSetupContext";
import { createPasskeyFactor, passkeyErrorMessage } from "@/common/factor/passkeyFactor";
import continuousFactorIn from "./continuousFactorIn";

export default function AddPasskey({ continuous }) {
  const { session } = useSession();
  const { user } = useUserContext();
  const [isMigrating, setIsMigrating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);
  const [name, setName] = useState("Passkey");
  const client = useApolloClient();
  const [createFactor, { loading }] = useMutation(CREATE_FACTOR);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold py-1">Add Passkey</h3>
      <label htmlFor="passkey-factor-name">Name for factor</label>
      <input id="passkey-factor-name" type="text"
        className="border p-2 rounded-sm bg-white dark:bg-neutral-800"
        placeholder="Enter a name for this factor" value={name}
        onChange={(e) => setName(e.target.value)} />
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Follow your device or password manager’s instructions. Keep an NFC security key near your device until setup finishes.
      </p>
      <SimpleButton disabled={isSubmitting || isMigrating || loading}
        onClick={async () => {
          if (submitting.current || isMigrating || loading) return;
          if (!user?.id) { toast.error("Please log in again."); return; }
          if (!name.trim()) { toast.error("Enter a name for this factor."); return; }
          submitting.current = true;
          setIsSubmitting(true);
          try {
            const factor = await createPasskeyFactor(user.id, user.email, user.first_name || user.email);
            const { data } = await createFactor({ variables: { name, type: "passkey", ...factor } });
            if (continuous) {
              setIsMigrating(true);
              await continuousFactorIn(data, client, session);
            } else {
              toast.success("You need to perform factor migration yourself");
              window.location.reload();
            }
          } catch (error) {
            toast.error(passkeyErrorMessage(error));
          } finally {
            submitting.current = false;
            setIsSubmitting(false);
            setIsMigrating(false);
          }
        }}>
        {isMigrating ? "Synchronizing keys..." : isSubmitting ? "Waiting for passkey..." : "Add Passkey"}
      </SimpleButton>
    </div>
  );
}
