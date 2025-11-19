"use client";

import logger from "@/common/debug/logger";
import SimpleButton from "@/components/common/SimpleButton";
import { useSession } from "@/contexts/SessionContext";
import decrypt from "@/crypto/e0/decrypt";
import GET_KEY_BY_REF_ID from "@/graphql/ops/app/key/Queries/GET_KEY_BY_REF_ID";
import GET_POD from "@/graphql/ops/app/pod/queries/GET_POD";
import { useApolloClient } from "@apollo/client/react";
import toast from "react-hot-toast";
import crypto from "crypto";
import SwapFile from "./SwapFile";
import GET_METAMODEL from "@/graphql/ops/app/metamodel/queries/GET_METAMODEL";
import { TbDownload, TbFile, TbShieldCheck } from "react-icons/tb";
import { useState } from "react";

import {
  GetKeyByRefIdQuery,
  GetKeyByRefIdVariables,
  GetPodQuery,
  GetPodVariables,
  GetMetamodelQuery,
  GetMetamodelVariables,
} from "@/types/interfaces";
import GET_POD_DOWNLOAD_URL from "@/graphql/ops/app/pod/queries/GET_POD_DOWNLOAD_URL";
import { useQuery } from "@apollo/client/react";

interface PodDetailsProps {
  id: string;
}

export default function PodDetails({ id }: PodDetailsProps) {
  const client = useApolloClient();
  const { session } = useSession();
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: metamodelData, loading: metamodelLoading } = useQuery<
    GetMetamodelQuery,
    GetMetamodelVariables
  >(GET_METAMODEL, {
    variables: { id },
  });

  if (metamodelLoading) {
    return (
      <div className="bg-secondary border border-default rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!metamodelData?.getMetamodel) {
    return (
      <div className="bg-secondary border border-default rounded-lg p-6">
        <div className="text-red-500">Failed to load file details</div>
      </div>
    );
  }

  const parsedMetadata = JSON.parse(metamodelData.getMetamodel.metadata);

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "🖼️";
    if (type.startsWith("video/")) return "🎥";
    if (type === "text/plain") return "📄";
    return "📁";
  };

  const getFileTypeDisplay = (type: string) => {
    if (type.startsWith("image/")) return "Image";
    if (type.startsWith("video/")) return "Video";
    if (type === "text/plain") return "Text Document";
    return "File";
  };

  return (
    <div className="bg-secondary border border-default rounded-lg p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="text-4xl">{getFileIcon(parsedMetadata.type)}</div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{parsedMetadata.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <TbFile size={16} />
            <span>{getFileTypeDisplay(parsedMetadata.type)}</span>
            <span>•</span>
            <TbShieldCheck size={16} className="text-primary" />
            <span>Encrypted & Secure</span>
          </div>
        </div>
      </div>

      <div className="border-t border-default pt-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="text-sm text-gray-600">
            <p className="mb-1">Download your encrypted file securely.</p>
            <p>File will be decrypted locally in your browser.</p>
          </div>
          <SimpleButton
            onClick={async () => {
              if (isDownloading) return;

              setIsDownloading(true);
              try {
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

                const download_pod_data_via_presigned_url = async ({
                  ref_id,
                }: {
                  ref_id: string;
                }) => {
                  const res = await client.query({
                    query: GET_POD_DOWNLOAD_URL,
                    fetchPolicy: "network-only",
                    variables: { ref_id },
                  });
                  const download_url = (res.data as any).getPodDownloadUrl;
                  const response = await fetch(download_url);
                  if (!response.ok) {
                    throw new Error(
                      `Failed to download file: ${response.status} ${response.statusText}`
                    );
                  }
                  const blob = await response.blob();
                  const arrayBuffer = await blob.arrayBuffer();
                  const buffer = Buffer.from(arrayBuffer);
                  return buffer.toString("base64");
                };

                const pod_data = await download_pod_data_via_presigned_url({
                  ref_id: id,
                });

                const key = random_key.slice(16);
                const iv = random_key.slice(0, 16);

                const decipher = crypto.createDecipheriv(
                  "aes-256-cbc",
                  key,
                  iv
                );

                const encryptedBlob = new Blob(
                  [
                    Buffer.from(pod_data, "base64"), // binary
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
                const blob = new Blob([decrypted], {
                  type: parsed_metadata.type,
                });
                // check if user already has the file extension saved in metadata
                let suffix = parsed_metadata.file_ext
                  ? "." + parsed_metadata.file_ext
                  : null;
                if (!suffix || suffix.length === 0) {
                  // if not already present, infer from mime type
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
                    case "unknown":
                      suffix = "";
                      break;
                    default:
                      // logger.error("Unknown file type", parsed_metadata.type);
                      suffix = "";
                      break;
                  }
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

                toast.success("File downloaded successfully!");
                // download pod data
              } catch (error) {
                logger.error("Error while downloading data", error);
                // Error toast is already shown above
              } finally {
                setIsDownloading(false);
              }
            }}
            disabled={isDownloading}
            className="flex items-center gap-2"
          >
            <TbDownload size={18} />
            {isDownloading ? "Downloading..." : "Download File"}
          </SimpleButton>
        </div>
      </div>

      {/* TODO: Degraded functionality */}
      {/* <SwapFile id={id} /> */}
    </div>
  );
}
