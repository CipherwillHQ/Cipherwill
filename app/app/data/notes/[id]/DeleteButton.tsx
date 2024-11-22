"use client";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import DELETE_METAMODEL from "../../../../../graphql/ops/app/metamodel/mutations/DELETE_METAMODEL";
import GET_METAMODELS from "../../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import ConfirmationButton from "../../../../../components/common/ConfirmationButton";

export default function DeleteButton({ id }) {
  const router = useRouter();
  const [deleteBankAccount] = useMutation(DELETE_METAMODEL, {
    refetchQueries: [
      {
        query: GET_METAMODELS,
        variables: {
          type: "NOTE",
        },
      },
    ],
  });
  return (
    <ConfirmationButton
      className="p-2 w-full text-left"
      onConfirm={async () => {
        await deleteBankAccount({
          variables: {
            id,
          },
        });
        router.replace("/app/data/notes");
      }}
    >
      Delete permanently
    </ConfirmationButton>
  );
}
