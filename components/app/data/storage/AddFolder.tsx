"use client";
import SimpleButton from "@/components/common/SimpleButton";
import CREATE_FOLDER from "@/graphql/ops/app/storage/mutations/CREATE_FOLDER";
import GET_FOLDERS from "@/graphql/ops/app/storage/queries/GET_FOLDERS";
import { useMutation } from "@apollo/client/react";
import { useCallback } from "react";
import toast from "react-hot-toast";
import Popup from "reactjs-popup";

export default function AddFolder({ folder_id }: { folder_id?: string }) {
  const [createFolder, { loading }] = useMutation(CREATE_FOLDER, {
    variables: {
      folder_id,
    },
    refetchQueries: [
      {
        query: GET_FOLDERS,
        variables: {
          folder_id,
        },
      },
    ],
  });

  const submitFolder = useCallback(
    async (close: any) => {
      const folderName = (document.getElementById("folder-name") as any).value;
      if (!folderName) {
        toast.error("No folder name provided");
        return;
      }
      await createFolder({
        variables: {
          name: folderName,
        },
      });
      close();
    },
    [createFolder]
  );

  return (
    <Popup
      trigger={
        <div>
          <SimpleButton>Add Folder</SimpleButton>
        </div>
      }
      modal
    >
      {/* @ts-ignore */}
      {(close) => {
        return (
          <div className="flex flex-col gap-2 bg-white dark:bg-neutral-800 text-black dark:text-white p-2 rounded-md">
            Add folder
            <input
              type="text"
              placeholder="Folder name"
              id="folder-name"
              autoComplete="off"
              className="border border-default rounded-md p-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  if (loading) {
                    toast.error("Please wait for the folder to be created");
                    return;
                  }
                  submitFolder(close);
                }
              }}
            />
            <SimpleButton
              onClick={() => {
                if (loading) {
                  toast.error("Please wait for the folder to be created");
                  return;
                }
                submitFolder(close);
              }}
            >
              <div className="flex items-center justify-center gap-2">
                {loading && (
                  <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-blue-500 mr-2" />
                )}
                Add Folder
              </div>
            </SimpleButton>
          </div>
        );
      }}
    </Popup>
  );
}
