"use client";

import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import GET_GRANTED_METAMODEL from "@/graphql/ops/app/executor/metamodels/GET_GRANTED_METAMODEL";
import GET_GRANTED_POD from "@/graphql/ops/app/executor/access/queries/GET_GRANTED_POD";
import getTimeAgo from "@/common/time/getTimeAgo";
import DownloadGrantedObject from "./DownloadGrantedObject";
import { bytesToReadable } from "@/common/storage/bytes_to_redable";
import { TbFile, TbShieldCheck } from "react-icons/tb";
import type { 
  GetGrantedMetamodelQuery, 
  GetGrantedMetamodelVariables,
  GetGrantedPodQuery,
  GetGrantedPodVariables,
} from "@/types/interfaces/metamodel";

type StorageObjectMetadata = {
  title?: string;
  type?: string;
  file_ext?: string;
};

function parseStorageMetadata(metadata: string): StorageObjectMetadata {
  try {
    const parsed = JSON.parse(metadata) as StorageObjectMetadata;
    return parsed || {};
  } catch {
    return {};
  }
}

function getFileTypeDisplay(type?: string): string {
  if (!type) return "File";
  if (type.startsWith("image/")) return "Image";
  if (type.startsWith("video/")) return "Video";
  if (type === "text/plain") return "Text Document";
  if (type === "application/pdf") return "PDF Document";
  return "File";
}

export default function ExecutorObjectView() {
  const params = useParams() as { id: string; model_id: string };
  const access_id: string = params?.id;
  const object_id: string = params?.model_id;

  const {
    data: granted_metamodel,
    loading: metamodelLoading,
    error: metamodelError,
  } = useQuery<GetGrantedMetamodelQuery, GetGrantedMetamodelVariables>(
    GET_GRANTED_METAMODEL,
    {
      variables: {
        access_id,
        model_id: object_id,
      },
    }
  );

  const {
    data: granted_pod,
    loading: podLoading,
    error: podError,
  } = useQuery<GetGrantedPodQuery, GetGrantedPodVariables>(GET_GRANTED_POD, {
    variables: {
      access_id,
      ref_id: object_id,
    },
  });

  if (metamodelLoading || podLoading) return <div>Loading...</div>;
  if (metamodelError) return <div>Error: {metamodelError.message}</div>;
  if (podError) return <div>Error: {podError.message}</div>;
  if (!granted_metamodel?.getGrantedMetamodel) return <div>No data available</div>;

  const keyMetadata = granted_metamodel.getGrantedMetamodel;
  const parsed_data = parseStorageMetadata(
    granted_metamodel.getGrantedMetamodel.metadata
  );
  const fileTitle = parsed_data.title || "Untitled";
  const mimeType = parsed_data.type || "Unknown";
  const fileExt = parsed_data.file_ext
    ? `.${String(parsed_data.file_ext).replace(/^\./, "")}`
    : "Not available";
  const fileTypeDisplay = getFileTypeDisplay(parsed_data.type);
  const fileSize = granted_pod?.getGrantedPod?.size
    ? bytesToReadable(parseInt(granted_pod.getGrantedPod.size || "0", 10))
    : "Unknown size";

  return (
    <div className="w-full p-2">
      <div className="bg-secondary border border-default rounded-lg p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="h-12 w-12 rounded-xl border border-default flex items-center justify-center">
            <TbFile size={22} />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold mb-2">{fileTitle}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
              <span>{fileTypeDisplay}</span>
              <span>•</span>
              <span>File size is {fileSize}</span>
              <span>•</span>
              <TbShieldCheck size={16} className="text-primary" />
              <span>Encrypted & Secure</span>
            </div>
          </div>
        </div>

        <div className="border-t border-default pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">MIME Type</div>
              <div className="font-medium break-all">{mimeType}</div>
            </div>
            <div>
              <div className="text-gray-500">Saved Extension</div>
              <div className="font-medium">{fileExt}</div>
            </div>
            {keyMetadata && (
              <>
                <div>
                  <div className="text-gray-500">Created</div>
                  <div className="font-medium">
                    {getTimeAgo(parseInt(keyMetadata.created_at, 10))}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Updated</div>
                  <div className="font-medium">
                    {getTimeAgo(parseInt(keyMetadata.updated_at, 10))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-6">
            <DownloadGrantedObject ref_id={object_id} access_id={access_id} />
          </div>
        </div>
      </div>
    </div>
  );
}
