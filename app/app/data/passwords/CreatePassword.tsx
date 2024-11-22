"use client";
import { useMutation } from "@apollo/client";
import CREATE_METAMODEL from "../../../../graphql/ops/app/metamodel/mutations/CREATE_METAMODEL";
import GET_METAMODELS from "../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import SimpleButton from "@/components/common/SimpleButton";

export default function CreatePassword() {
  const [createPassword] = useMutation(CREATE_METAMODEL, {
    refetchQueries: [
      {
        query: GET_METAMODELS,
        variables: {
          type: "PASSWORD",
        },
      },
    ],
  });
  return (
    <SimpleButton
      onClick={() => {
        // create bank account
        createPassword({
          variables: {
            type: "PASSWORD",
            metadata: JSON.stringify({ name: "Untitled password" }),
          },
        });
      }}
    >
      Add password
    </SimpleButton>
  );
}
