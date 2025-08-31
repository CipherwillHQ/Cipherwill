
"use client";
import { useMutation } from "@apollo/client/react";
import CREATE_METAMODEL from "../../../../graphql/ops/app/metamodel/mutations/CREATE_METAMODEL";
import GET_METAMODELS from "../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import SimpleButton from "@/components/common/SimpleButton";
import { CreateMetamodelMutation, CreateMetamodelVariables, GetMetamodelsVariables } from "../../../../types/interfaces";
import { stringifyMetamodelMetadata } from "../../../../common/metamodel/utils";

export default function CreateDeviceLock() {
  const [createDeviceLock] = useMutation<CreateMetamodelMutation, CreateMetamodelVariables>(
    CREATE_METAMODEL,
    {
      refetchQueries: [
        {
          query: GET_METAMODELS,
          variables: {
            type: "DEVICE_LOCK",
          } as GetMetamodelsVariables,
        },
      ],
    }
  );
  
  return (
    <SimpleButton
      onClick={() => {
        // create device lock
        createDeviceLock({
          variables: {
            type: "DEVICE_LOCK",
            metadata: stringifyMetamodelMetadata({ name: "Untitled device" }),
          },
        });
      }}
    >
      Add device
    </SimpleButton>
  );
}
