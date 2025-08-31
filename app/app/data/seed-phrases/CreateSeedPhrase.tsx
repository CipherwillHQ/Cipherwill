"use client";
import { useMutation } from "@apollo/client/react";
import CREATE_METAMODEL from "../../../../graphql/ops/app/metamodel/mutations/CREATE_METAMODEL";
import GET_METAMODELS from "../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import SimpleButton from "@/components/common/SimpleButton";

export default function CreateSeedPhrase() {
  const [createSeedPhrase] = useMutation(CREATE_METAMODEL, {
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
    <SimpleButton
      onClick={() => {
        // create bank account
        createSeedPhrase({
          variables: {
            type: "SEED_PHRASE",
            metadata: JSON.stringify({ name: "Untitled seed phrase" }),
          },
        });
      }}
    >
      Add Seed Phrase
    </SimpleButton>
  );
}
