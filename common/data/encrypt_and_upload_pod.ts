import { ApolloClient } from "@apollo/client";
import { DataItem, EncryptionKeys, Key } from "./types";
import AES from "crypto-js/aes";
import crypto from "crypto";
import logger from "../debug/logger";
import toast from "react-hot-toast";
import UPDATE_POD from "@/graphql/ops/app/pod/mutations/UPDATE_POD";

async function create_encrypted_file({
  encryption_keys,
  item,
}: {
  encryption_keys: EncryptionKeys;
  item: any;
}) {
  const encryption_key = encryption_keys[item.ref_id];
  if (!encryption_key) {
    logger.error(`Encrpytion key not found for data item`);
    toast.error("Encrpytion key not found for data item");
    return;
  }
  let encrypted_file;
  if (typeof item.data === "string") {
    const file_data = AES.encrypt(item.data, encryption_key.key).toString();
    encrypted_file = new Blob([file_data], {
      type: "text/plain",
    });
  } else {
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      encryption_key.key.slice(16),
      encryption_key.key.slice(0, 16)
    );
    const encrypted = Buffer.concat([
      cipher.update(
        new Uint8Array(
          await item.data.arrayBuffer() // binary
        ) // 8 bit unsigned integer
      ),
      cipher.final(),
    ]);
    encrypted_file = new Blob([encrypted], {
      type: "data/encrypted",
    });
  }
  return encrypted_file;
}

export default async function encrypt_and_upload_pod({
  encryption_keys,
  data_items,
  client,
}: {
  encryption_keys: EncryptionKeys;
  data_items: DataItem[];
  client: ApolloClient;
}) {
  for await (const item of data_items) {
    // encrypt data with random key
    const encrypted_file = await create_encrypted_file({ encryption_keys, item });
    if (encrypted_file === undefined) {
      logger.error(`Error while encrypting file`);
      toast.error("Error while encrypting file");
      return;
    }
    // upload encrypted pod
    await client
      .mutate({
        mutation: UPDATE_POD,
        variables: {
          data_model_version: item.data_model_version,
          ref_id: item.ref_id,
          file: encrypted_file,
        },
        context: {
          headers: {
            "apollo-require-preflight": true,
          },
        },
      })
      .then((res) => {
        logger.info(`Encrypted file uploaded for ${item.ref_id}`);
      })
      .catch((error) => {
        logger.error(`Error while uploading encrypted file`, error);
      });
  }
}
