import { ApolloClient } from "@apollo/client";
import { DataItem, EncryptionKeys, Key } from "./types";
import AES from "crypto-js/aes";
import crypto from "crypto";
import logger from "../debug/logger";
import toast from "react-hot-toast";
import UPDATE_POD from "@/graphql/ops/app/pod/mutations/UPDATE_POD";
import GET_PRESIGNED_POD_UPLOAD_URL from "@/graphql/ops/app/pod/mutations/GET_PRESIGNED_POD_UPLOAD_URL";
import COMPLETED_POD_UPLOAD from "@/graphql/ops/app/pod/mutations/COMPLETED_POD_UPLOAD";

async function get_presigned_url(
  client: ApolloClient,
  data_model_version: string,
  ref_id: string,
  mime_type: string,
  allowed_space: number
): Promise<string> {
  const res = await client.mutate({
    mutation: GET_PRESIGNED_POD_UPLOAD_URL,
    variables: {
      data_model_version,
      ref_id,
      mime_type,
      allowed_space,
    },
  });
  return (res.data as any).getPresignedPodUploadUrl;
}

async function upload_via_presigned_url(
  url: string,
  file: Blob
): Promise<void> {
  const response = await fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });
  if (!response.ok) {
    throw new Error(
      `Failed to upload file: ${response.status} ${response.statusText}`
    );
  }
}

async function inform_backend_of_upload(
  client: ApolloClient,
  ref_id: string
): Promise<void> {
  const res = await client.mutate({
    mutation: COMPLETED_POD_UPLOAD,
    variables: {
      ref_id,
    },
  });
  if (!(res.data as any).completedPodUpload) {
    toast.error("Error while informing backend of completed upload");
    logger.error("Error while informing backend of completed upload");
    return;
  }
}

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
    const encrypted_file = await create_encrypted_file({
      encryption_keys,
      item,
    });
    if (encrypted_file === undefined) {
      logger.error(`Error while encrypting file`);
      toast.error("Error while encrypting file");
      return;
    }
    const mime_type = encrypted_file.type;
    if (mime_type === "text/plain") {
      // use backend upload

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
    } else {
      // use direct r2 upload

      const allowed_space = encrypted_file.size;
      // upload directly to r2 using pre-signed url and update details on backend
      const upload_url = await get_presigned_url(
        client,
        item.data_model_version,
        item.ref_id,
        mime_type,
        allowed_space
      );
      try {
        await upload_via_presigned_url(upload_url, encrypted_file);
        logger.info(
          `Uploaded encrypted file via presigned url for ${item.ref_id}`
        );
        await inform_backend_of_upload(client, item.ref_id);
      } catch (error) {
        logger.error(
          `Error while uploading encrypted file via presigned url`,
          error
        );
        toast.error("Error while uploading encrypted file");
        return;
      }
    }
  }
}
