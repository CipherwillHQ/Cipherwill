"use client";

import logger from "@/common/debug/logger";
import SimpleButton from "@/components/common/SimpleButton";
import { useSession } from "@/contexts/SessionContext";
import GET_POD from "@/graphql/ops/app/pod/queries/GET_POD";
import { useApolloClient } from "@apollo/client";
import toast from "react-hot-toast";
import crypto from "crypto";
import GET_KEY_BY_REF_ID from "@/graphql/ops/app/key/Queries/GET_KEY_BY_REF_ID";
import GET_METAMODEL from "@/graphql/ops/app/metamodel/queries/GET_METAMODEL";
import GET_GRANTED_METAMODEL from "@/graphql/ops/app/executor/metamodels/GET_GRANTED_METAMODEL";
import GET_BENEFICIARY_ENCRYPTION_KEY from "@/graphql/ops/app/executor/access/queries/GET_BENEFICIARY_ENCRYPTION_KEY";
import get_pod_decryption_key from "@/common/executor/data/get_pod_decryption_key";

export default function DownloadGrantedObject({
  access_id,
  ref_id,
}: {
  access_id: string;
  ref_id: string;
}) {
  const { session } = useSession();
  const client = useApolloClient();
  return (
    <SimpleButton
      onClick={async () => {
        toast.success("Downloading object... Please wait");
        // download decryption key
        const encryption_key = await client.query({
          query: GET_KEY_BY_REF_ID,
          fetchPolicy: "network-only",
          variables: session
            ? {
                ref_id: ref_id,
                publicKey: session.publicKey,
              }
            : {
                ref_id: ref_id,
                publicKey: "null",
              },
        });

        // get time capsule private key to decrypt data
        const { data: beneficairy_encryption_key } = await client.query({
          query: GET_BENEFICIARY_ENCRYPTION_KEY,
          variables: {
            id: access_id,
          },
        });
        if (!beneficairy_encryption_key.getBeneficiaryEncryptionKey) {
          toast.error("You do not have access key to decrypt this data");
          return;
        }
        const pod_decryption_key = await get_pod_decryption_key({
          encrypted_key: encryption_key.data.getKeyByRefId.key,
          time_capsule_private_key:
            beneficairy_encryption_key.getBeneficiaryEncryptionKey,
          current_session_private_key: session?session.privateKey:null,
        });

        if (pod_decryption_key.length < 16) {
          toast.error("Invalid encryption key");
          return;
        }

        const metamodel_response = await client.query({
          query: GET_GRANTED_METAMODEL,
          fetchPolicy: "network-only",
          variables: {
            access_id: access_id,
            model_id: ref_id,
          },
        });
        const metamodel = metamodel_response.data.getGrantedMetamodel;
        const parsed_metadata = JSON.parse(metamodel.metadata);
        if (!parsed_metadata || parsed_metadata.title === undefined) {
          toast.error("No title found");

          return;
        }

        // start encrypted object download
        let pod;
        try {
          pod = await client.query({
            query: GET_POD,
            fetchPolicy: "network-only",
            variables: {
              ref_id: ref_id,
            },
          });
        } catch (error) {
          toast.error("Error while downloading data");
          logger.error("Error while downloading data", error);
          return;
        }
        const key = pod_decryption_key.slice(16);
        const iv = pod_decryption_key.slice(0, 16);

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
        a.href = url;
        a.download = parsed_metadata.title.endsWith(suffix)
          ? parsed_metadata.title
          : parsed_metadata.title + suffix;
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }}
    >
      Download Object
    </SimpleButton>
  );
}
