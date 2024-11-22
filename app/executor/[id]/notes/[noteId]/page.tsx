"use client";

import { useApolloClient, useQuery } from "@apollo/client";
import getTimeAgo from "../../../../../common/time/getTimeAgo";
import { useSession } from "../../../../../contexts/SessionContext";
import { useState } from "react";
import decrypt from "../../../../../crypto/e0/decrypt";
import toast from "react-hot-toast";
import GET_BENEFICIARY_ENCRYPTION_KEY from "../../../../../graphql/ops/app/executor/access/queries/GET_BENEFICIARY_ENCRYPTION_KEY";
import logger from "../../../../../common/debug/logger";
import GET_KEY_BY_REF_ID from "../../../../../graphql/ops/app/key/Queries/GET_KEY_BY_REF_ID";
import CryptoJS from "crypto-js";
import GET_POD from "../../../../../graphql/ops/app/pod/queries/GET_POD";
import GET_GRANTED_METAMODEL from "../../../../../graphql/ops/app/executor/metamodels/GET_GRANTED_METAMODEL";
import { NOTE_TYPE } from "../../../../../types/pods/NOTE";

export default function DonorNoteView({ params }) {
  const access_id = params.id;
  const note_id = params.noteId;

  const { session } = useSession();
  const client = useApolloClient();
  const [decryptedValue, setDecryptedValue] = useState<NOTE_TYPE | string>(
    "loading..."
  );

  const { loading, error, data } = useQuery(GET_GRANTED_METAMODEL, {
    variables: {
      access_id,
      model_id: note_id,
    },
  });

  const {
    loading: data_loading,
    error: data_error,
    data: encrypted_data,
  } = useQuery(GET_KEY_BY_REF_ID, {
    variables: {
      ref_id: note_id,
      publicKey: session ? session.publicKey : null,
    },
    onCompleted: async (data) => {
      if (data && data.getKeyByRefId) {
        // get private key to decrypt data
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
        const encrypted_key = data.getKeyByRefId.key;
        const decrypted_key = await decrypt_value(
          encrypted_key,
          beneficairy_encryption_key.getBeneficiaryEncryptionKey
        );
        let pod;
        try {
          pod = await client.query({
            query: GET_POD,
            fetchPolicy: "network-only",
            variables: {
              ref_id: note_id,
            },
          });
        } catch (error) {
          if (error.graphQLErrors[0].extensions.code === "POD_NOT_FOUND") {
            return;
          } else {
            throw error;
          }
        }
        if (!pod) return;
        const content = pod.data.getPod.content;
        const final_content = JSON.parse(
          CryptoJS.AES.decrypt(content, decrypted_key).toString(
            CryptoJS.enc.Utf8
          )
        );
        if (final_content.type === "note") {
          setDecryptedValue(final_content.data);
        }
      } else {
        setDecryptedValue("You do not have access to this data");
      }
      if (data && data.getKeyByRefId === null) {
        setDecryptedValue("You do not have access to this data");
      }
    },
  });

  async function decrypt_value(data: string, accessPrivateKey: string) {
    const initial_parsed = JSON.parse(data);

    switch (initial_parsed.type) {
      case "E0":
        const e0_value = JSON.parse(
          await decrypt(
            session.privateKey,
            Buffer.from(initial_parsed.ciphertext, "base64"),
            Buffer.from(initial_parsed.ephemPublicKey, "base64"),
            Buffer.from(initial_parsed.iv, "base64"),
            Buffer.from(initial_parsed.mac, "base64")
          )
        );
        if (!e0_value) {
          toast.error("Decryption failed by session key");
        }

        if (e0_value.type === "E1") {
          const e1_value = await decrypt(
            accessPrivateKey,
            Buffer.from(e0_value.ciphertext, "base64"),
            Buffer.from(e0_value.ephemPublicKey, "base64"),
            Buffer.from(e0_value.iv, "base64"),
            Buffer.from(e0_value.mac, "base64")
          );
          if (!e1_value) {
            toast.error("Decryption failed by session key");
            throw new Error("Decryption failed by session key");
          }
          return e1_value;
        }
        break;
      case "E1":
        const e1_value = await decrypt(
          accessPrivateKey,
          Buffer.from(initial_parsed.ciphertext, "base64"),
          Buffer.from(initial_parsed.ephemPublicKey, "base64"),
          Buffer.from(initial_parsed.iv, "base64"),
          Buffer.from(initial_parsed.mac, "base64")
        );
        if (!e1_value) {
          toast.error("Decryption failed by session key");
          throw new Error("Decryption failed by session key");
        }
        return e1_value;
        break;
      default:
        logger.error("decryption failed", initial_parsed);
        return "xxx-xxx";
    }
  }

  if (loading || data_loading) return <p>Loading...</p>;
  if (error || data_error)
    return (
      <div>
        Error : {JSON.stringify(error)}
        <br />
        {JSON.stringify(data_error)}
      </div>
    );

  const parsed_data = JSON.parse(data.getGrantedMetamodel.metadata);

  return (
    <div className="w-full">
      <div className="p-2">
        Title : {parsed_data.title || "Untitled"}
        <br />
        {encrypted_data && encrypted_data.getDataByRefId && (
          <div>
            Created At:{" "}
            {getTimeAgo(parseInt(data.getGrantedMetamodel.created_at))}
            <br />
            Updated At :{" "}
            {getTimeAgo(parseInt(encrypted_data.getDataByRefId.updated_at))}
          </div>
        )}
        <div className="border-b my-2" />
        Content :
        <br />
        <div
          className="whitespace-pre-line bg-secondary p-2"
          data-cy="donor-note-content"
        >
          {typeof decryptedValue === "string" ? (
            decryptedValue
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: decryptedValue.content,
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
}
