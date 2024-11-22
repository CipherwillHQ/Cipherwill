
"use client";
import { useMutation } from "@apollo/client";
import CREATE_METAMODEL from "../../../../graphql/ops/app/metamodel/mutations/CREATE_METAMODEL";
import GET_METAMODELS from "../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import SimpleButton from "@/components/common/SimpleButton";

export default function CreateDeviceLock() {
  const [createDeviceLock] = useMutation(CREATE_METAMODEL, {
    refetchQueries: [
      {
        query: GET_METAMODELS,
        variables: {
          type: "DEVICE_LOCK"
        },
      },
    ],
  });
  return (
    <SimpleButton
      onClick={() => {
        // create device lock
        createDeviceLock({
          variables: {
            type: "DEVICE_LOCK",
            metadata: JSON.stringify({ name: "Untitled device" }),
          },
        });
      }}
    >
      Add device
    </SimpleButton>
  );
}
