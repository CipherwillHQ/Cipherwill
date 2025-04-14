"use client";

import logger from "@/common/debug/logger";
import SimpleButton from "@/components/common/SimpleButton";
import { useSession } from "@/contexts/SessionContext";
import decrypt from "@/crypto/e0/decrypt";
import GET_KEY_BY_REF_ID from "@/graphql/ops/app/key/Queries/GET_KEY_BY_REF_ID";
import GET_POD from "@/graphql/ops/app/pod/queries/GET_POD";
import { useApolloClient } from "@apollo/client";
import toast from "react-hot-toast";
import crypto from "crypto";
import SwapFile from "./SwapFile";
import GET_METAMODEL from "@/graphql/ops/app/metamodel/queries/GET_METAMODEL";

export default function PodDetails({ id }) {
  const client = useApolloClient();
  const { session } = useSession();
  return (
    <div className="flex gap-2 py-4">
      <SimpleButton
        onClick={async () => {
          const encryption_key = await client.query({
            query: GET_KEY_BY_REF_ID,
            fetchPolicy: "network-only",
            variables: session
              ? {
                  ref_id: id,
                  publicKey: session.publicKey,
                }
              : {
                  ref_id: id,
                  publicKey: "null",
                },
          });
          let random_key = "";

          if (
            encryption_key.data &&
            encryption_key.data.getKeyByRefId &&
            encryption_key.data.getKeyByRefId.key
          ) {
            if (encryption_key.data.getKeyByRefId.key.startsWith("{")) {
              const parsedData = JSON.parse(
                encryption_key.data.getKeyByRefId.key
              );
              if (parsedData.type === "E0") {
                // factorless decryption
                random_key = await decrypt(
                  session.privateKey,
                  Buffer.from(parsedData.ciphertext, "base64"),
                  Buffer.from(parsedData.ephemPublicKey, "base64"),
                  Buffer.from(parsedData.iv, "base64"),
                  Buffer.from(parsedData.mac, "base64")
                );
              } else if (parsedData.type === "E1") {
                // factored decryption
                random_key = await decrypt(
                  session.privateKey,
                  Buffer.from(parsedData.ciphertext, "base64"),
                  Buffer.from(parsedData.ephemPublicKey, "base64"),
                  Buffer.from(parsedData.iv, "base64"),
                  Buffer.from(parsedData.mac, "base64")
                );
              }
            } else {
              random_key = encryption_key.data.getKeyByRefId.key;
            }
          } else {
            // no key found
            toast.error("No key found");
            return;
          }
          if (random_key.length < 16) {
            toast.error("Invalid encryption key");
            return;
          }

          const metamodel_response = await client.query({
            query: GET_METAMODEL,
            fetchPolicy: "network-only",
            variables: {
              id,
            },
          });
          const metamodel = metamodel_response.data.getMetamodel;
          const parsed_metadata = JSON.parse(metamodel.metadata);
          if (!parsed_metadata || parsed_metadata.title === undefined) {
            toast.error("No title found");

            return;
          }

          let pod;
          try {
            pod = await client.query({
              query: GET_POD,
              fetchPolicy: "network-only",
              variables: {
                ref_id: id,
              },
            });
          } catch (error) {
            toast.error("Error while downloading data");
            logger.error("Error while downloading data", error);
            return;
          }
          const key = random_key.slice(16);
          const iv = random_key.slice(0, 16);

          const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

          const encryptedBlob = new Blob(
            [
              Buffer.from(pod.data.getPod.content, "base64"), // binary
            ],
            {
              type: "data/encrypted",
            }
          );
          // Decrypt the data
          const decrypted = Buffer.concat([
            decipher.update(
              Buffer.from(await encryptedBlob.arrayBuffer()) // binary
            ),
            decipher.final(),
          ]);

          // save decrypted file
          const blob = new Blob([decrypted], { type: parsed_metadata.type });
          let suffix;
          switch (parsed_metadata.type) {
            case "text/plain":
              suffix = ".txt";
              break;
            case "image/png":
              suffix = ".png";
              break;
            case "image/jpeg":
              suffix = ".jpg";
              break;
            case "image/jpg":
              suffix = ".jpg";
              break;
            case "video/mp4":
              suffix = ".mp4";
              break;
            case "image/gif":
              suffix = ".gif";
              break;
            default:
              logger.error("Unknown file type", parsed_metadata.type);
              break;
          }

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          document.body.appendChild(a);
          // a.style = "display: none";
          a.href = url;
          a.download = parsed_metadata.title.endsWith(suffix)
            ? parsed_metadata.title
            : parsed_metadata.title + suffix;
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

          // download pod data
        }}
      >
        Download
      </SimpleButton>

      <SwapFile id={id} />
    </div>
  );
}
