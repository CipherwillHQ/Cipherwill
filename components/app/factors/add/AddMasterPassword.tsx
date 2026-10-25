// Creates v2 master-password factors using the shared client-side derivation.
// Owns new-password validation and creation through the existing factor API.
// Does not upgrade or remove existing v1 factors.
"use client";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  createMasterPasswordNonce, deriveMasterPasswordFactor,
  isValidNewMasterPassword, MASTER_PASSWORD_REQUIREMENTS,
} from "@/common/factor/masterPasswordFactor";
import { useApolloClient, useMutation } from "@apollo/client/react";
import CREATE_FACTOR from "../../../../graphql/ops/auth/mutations/CREATE_FACTOR";
import { useSession } from "../../../../contexts/SessionContext";
import continuousFactorIn from "./continuousFactorIn";
import SimpleButton from "@/components/common/SimpleButton";

export default function AddMasterPassword({ continuous }) {
  const { session } = useSession();
  const [isMigrating, setIsMigrating] = useState(false);
  const [name, setName] = useState("Master password");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);
  const client = useApolloClient();

  const [createFactor, { loading }] = useMutation(CREATE_FACTOR, {
    onCompleted: async (data, clientOptions) => {
      if (continuous) {
        setIsMigrating(true);
        await continuousFactorIn(data, client, session);
        setIsMigrating(false);
      } else {
        toast.success("You need to perform factor migration yourself");
        window.location.reload();
      }
    },
  });
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold p-1">Add Master Password</h3>
      <input
        type="text"
        data-cy="meta-password-name-input"
        className="border p-2 rounded-sm bg-white dark:bg-neutral-800"
        placeholder="Enter a name for this factor"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <input
        type="password"
        data-cy="meta-password-input"
        className="border p-2 rounded-sm bg-white dark:bg-neutral-800"
        placeholder="Enter Master Password"
        value={password}
        disabled={isSubmitting || isMigrating || loading}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <p className="text-sm">{MASTER_PASSWORD_REQUIREMENTS}</p>
      <SimpleButton
        className="flex items-center justify-center gap-2"
        disabled={isSubmitting || isMigrating || loading}
        // data-cy="meta-password-submit-button"
        onClick={async () => {
          if (submitting.current || isMigrating || loading) return;
          if (name.length < 1) {
            toast.error("You must enter a name for this factor");
            return;
          }
          if (!isValidNewMasterPassword(password)) {
            toast.error(MASTER_PASSWORD_REQUIREMENTS);
            return;
          }
          submitting.current = true;
          setIsSubmitting(true);
          try {
            const nonce = createMasterPasswordNonce();
            const { publicKey } = await deriveMasterPasswordFactor(password, nonce);

            await createFactor({
              variables: {
                name,
                type: "master-password",
                publicKey,
                nonce,
              },
            });
          } catch {
            toast.error("Unable to add your master password. Please update Cipherwill and try again.");
          } finally {
            submitting.current = false;
            setIsSubmitting(false);
          }
        }}
      >
        {(isSubmitting || loading || isMigrating) && (
          <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin mr-2" />
        )}
        Add
      </SimpleButton>
    </div>
  );
}
