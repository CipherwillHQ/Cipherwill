// Displays owned file metadata and export controls.
// Owns download progress and the file details presentation.
// Does not perform file decryption or native save operations.
"use client";

import logger from "@/common/debug/logger";
import SimpleButton from "@/components/common/SimpleButton";
import { useSession } from "@/contexts/SessionContext";
import GET_POD from "@/graphql/ops/app/pod/queries/GET_POD";
import { useApolloClient } from "@apollo/client/react";
import toast from "react-hot-toast";
import GET_METAMODEL from "@/graphql/ops/app/metamodel/queries/GET_METAMODEL";
import { TbDownload, TbFile, TbShieldCheck } from "react-icons/tb";
import { useState } from "react";

import {
  FileDetailsProps,
  GetPodQuery,
  GetPodVariables,
  GetMetamodelQuery,
  GetMetamodelVariables,
} from "@/types/interfaces";
import { useQuery } from "@apollo/client/react";
import downloadStoredFile from "./downloadStoredFile";
import { bytesToReadable } from "@/common/storage/bytes_to_redable";


export default function PodDetails({ id }: FileDetailsProps) {
  const client = useApolloClient();
  const { session } = useSession();
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: metamodelData, loading: metamodelLoading } = useQuery<
    GetMetamodelQuery,
    GetMetamodelVariables
  >(GET_METAMODEL, {
    variables: { id },
  });

  const { data: podData, loading: podLoading } = useQuery<
    GetPodQuery,
    GetPodVariables
  >(GET_POD, {
    variables: { ref_id: id },
  });

  if (metamodelLoading || podLoading) {
    return (
      <div className="bg-secondary border border-default rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!metamodelData?.getMetamodel || !podData?.getPod) {
    return (
      <div className="bg-secondary border border-default rounded-lg p-6">
        <div className="text-red-500">Failed to load file details</div>
      </div>
    );
  }

  const parsedMetadata = JSON.parse(metamodelData.getMetamodel.metadata);
  const parsedPod = podData.getPod;

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "🖼️";
    if (type.startsWith("video/")) return "🎥";
    if (type === "text/plain") return "📄";
    return "🗎";
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
            File size is {bytesToReadable(parseInt(parsedPod.size || "0"))}
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
                if (await downloadStoredFile({client, session, id})) toast.success("File downloaded successfully!");
              } catch (error) {
                logger.error("Error while downloading data", error);
                toast.error("Unable to download this file. Please try again.");
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

    </div>
  );
}
