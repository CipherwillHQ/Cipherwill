"use client";
import { stringifyMetamodelMetadata } from "@/common/metamodel";
import getTimeAgo from "@/common/time/getTimeAgo";
import ConfirmationButton from "@/components/common/ConfirmationButton";
import DELETE_METAMODEL from "@/graphql/ops/app/metamodel/mutations/DELETE_METAMODEL";
import UPDATE_METAMODEL from "@/graphql/ops/app/metamodel/mutations/UPDATE_METAMODEL";
import GET_METAMODEL from "@/graphql/ops/app/metamodel/queries/GET_METAMODEL";
import GET_METAMODELS from "@/graphql/ops/app/metamodel/queries/GET_METAMODELS";
import {
  DeleteMetamodelMutation,
  DeleteMetamodelVariables,
  GetMetamodelQuery,
  GetMetamodelVariables,
  POD_TYPE,
  UpdateMetamodelMutation,
  UpdateMetamodelVariables,
} from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { FiMoreHorizontal } from "react-icons/fi";
import Popup from "reactjs-popup";

export default function DataHeader({
  metamode_id,
  metamodel_type,
  saveStatus,
}: {
  metamode_id: string;
  metamodel_type: POD_TYPE;
  saveStatus?: "SAVED" | "NOT_SAVED" | "ERROR" | "LOADING";
}) {
  const router = useRouter();

  const { data, loading, error, refetch } = useQuery<
    GetMetamodelQuery,
    GetMetamodelVariables
  >(GET_METAMODEL, {
    variables: {
      id: metamode_id,
    },
  });

  const [update_metamodel] = useMutation<
    UpdateMetamodelMutation,
    UpdateMetamodelVariables
  >(UPDATE_METAMODEL);

  const [deleteMetamodel] = useMutation<
    DeleteMetamodelMutation,
    DeleteMetamodelVariables
  >(DELETE_METAMODEL, {
    refetchQueries: [
      {
        query: GET_METAMODELS,
        variables: {
          type: metamodel_type.toUpperCase(), // ex. convert defi_staking to DEFI_STAKING
        },
      },
    ],
  });

  const model = data?.getMetamodel;
  if (!model) {
    return <div>Loading...</div>;
  }
  const metadata = JSON.parse(model.metadata);

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex gap-2 items-center">
        <div
          id="name-box"
          className="text-xl outline-hidden"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const new_name = e.target.innerText;
            if (new_name.length === 0) {
              const nameElement = document.getElementById("name-box");
              if (nameElement) {
                nameElement.innerText = (model as any).name;
              }
            }
            if (new_name.length > 0 && new_name !== (model as any).name) {
              // backward compatibility for notes and storage which use title instead of name
              const key =
                metamodel_type === "note" || metamodel_type === "storage"
                  ? "title"
                  : "name";
              update_metamodel({
                variables: {
                  data: {
                    id: metamode_id,
                    metadata: stringifyMetamodelMetadata({
                      ...metadata,
                      [key]: new_name,
                    }),
                  },
                },
              }).then(() => {
                refetch();
              });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              document.getElementById("name-box")?.blur();
            }
          }}
        >
          {(metadata as any).name || (metadata as any).title || "Untitled"}
        </div>
        {saveStatus && (
          <div className="ml-2 text-xs">
            {saveStatus === "SAVED"
              ? ""
              : saveStatus === "LOADING"
              ? "Saving..."
              : saveStatus === "NOT_SAVED"
              ? "Edited"
              : "Error saving"}
          </div>
        )}
      </div>
      <Popup
        trigger={
          <button className="px-2">
            <FiMoreHorizontal size={22} />
          </button>
        }
        position="bottom right"
      >
        <div className="bg-secondary text-black dark:text-white rounded-sm">
          <button
            className="p-2 w-full text-left"
            onClick={() => {
              document.getElementById("name-box")?.focus();
              close();
            }}
          >
            Rename
          </button>

          <ConfirmationButton
            className="p-2 w-full text-left"
            onConfirm={async () => {
              await deleteMetamodel({
                variables: {
                  id: metamode_id,
                },
              });
              router.replace(`/app/data/${get_path_from_type(metamodel_type)}`);
            }}
          >
            Delete permanently
          </ConfirmationButton>
          <div className="p-2">
            <div className="text-xs">
              Created at: {getTimeAgo(parseInt(model?.created_at))}
            </div>
            <div className="text-xs">
              Updated at: {getTimeAgo(parseInt(model?.updated_at))}
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
}

function get_path_from_type(type: POD_TYPE): string {
  switch (type) {
    case "note":
      return "notes";
    case "email_account":
      return "email-accounts";
    case "bank_account":
      return "bank-accounts";
    case "defi_staking":
      return "defi-staking";
    case "device_lock":
      return "device-locks";
    case "payment_card":
      return "payment-cards";
    case "seed_phrase":
      return "seed-phrases";
    case "password":
      return "passwords";
    case "storage":
      return "storage";
    default:
      return "";
  }
}
