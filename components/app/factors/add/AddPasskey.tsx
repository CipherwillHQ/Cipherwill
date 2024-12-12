"use client";

import logger from "@/common/debug/logger";
import areUnit8ArraysEqual from "@/common/string/areUnit8ArraysEqual";
import generateRandomBytes from "@/common/string/generateRandomBytes";
import SimpleButton from "@/components/common/SimpleButton";
import { useState } from "react";
import toast from "react-hot-toast";
import crypto from "crypto";
import { ec as EC } from "elliptic";
import mergeUint8Arrays from "@/common/string/mergeUint8Arrays";
import { useApolloClient, useMutation } from "@apollo/client";
import CREATE_FACTOR from "@/graphql/ops/auth/mutations/CREATE_FACTOR";
import { useSession } from "@/contexts/SessionContext";
import continuousFactorIn from "./continuousFactorIn";
import { useUserContext } from "@/contexts/UserSetupContext";
import { sleep } from "@/common/time/sleep";

const ec = new EC("secp256k1");

function arrayBufferToStr(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

export default function AddPasskey({ continuous }) {
  const { session } = useSession();
  const { user } = useUserContext();
  const [isMigrating, setIsMigrating] = useState(false);
  const [name, setName] = useState("Passkey");
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
    <div>
      <h3 className="font-semibold p-1">Add Passkey</h3>
      <input
        type="text"
        className="border p-2 rounded bg-white dark:bg-neutral-800"
        placeholder="Enter a name for this factor"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <SimpleButton
        onClick={async () => {
          if (isMigrating || loading) return;
          const hostname = window.location.hostname;
          if (
            hostname !== "localhost" &&
            hostname !== "cipherwill.com" &&
            hostname !== "www.cipherwill.com" &&
            hostname !== "preview.cipherwill.com"
          ) {
            toast.error("Cannot add passkey on this domain");
            return;
          }
          const challenge = generateRandomBytes(32); // 256 bits or 32 bytes random challenge
          logger.info("challenge", challenge);
          await navigator.credentials
            .create({
              publicKey: {
                challenge,
                rp: { id: window.location.hostname, name: "Cipherwill" },
                user: {
                  id: new Uint8Array(Buffer.from(user.id, "utf-8")),
                  name: user.email,
                  displayName: user.first_name
                    ? `${user.first_name}`
                    : user.email,
                },
                pubKeyCredParams: [{ type: "public-key", alg: -7 }],
              },
            })
            .then(async (credential: PublicKeyCredential) => {
              const registration_id = new Uint8Array(credential.rawId);
              logger.info("registration_id", registration_id);
              if (registration_id) {
                let secret = crypto
                  .createHash("sha256")
                  .update(challenge)
                  .digest("hex");
                const keyPair = ec.keyFromPrivate(secret);
                const publicKey = keyPair.getPublic("hex");

                await createFactor({
                  variables: {
                    name,
                    type: "passkey",
                    publicKey,
                    nonce: Buffer.from(
                      mergeUint8Arrays(challenge, registration_id)
                    ).toString("base64"),
                  },
                });
              } else {
                toast.error("Failed to add passkey as registration_id is null");
                logger.error(
                  "Failed to add passkey as registration_id is null"
                );
              }
            });
        }}
      >
        {isMigrating ? "Adding Factor..." : "Add Passkey"}
      </SimpleButton>
    </div>
  );
}
