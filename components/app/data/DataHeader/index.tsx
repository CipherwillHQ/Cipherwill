"use client";
import { stringifyMetamodelMetadata } from "@/common/metamodel";
import UPDATE_METAMODEL from "@/graphql/ops/app/metamodel/mutations/UPDATE_METAMODEL";
import GET_METAMODEL from "@/graphql/ops/app/metamodel/queries/GET_METAMODEL";
import {
  GetMetamodelQuery,
  GetMetamodelVariables,
  POD_TYPE,
  UpdateMetamodelMutation,
  UpdateMetamodelVariables,
} from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import Options from "./Options";
import BeneficiaryChoice from "./BeneficiaryChoice";

export default function DataHeader({
  metamode_id,
  metamodel_type,
  saveStatus,
}: {
  metamode_id: string;
  metamodel_type: POD_TYPE;
  saveStatus?: "SAVED" | "NOT_SAVED" | "ERROR" | "LOADING";
}) {
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
      <div
      className="flex items-center justify-between gap-2"
      >
        {/* <BeneficiaryChoice /> */}
      <Options
        metamode_id={metamode_id}
        metamodel_type={metamodel_type}
        created_at={model?.created_at}
        updated_at={model?.updated_at}
      />
      </div>
    </div>
  );
}
