"use client";
import { useMutation, useQuery } from "@apollo/client/react";
import toast from "react-hot-toast";
import { BiEditAlt } from "react-icons/bi";
import GET_METAMODEL from "../../../../../graphql/ops/app/metamodel/queries/GET_METAMODEL";
import UPDATE_METAMODEL from "../../../../../graphql/ops/app/metamodel/mutations/UPDATE_METAMODEL";
import getTimeAgo from "../../../../../common/time/getTimeAgo";
import ShareMetapod from "@/components/app/data/ShareMetapod";
import Options from "./Options";
import { 
  GetMetamodelQuery, 
  GetMetamodelVariables, 
  MetamodelMetadata,
  UpdateMetamodelVariables,
  UpdateMetamodelMutation
} from "../../../../../types/interfaces";
import { parseMetamodelMetadata, stringifyMetamodelMetadata } from "../../../../../common/metamodel/utils";

export default function MetaDetails({
  id,
  saveStatus,
}: {
  id: string;
  saveStatus: "SAVED" | "NOT_SAVED" | "ERROR" | "LOADING";
}) {
  const { data, loading, error, refetch } = useQuery<GetMetamodelQuery, GetMetamodelVariables>(
    GET_METAMODEL,
    {
      variables: {
        id,
      },
    }
  );

  const [update_metamodel] = useMutation<UpdateMetamodelMutation, UpdateMetamodelVariables>(UPDATE_METAMODEL);

  // Handle the MODEL_NOT_FOUND error
  if (error && 'errors' in error) {
    const errors = (error as any).errors;
    if (
      errors &&
      errors[0] &&
      errors[0].extensions?.code === "MODEL_NOT_FOUND"
    ) {
      window.location.href = "/app/data/notes";
      return null;
    }
  }

  if (loading)
    return (
      <div className="bg-neutral-300 dark:bg-neutral-800 p-2 rounded-md my-2 h-10 animate-pulse" />
    );
  if (error) return <div>{JSON.stringify(error)}</div>;
  
  if (!data?.getMetamodel) {
    return <div>No data available</div>;
  }

  const metamodel = data.getMetamodel;
  const parsedData: MetamodelMetadata = parseMetamodelMetadata(metamodel);

  return (
    <div className="flex items-start gap-2 justify-between py-2">
      <div className="flex gap-2 items-center">
        <div
          id="note-title"
          className="text-xl outline-hidden"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const new_name = e.target.innerText;
            if (new_name.length === 0) {
              const titleElement = document.getElementById("note-title");
              if (titleElement) {
                titleElement.innerText = (parsedData as any).title || parsedData.name;
              }
            }
            if (new_name.length > 0 && new_name !== (parsedData as any).title) {
              update_metamodel({
                variables: {
                  data: {
                    id,
                    metadata: stringifyMetamodelMetadata({
                      ...parsedData,
                      title: new_name,
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
              document.getElementById("note-title")?.blur();
            }
          }}
        >
          {(parsedData as any).title?.length > 0 ? (parsedData as any).title : "Untitled"}
        </div>
        <div className="ml-2 text-xs">
          {saveStatus === "SAVED"
            ? ""
            : saveStatus === "LOADING"
            ? "Saving..."
            : saveStatus === "NOT_SAVED"
            ? "Edited"
            : "Error saving"}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ShareMetapod />
        <Options model={metamodel} />
      </div>
    </div>
  );
}
