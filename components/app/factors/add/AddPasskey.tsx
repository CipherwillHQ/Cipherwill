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
import extractDomainName from "@/common/string/extractDomainName";

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
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold py-1 w-screen">Add Passkey</h3>
      <label>Name for factor</label>

      <input
        type="text"
        className="border p-2 rounded bg-white dark:bg-neutral-800"
        placeholder="Enter a name for this factor"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        <div>
          Please note: If you're adding a passkey using a NFC device, keep your
          device close to the NFC reader as it may take a little longer if
          you've a slow NFC reader.
        </div>
        <div className="mt-2">
          Avg Time: Minimum 3 seconds to Maximum 30 seconds
        </div>
      </div>
      <SimpleButton
        onClick={async () => {
          if (isMigrating || loading) return;
          const domain = extractDomainName(window.location.href);
          logger.info("domain", domain);
          if (domain !== "localhost" && domain !== "cipherwill.com") {
            toast.error("Cannot add passkey on this domain");
            return;
          }
          const factor_nonce = generateRandomBytes(8); // 64 bits or 8 bytes random nonce
          const challenge = generateRandomBytes(32); // 256 bits or 32 bytes random challenge
          await navigator.credentials
            .create({
              publicKey: {
                challenge,
                rp: { id: domain, name: "Cipherwill" },
                user: {
                  id: mergeUint8Arrays(
                    factor_nonce,
                    new Uint8Array(Buffer.from(user.id, "utf-8"))
                  ),
                  name: user.email,
                  displayName: user.first_name
                    ? `${user.first_name}`
                    : user.email,
                },
                pubKeyCredParams: [
                  { alg: -7, type: "public-key" }, // ES256
                  { alg: -257, type: "public-key" }, // RS256
                ],
                authenticatorSelection: {
                  requireResidentKey: true,
                  residentKey: "required",
                },
              },
            })
            .then(async (credential: PublicKeyCredential) => {
              const registration_id = new Uint8Array(credential.rawId);
              if (registration_id && factor_nonce) {
                let secret = crypto
                  .createHash("sha256")
                  .update(mergeUint8Arrays(factor_nonce, registration_id))
                  .digest("hex");
                const keyPair = ec.keyFromPrivate(secret);
                const publicKey = keyPair.getPublic("hex");

                await createFactor({
                  variables: {
                    name,
                    type: "passkey",
                    publicKey,
                    nonce: Buffer.from(factor_nonce).toString("base64"),
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
