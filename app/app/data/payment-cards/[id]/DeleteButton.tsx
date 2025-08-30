"use client";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import DELETE_METAMODEL from "../../../../../graphql/ops/app/metamodel/mutations/DELETE_METAMODEL";
import GET_METAMODELS from "../../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import ConfirmationButton from "../../../../../components/common/ConfirmationButton";
import { DeleteMetamodelMutation, DeleteMetamodelVariables } from "../../../../../types/interfaces";

interface DeleteButtonProps {
  id: string;
}

export default function DeleteButton({ id }: DeleteButtonProps) {
  const router = useRouter();
  const [deleteCard] = useMutation<DeleteMetamodelMutation, DeleteMetamodelVariables>(DELETE_METAMODEL, {
    refetchQueries: [
      {
        query: GET_METAMODELS,
        variables: {
          type: "PAYMENT_CARD",
        },
      },
    ],
  });
  return (
    <ConfirmationButton
      className="text-red-500 hover:underline font-medium py-2 px-4 rounded-sm w-full"
      onConfirm={async () => {
        await deleteCard({
          variables: {
            id,
          },
        });
        router.replace("/app/data/payment-cards");
      }}
    >
      Delete
    </ConfirmationButton>
  );
}
