"use client";
import upload_pod_data from "@/common/data/upload_pod_data";
import logger from "@/common/debug/logger";
import SimpleButton from "@/components/common/SimpleButton";
import { useSession } from "@/contexts/SessionContext";
import CREATE_METAMODEL from "@/graphql/ops/app/metamodel/mutations/CREATE_METAMODEL";
import GET_METAMODELS from "@/graphql/ops/app/metamodel/queries/GET_METAMODELS";
import { useApolloClient, useMutation } from "@apollo/client";
import { useState } from "react";
import toast from "react-hot-toast";
import Popup from "reactjs-popup";

export default function AddFile({ folder_id }: { folder_id?: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const client = useApolloClient();
  const { session } = useSession();
  const [createFileModel] = useMutation(CREATE_METAMODEL, {
    variables: {
      type: "FILE",
      folder_id,
    },
    refetchQueries: [
      {
        query: GET_METAMODELS,
        variables: {
          type: "FILE",
          folder_id,
        },
      },
    ],
  });
  return (
    <Popup
      trigger={
        <div>
          <SimpleButton>Upload File</SimpleButton>
        </div>
      }
      modal
    >
      {/* @ts-ignore */}
      {(close) => {
        return (
          <div className="flex flex-col gap-2 bg-white dark:bg-neutral-800 text-black dark:text-white p-4">
            Upload file
            <input type="file" id="file-upload" />
            <SimpleButton
              onClick={async () => {
                if (isUploading) {
                  toast.error("Upload already in progress");
                  return;
                }
                setIsUploading(true);

                const file: File = (
                  document.getElementById("file-upload") as any
                ).files[0];
                if (!file) {
                  toast.error("No file selected");
                  setIsUploading(false);
                  return;
                }
                // create metamodel
                const new_model = await createFileModel({
                  variables: {
                    type: "FILE",
                    metadata: JSON.stringify({
                      title: file.name || "Untitled file",
                      type: file.type,
                    }),
                  },
                }).catch((error) => {
                  toast.error("Error while creating metamodel");
                  logger.error("Error while creating metamodel", error);
                  setIsUploading(false);
                  return;
                });
                if (!new_model) {
                  setIsUploading(false);
                  return;
                }
                // upload data
                await upload_pod_data({
                  data_items: [
                    {
                      ref_id: new_model.data.createMetamodel.id,
                      data_model_version: "0.0.1",
                      publicKey: session ? session.publicKey : undefined,
                      data: file,
                    },
                  ],
                  client,
                }).catch((error) => {
                  toast.error("Error while uploading data of file");
                  logger.error("Error while uploading data", error);
                  setIsUploading(false);
                  return;
                });
                // close popup
                close();
                setIsUploading(false);
              }}
            >
              <div className="flex items-center justify-center gap-2">
                {isUploading && (
                  <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-blue-500 mr-2" />
                )}
                Upload
              </div>
            </SimpleButton>
          </div>
        );
      }}
    </Popup>
  );
}
