"use client";
import { useMutation } from "@apollo/client/react";
import CREATE_METAMODEL from "../../../../graphql/ops/app/metamodel/mutations/CREATE_METAMODEL";
import GET_METAMODELS from "../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import SimpleButton from "@/components/common/SimpleButton";
import { CreateMetamodelMutation, CreateMetamodelVariables, GetMetamodelsVariables } from "../../../../types/interfaces";
import { stringifyMetamodelMetadata } from "../../../../common/metamodel/utils";

export default function CreatePassword() {
  const [createPassword] = useMutation<CreateMetamodelMutation, CreateMetamodelVariables>(
    CREATE_METAMODEL,
    {
      refetchQueries: [
        {
          query: GET_METAMODELS,
          variables: {
            type: "PASSWORD",
          } as GetMetamodelsVariables,
        },
      ],
    }
  );
  
  return (
    <SimpleButton
      onClick={() => {
        // create password
        createPassword({
          variables: {
            type: "PASSWORD",
            metadata: stringifyMetamodelMetadata({ name: "Untitled password" }),
          },
        });
      }}
    >
      Add password
    </SimpleButton>
  );
}
