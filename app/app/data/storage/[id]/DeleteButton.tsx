"use client";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import DELETE_METAMODEL from "../../../../../graphql/ops/app/metamodel/mutations/DELETE_METAMODEL";
import GET_METAMODELS from "../../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import ConfirmationButton from "../../../../../components/common/ConfirmationButton";

export default function DeleteButton({ id, folder_id }) {
  const router = useRouter();
  const [deleteFile] = useMutation(DELETE_METAMODEL, {
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
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-sm w-full mt-2"
      onConfirm={async () => {
        await deleteFile({
          variables: {
            id,
          },
        }).then((delete_res) => {
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
        });
      }}
    >
      Delete file
    </ConfirmationButton>
  );
}
