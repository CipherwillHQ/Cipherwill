"use client";
import getTimeAgo from "@/common/time/getTimeAgo";
import ConfirmationButton from "@/components/common/ConfirmationButton";
import DELETE_METAMODEL from "@/graphql/ops/app/metamodel/mutations/DELETE_METAMODEL";
import GET_METAMODELS from "@/graphql/ops/app/metamodel/queries/GET_METAMODELS";
import { POD_TYPE } from "@/types";
import {
  DeleteMetamodelMutation,
  DeleteMetamodelVariables,
} from "@/types/interfaces/metamodel";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { FiMoreHorizontal } from "react-icons/fi";
import Popup from "reactjs-popup";

export default function Options({
  metamodel_id,
  metamodel_type,
  created_at,
  updated_at,
}: {
  metamodel_id: string;
  metamodel_type: POD_TYPE;
  created_at: string;
  updated_at: string;
}) {
  const router = useRouter();

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

  return (
    <Popup
      trigger={
        <button className="px-2 hover:cursor-pointer">
          <FiMoreHorizontal size={22} />
        </button>
      }
      position="bottom right"
    >
      {/* @ts-ignore */}
      {(close) => {
        return (
          <div className="bg-secondary text-black dark:text-white p-1 border border-default">
            <button
              className="p-2 w-full text-left hover:cursor-pointer"
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
                    id: metamodel_id,
                  },
                });
                router.replace(
                  `/app/data/${get_path_from_type(metamodel_type)}`
                );
              }}
            >
              Delete permanently
            </ConfirmationButton>
            <div className="p-2 opacity-50 font-semibold">
              <div className="text-xs">
                Created at: {getTimeAgo(parseInt(created_at))}
              </div>
              <div className="text-xs">
                Updated at: {getTimeAgo(parseInt(updated_at))}
              </div>
            </div>
          </div>
        );
      }}
    </Popup>
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
