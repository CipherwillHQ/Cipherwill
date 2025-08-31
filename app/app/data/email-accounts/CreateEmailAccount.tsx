"use client";
import { useMutation } from "@apollo/client/react";
import CREATE_METAMODEL from "../../../../graphql/ops/app/metamodel/mutations/CREATE_METAMODEL";
import GET_METAMODELS from "../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import SimpleButton from "@/components/common/SimpleButton";
import { CreateMetamodelMutation, CreateMetamodelVariables, GetMetamodelsVariables } from "../../../../types/interfaces";
import { stringifyMetamodelMetadata } from "../../../../common/metamodel/utils";

export default function CreateEmailAccount() {
  const [createEmailAccount] = useMutation<CreateMetamodelMutation, CreateMetamodelVariables>(
    CREATE_METAMODEL,
    {
      refetchQueries: [
        {
          query: GET_METAMODELS,
          variables: {
            type: "EMAIL_ACCOUNT",
          } as GetMetamodelsVariables,
        },
      ],
    }
  );
  
  return (
    <SimpleButton
      onClick={() => {
        // create email account
        createEmailAccount({
          variables: {
            type: "EMAIL_ACCOUNT",
            metadata: stringifyMetamodelMetadata({ name: "Untitled email account" }),
          },
        });
      }}
    >
      Add email
    </SimpleButton>
  );
}
