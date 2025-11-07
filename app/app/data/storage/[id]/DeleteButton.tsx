"use client";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import DELETE_METAMODEL from "../../../../../graphql/ops/app/metamodel/mutations/DELETE_METAMODEL";
import GET_METAMODELS from "../../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import ConfirmationButton from "../../../../../components/common/ConfirmationButton";
import { DeleteMetamodelMutation, DeleteMetamodelVariables } from "../../../../../types/interfaces";

interface DeleteButtonProps {
  id: string;
  folder_id: string;
}

export default function DeleteButton({ id, folder_id }: DeleteButtonProps) {
  const router = useRouter();
  const [deleteFile] = useMutation<DeleteMetamodelMutation, DeleteMetamodelVariables>(DELETE_METAMODEL, {
    refetchQueries: [
      {
        query: GET_METAMODELS,
        variables: {
          type: "FILE",
          folder_id: folder_id !== "root" ? folder_id : undefined,
        },
      },
    ],
  });
  return (
    <ConfirmationButton
    className="text-red-700 dark:text-red-400 font-semibold"
    
      onConfirm={async () => {
        await deleteFile({
          variables: {
            id,
          },
        }).then((delete_res) => {
          if (!delete_res.data) return;
          
          if (delete_res.data.deleteMetamodel.folder_id === "root") {
            router.replace("/app/data/storage");
          } else if (
            delete_res.data.deleteMetamodel.folder_id === "documents"
          ) {
            router.replace("/app/data/documents");
          } else {
            router.replace(
              `/app/data/storage/folder/${delete_res.data.deleteMetamodel.folder_id}`
            );
          }
        }).catch((error) => {
          console.error('Failed to delete file:', error);
        });
      }}
    >
      Delete file
    </ConfirmationButton>
  );
}
