import decrypt from "@/crypto/e0/decrypt";
import logger from "@/common/debug/logger";
import toast from "react-hot-toast";
import CryptoJS from "crypto-js";
import parseToLatestDataModel from "./parseToLatestDataModel";
import { ParsedPodContent, PodHookConfig } from "./types";
import type { GetPodQuery } from "@/types/interfaces/metamodel";

export function isPodNotFoundError(error: any) {
  return (
    error &&
    error.errors &&
    error.errors[0] &&
    error.errors[0].extensions.code === "POD_NOT_FOUND"
  );
}

export function getPodContent(
  pod: { data?: GetPodQuery } | null | undefined
): string | null {
  if (!pod || !pod.data || !pod.data.getPod || !pod.data.getPod.content) {
    return null;
  }

  return pod.data.getPod.content;
}

export async function resolveDecryptionKey(
  encryptedKey: string,
  session: { privateKey: string }
): Promise<string> {
  if (!encryptedKey.startsWith("{")) {
    return encryptedKey;
  }

  const parsedData = JSON.parse(encryptedKey);
  if (parsedData.type === "E0") {
    return decrypt(
      session.privateKey,
      Buffer.from(parsedData.ciphertext, "base64"),
      Buffer.from(parsedData.ephemPublicKey, "base64"),
      Buffer.from(parsedData.iv, "base64"),
      Buffer.from(parsedData.mac, "base64")
    );
  }

  return "";
}

export function decryptPodJson(content: string, key: string) {
  try {
    return CryptoJS.AES.decrypt(content, key).toString(CryptoJS.enc.Utf8);
  } catch (error) {
    toast.error("Error while decrypting data");
    logger.error("Error while decrypting data", error);
    return undefined;
  }
}

export function parsePodJsonToModel<POD_DATA_TYPE>(
  json_string: string,
  config: PodHookConfig<POD_DATA_TYPE>
): ParsedPodContent<POD_DATA_TYPE> | null {
  const final_content: ParsedPodContent<POD_DATA_TYPE> = {
    type: config.TYPE,
    version: config.VERSION,
    data: {} as POD_DATA_TYPE,
  };

  if (!json_string.startsWith("{")) {
    return null;
  }

  const parsed_pod_data = JSON.parse(json_string);
  final_content.type = parsed_pod_data?.type || config.TYPE;
  final_content.version = parsed_pod_data?.version || "0.0.1";

  if (parsed_pod_data?.data) {
    final_content.data = parseToLatestDataModel({
      type: parsed_pod_data?.type || config.TYPE,
      data_version: parsed_pod_data?.version || "0.0.1",
      expected_version: config.VERSION,
      data: parsed_pod_data.data,
    }) as POD_DATA_TYPE;
  } else {
    final_content.data = {} as POD_DATA_TYPE;
  }

  return final_content;
}

export function pickAllowedPodData<POD_DATA_TYPE>(
  updated_data: POD_DATA_TYPE,
  data_sample: POD_DATA_TYPE
) {
  const final_data = {};
  const editable_data = updated_data as any;
  for (const key of Object.keys(data_sample as any)) {
    if (editable_data[key]) {
      final_data[key] = editable_data[key];
    }
  }
  return final_data;
}
