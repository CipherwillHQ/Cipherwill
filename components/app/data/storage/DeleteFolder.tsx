"use client";
import ConfirmationButton from "@/components/common/ConfirmationButton";
import DELETE_FOLDER from "@/graphql/ops/app/storage/mutations/DELETE_FOLDER";
import GET_FOLDERS from "@/graphql/ops/app/storage/queries/GET_FOLDERS";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { DeleteFolderMutation, DeleteFolderVariables } from "@/types/interfaces/metamodel";

export default function DeleteFolder({
  id,
  folder_id,
}: {
  id?: string;
  folder_id?: string;
}) {
  const router = useRouter();
  const [deleteFolder, { loading }] = useMutation<DeleteFolderMutation, DeleteFolderVariables>(DELETE_FOLDER, {
    variables: {
      id,
    },
    refetchQueries: [
      {
        query: GET_FOLDERS,
        variables:
          folder_id !== "root"
            ? {
                folder_id,
              }
            : {},
      },
    ],
  });

  return (
    <ConfirmationButton
      className="hover:underline"
      onConfirm={() => {
        if (loading) {
          toast.error("Please wait for the folder to be deleted");
          return;
        }
        deleteFolder({
          variables: {
            id: id!,
          },
        }).then((data) => {
          if (!data.data?.deleteFolder?.folder_id) {
            toast.error("Failed to delete folder");
            return;
          }
          const parent_folder_id = data.data.deleteFolder.folder_id;
          if (parent_folder_id === "root") {
            router.push("/app/data/storage");
            return;
          }
          router.push(`/app/data/storage/folder/${parent_folder_id}`);
        }).catch((error) => {
          toast.error("Error deleting folder");
          console.error("Delete folder error:", error);
        });
      }}
    >
      <div className="flex items-center justify-center gap-2">
        {loading && (
          <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-blue-500 mr-2" />
        )}
        Delete Folder
      </div>
    </ConfirmationButton>
  );
}
