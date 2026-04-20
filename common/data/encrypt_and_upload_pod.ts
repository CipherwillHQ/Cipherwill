import { ApolloClient } from "@apollo/client";
import { DataItem, EncryptionKeys } from "./types";
import AES from "crypto-js/aes";
import crypto from "crypto";
import logger from "../debug/logger";
import toast from "react-hot-toast";
import GET_PRESIGNED_POD_UPLOAD_URL from "@/graphql/ops/app/pod/mutations/GET_PRESIGNED_POD_UPLOAD_URL";

export type PodUploadCommitPayload = {
  upload_id?: string;
  ref_id: string;
  data_model_version: string;
  mode: "TEXT" | "STORAGE";
  encrypted_text?: string;
};

type PresignedUploadPayload = {
  upload_id: string;
  upload_url: string;
};

async function get_presigned_url(
  client: ApolloClient,
  data_model_version: string,
  ref_id: string,
  mime_type: string,
  allowed_space: number
): Promise<PresignedUploadPayload> {
  const res = await client.mutate({
    mutation: GET_PRESIGNED_POD_UPLOAD_URL,
    variables: {
      data_model_version,
      ref_id,
      mime_type,
      allowed_space,
    },
  });
  const payload = (res.data as any)?.getPresignedPodUploadUrl;
  if (!payload?.upload_id || !payload?.upload_url) {
    throw new Error("Invalid presigned upload payload");
  }
  return payload;
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

async function create_encrypted_file({
  encryption_keys,
  item,
}: {
  encryption_keys: EncryptionKeys;
  item: any;
}): Promise<Blob> {
  const encryption_key = encryption_keys[item.ref_id];
  if (!encryption_key) {
    throw new Error("Encryption key not found for data item");
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
}): Promise<PodUploadCommitPayload[]> {
  const uploaded_pods: PodUploadCommitPayload[] = [];
  for await (const item of data_items) {
    try {
      // encrypt data with random key
      const encrypted_file = await create_encrypted_file({
        encryption_keys,
        item,
      });
      const mime_type = encrypted_file.type;
      if (mime_type === "text/plain") {
        const encrypted_text = await encrypted_file.text();
        if (!encrypted_text) {
          throw new Error("Encrypted text payload is empty");
        }
        uploaded_pods.push({
          ref_id: item.ref_id,
          data_model_version: item.data_model_version,
          mode: "TEXT",
          encrypted_text,
        });
        logger.info(`Prepared encrypted text pod for ${item.ref_id}`);
      } else {
        // use direct r2 upload
        const allowed_space = encrypted_file.size;
        // upload directly to r2 using pre-signed url
        const presigned_payload = await get_presigned_url(
          client,
          item.data_model_version,
          item.ref_id,
          mime_type,
          allowed_space
        );
        await upload_via_presigned_url(
          presigned_payload.upload_url,
          encrypted_file
        );
        logger.info(
          `Uploaded encrypted file via presigned url for ${item.ref_id}`
        );
        uploaded_pods.push({
          upload_id: presigned_payload.upload_id,
          ref_id: item.ref_id,
          data_model_version: item.data_model_version,
          mode: "STORAGE",
        });
      }
    } catch (error) {
      logger.error(`Error while preparing encrypted pod upload`, error);
      toast.error("Error while uploading encrypted file");
      throw error;
    }
  }
  return uploaded_pods;
}
