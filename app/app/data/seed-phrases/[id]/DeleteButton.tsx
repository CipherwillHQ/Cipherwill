"use client";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import DELETE_METAMODEL from "../../../../../graphql/ops/app/metamodel/mutations/DELETE_METAMODEL";
import GET_METAMODELS from "../../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import ConfirmationButton from "../../../../../components/common/ConfirmationButton";

export default function DeleteButton({ id }) {
  const router = useRouter();
  const [deleteSeedPhrase] = useMutation(DELETE_METAMODEL, {
    refetchQueries: [
      {
        query: GET_METAMODELS,
        variables: {
          type: "SEED_PHRASE",
        },
      },
    ],
  });
  return (
    <ConfirmationButton
      className="text-red-500 hover:underline font-medium py-2 px-4 rounded w-full"
      onConfirm={async () => {
        await deleteSeedPhrase({
          variables: {
            id,
          },
        });
        router.replace("/app/data/seed-phrases");
      }}
    >
      Delete
    </ConfirmationButton>
  );
}
