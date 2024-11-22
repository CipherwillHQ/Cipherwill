"use client";
import { useMutation } from "@apollo/client";
import CREATE_METAMODEL from "../../../../graphql/ops/app/metamodel/mutations/CREATE_METAMODEL";
import GET_METAMODELS from "../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import SimpleButton from "@/components/common/SimpleButton";

export default function CreateEmailAccount() {
  const [createEmailAccount] = useMutation(CREATE_METAMODEL, {
    refetchQueries: [
      {
        query: GET_METAMODELS,
        variables: {
          type: "EMAIL_ACCOUNT",
        },
      },
    ],
  });
  return (
    <SimpleButton
      onClick={() => {
        // create bank account
        createEmailAccount({
          variables: {
            type: "EMAIL_ACCOUNT",
            metadata: JSON.stringify({ name: "Untitled email account" }),
          },
        });
      }}
    >
      Add email
    </SimpleButton>
  );
}
