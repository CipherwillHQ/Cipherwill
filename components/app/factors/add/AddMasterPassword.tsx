"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import crypto from "crypto";
import { ec as EC } from "elliptic";
import { useApolloClient, useMutation } from "@apollo/client";
import CREATE_FACTOR from "../../../../graphql/ops/auth/mutations/CREATE_FACTOR";
import { useSession } from "../../../../contexts/SessionContext";
import continuousFactorIn from "./continuousFactorIn";
import SimpleButton from "@/components/common/SimpleButton";

const ec = new EC("secp256k1");

export default function AddMasterPassword({ continuous }) {
  const { session } = useSession();
  const [isMigrating, setIsMigrating] = useState(false);
  const [name, setName] = useState("Master password");
  const [password, setPassword] = useState("");
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
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <SimpleButton
        className="flex items-center justify-center gap-2"
        // data-cy="meta-password-submit-button"
        onClick={async () => {
          if (isMigrating || loading) return;
          if (name.length < 1) {
            toast.error("You must enter a name for this factor");
            return;
          }
          if (password && password.length > 3) {
            const nonce = Math.floor(Math.random() * 1000000).toString();
            let secret = crypto
              .createHash("sha256")
              .update(`${password}:${nonce}`)
              .digest("hex");
            const keyPair = ec.keyFromPrivate(secret);
            const publicKey = keyPair.getPublic("hex");

            await createFactor({
              variables: {
                name,
                type: "master-password",
                publicKey,
                nonce,
              },
            });
          } else {
            toast.error("Password must be at least 4 characters");
          }
        }}
      >
        {(loading || isMigrating) && (
          <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin mr-2" />
        )}
        Add
      </SimpleButton>
    </div>
  );
}
