// Downloads an owned vault file through the existing web-side key retrieval.
// Owns authorized queries and local decryption before native or browser export.
// Does not transfer encryption keys to the mobile wrapper.
import toast from "react-hot-toast";
import decrypt from "@/crypto/e0/decrypt";
import GET_KEY_BY_REF_ID from "@/graphql/ops/app/key/Queries/GET_KEY_BY_REF_ID";
import GET_METAMODEL from "@/graphql/ops/app/metamodel/queries/GET_METAMODEL";
import GET_POD_DOWNLOAD_URL from "@/graphql/ops/app/pod/queries/GET_POD_DOWNLOAD_URL";
import { fetchEncryptedFile } from "@/common/data/fetchEncryptedFile";
import { saveDecryptedFile } from "@/common/data/saveDecryptedFile";
import type { FileDownloadArgs, GetKeyByRefIdQuery, GetKeyByRefIdVariables, GetMetamodelQuery, GetMetamodelVariables } from "@/types/interfaces";

export default async function downloadStoredFile({client, session, id}: FileDownloadArgs) {
  const encryption_key = await client.query<
    GetKeyByRefIdQuery,
    GetKeyByRefIdVariables
  >({
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
      if (!session) throw Error("Unlock your vault again to download this file.");
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
    throw new Error("No key found");
  }
  if (random_key.length < 16) {
    toast.error("Invalid encryption key");
    throw new Error("Invalid encryption key");
  }

  const metamodel_response = await client.query<
    GetMetamodelQuery,
    GetMetamodelVariables
  >({
    query: GET_METAMODEL,
    fetchPolicy: "network-only",
    variables: {
      id,
    },
  });

  if (!metamodel_response.data) {
    toast.error("Failed to get file metadata");
    throw new Error("Failed to get file metadata");
  }

  const metamodel = metamodel_response.data.getMetamodel;
  const parsed_metadata = JSON.parse(metamodel.metadata);
  if (!parsed_metadata || parsed_metadata.title === undefined) {
    toast.error("No title found");
    throw new Error("No title found");
  }

  // let pod;
  // try {
  //   pod = await client.query<GetPodQuery, GetPodVariables>({
  //     query: GET_POD,
  //     fetchPolicy: "network-only",
  //     variables: {
  //       ref_id: id,
  //     },
  //   });
  // } catch (error) {
  //   toast.error("Error while downloading data");
  //   logger.error("Error while downloading data", error);
  //   return;
  // }

  // if (!pod.data) {
  //   toast.error("Failed to get pod data");
  //   return;
  // }

  // const pod_data = pod.data.getPod.content;

  const download = await client.query({query: GET_POD_DOWNLOAD_URL, fetchPolicy: "network-only", variables: {ref_id: id}});
  const pod_data = await fetchEncryptedFile((download.data as any).getPodDownloadUrl);
  return saveDecryptedFile(pod_data, random_key, parsed_metadata);
}
