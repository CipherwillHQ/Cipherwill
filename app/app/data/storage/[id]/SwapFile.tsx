import upload_pod_data from "@/common/data/upload_pod_data";
import logger from "@/common/debug/logger";
import SimpleButton from "@/components/common/SimpleButton";
import { useSession } from "@/contexts/SessionContext";
import UPDATE_METAMODEL from "@/graphql/ops/app/metamodel/mutations/UPDATE_METAMODEL";
import { useApolloClient, useMutation } from "@apollo/client/react";
import { useState } from "react";
import toast from "react-hot-toast";
import Popup from "reactjs-popup";

export default function SwapFile({ id }) {
  const [isUpdating, setisUpdating] = useState(false);
  const client = useApolloClient();
  const { session } = useSession();
  const [update_metamodel] = useMutation(UPDATE_METAMODEL, {});
  return (
    <Popup
      trigger={
        <div>
          <SimpleButton>Swap file</SimpleButton>
        </div>
      }
      modal
    >
      {/* @ts-ignore */}
      {(close) => {
        return (
          <div className="flex flex-col bg-white p-2 rounded-md">
            <input type="file" id="swap-file-input" />

            <SimpleButton
              onClick={async () => {
                if (isUpdating) {
                  toast.error("Updating already in progress");
                  return;
                }
                setisUpdating(true);
                const file = (document.getElementById("swap-file-input") as any)
                  .files[0];
                if (!file) {
                  toast.error("Select file first");
                  setisUpdating(false);
                  return;
                }
                //add new name and type to metadata
                await update_metamodel({
                  variables: {
                    data: {
                      id,
                      metadata: JSON.stringify({
                        title: file.name,
                        type: file.type,
                      }),
                    },
                  },
                }).catch((error) => {
                  toast.error("Error while updating metamodel");
                  logger.error("Error while updating metamodel", error);
                  setisUpdating(false);
                  return;
                });
                // upload data
                await upload_pod_data({
                  data_items: [
                    {
                      ref_id: id,
                      data_model_version: "0.0.1",
                      publicKey: session ? session.publicKey : undefined,
                      data: file,
                    },
                  ],
                  client,
                  metamodel_id: id,
                }).catch((error) => {
                  toast.error("Error while uploading data of swap file");
                  logger.error(
                    "Error while uploading data of swap file",
                    error
                  );
                  setisUpdating(false);
                  return;
                });
                close();
              }}
            >
              {isUpdating ? "Updating..." : "Swap File"}
            </SimpleButton>
          </div>
        );
      }}
    </Popup>
  );
}
