import { ApolloClient } from "@apollo/client";
import { DataItem, EncryptionKeys } from "./types";
import AES from "crypto-js/aes";
import crypto from "crypto";
import logger from "../debug/logger";
import toast from "react-hot-toast";
import CREATE_UPLOAD_POD_SESSION from "@/graphql/ops/app/pod/mutations/CREATE_UPLOAD_POD_SESSION";
import UPLOAD_SESSION_POD from "@/graphql/ops/app/pod/mutations/UPLOAD_SESSION_POD";

type UploadSessionType = "STORAGE_POD" | "TEXT_POD";

type UploadSessionResponse = {
  id: string;
  status: "CREATED" | "PODS_UPLOADED" | "KEYS_UPLOADED" | "COMPLETED";
  type: UploadSessionType;
  presigned_upload_url: string | null;
};

export type PreparedPodUploadSession = {
  ref_id: string;
  session_id: string;
  type: UploadSessionType;
};

async function create_upload_session(
  client: ApolloClient,
  data_model_version: string,
  ref_id: string,
  required_space: number
): Promise<UploadSessionResponse> {
  const res = await client.mutate({
    mutation: CREATE_UPLOAD_POD_SESSION,
    variables: {
      data_model_version,
      ref_id,
      required_space,
    },
  });
  return (res.data as any).createUploadPodSession;
}

async function upload_text_pod(
  client: ApolloClient,
  session_id: string,
  file: Blob
): Promise<void> {
  await client.mutate({
    mutation: UPLOAD_SESSION_POD,
    variables: {
      session_id,
      file,
    },
    context: {
      headers: {
        "apollo-require-preflight": true,
      },
    },
  });
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
    const error = new Error(`Encryption key not found for ref_id ${item.ref_id}`);
    logger.error(`Encrpytion key not found for data item`, error);
    toast.error("Encrpytion key not found for data item");
    throw error;
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
}): Promise<PreparedPodUploadSession[]> {
  const upload_sessions: PreparedPodUploadSession[] = [];
  for await (const item of data_items) {
    // encrypt data with random key
    const encrypted_file = await create_encrypted_file({
      encryption_keys,
      item,
    });
    try {
      const upload_session = await create_upload_session(
        client,
        item.data_model_version,
        item.ref_id,
        encrypted_file.size
      );

      if (upload_session.type === "TEXT_POD") {
        await upload_text_pod(client, upload_session.id, encrypted_file);
        logger.info(`Encrypted text pod uploaded for ${item.ref_id}`);
      } else {
        if (!upload_session.presigned_upload_url) {
          throw new Error(
            `Missing presigned upload URL for storage pod ${item.ref_id}`
          );
        }
        await upload_via_presigned_url(
          upload_session.presigned_upload_url,
          encrypted_file
        );
        logger.info(
          `Uploaded encrypted file via presigned url for ${item.ref_id}`
        );
      }

      upload_sessions.push({
        ref_id: item.ref_id,
        session_id: upload_session.id,
        type: upload_session.type,
      });
    } catch (error) {
      logger.error("Error while staging encrypted pod upload", error);
      toast.error("Error while uploading encrypted file");
      throw error;
    }
  }
  return upload_sessions;
}
