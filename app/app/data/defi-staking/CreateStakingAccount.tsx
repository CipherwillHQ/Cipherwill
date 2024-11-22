"use client";
import { useMutation } from "@apollo/client";
import CREATE_METAMODEL from "../../../../graphql/ops/app/metamodel/mutations/CREATE_METAMODEL";
import GET_METAMODELS from "../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import SimpleButton from "@/components/common/SimpleButton";

export default function CreateStakingAccount() {
  const [createStakingAccount] = useMutation(CREATE_METAMODEL, {
    refetchQueries: [
      {
        query: GET_METAMODELS,
        variables: {
          type: "DEFI_STAKING",
        },
      },
    ],
  });
  return (
    <SimpleButton
      onClick={() => {
        // create bank account
        createStakingAccount({
          variables: {
            type: "DEFI_STAKING",
            metadata: JSON.stringify({ name: "Untitled Staking" }),
          },
        });
      }}
    >
      Add staking account
    </SimpleButton>
  );
}
