"use client";
import { useMutation, useQuery } from "@apollo/client/react";
import GET_METAMODEL from "../../../../../graphql/ops/app/metamodel/queries/GET_METAMODEL";
import UPDATE_METAMODEL from "../../../../../graphql/ops/app/metamodel/mutations/UPDATE_METAMODEL";
import getTimeAgo from "../../../../../common/time/getTimeAgo";
import ShareMetapod from "@/components/app/data/ShareMetapod";
import { GetMetamodelQuery, GetMetamodelVariables, UpdateMetamodelMutation, UpdateMetamodelVariables, MetamodelMetadata } from "../../../../../types/interfaces";
import { parseMetamodelMetadata, stringifyMetamodelMetadata } from "../../../../../common/metamodel/utils";

interface MetaDetailsProps {
  id: string;
}

export default function MetaDetails({ id }: MetaDetailsProps) {
  const { data, loading, error, refetch } = useQuery<GetMetamodelQuery, GetMetamodelVariables>(GET_METAMODEL, {
    variables: {
      id,
    },
  });

  const [update_metamodel] = useMutation<UpdateMetamodelMutation, UpdateMetamodelVariables>(UPDATE_METAMODEL);

  // Handle model not found error
  if (error && 'graphQLErrors' in error && error.graphQLErrors && error.graphQLErrors[0] && 
      error.graphQLErrors[0].extensions?.code === "MODEL_NOT_FOUND") {
    window.location.href = "/app/data/seed-phrases";
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{JSON.stringify(error)}</div>;
  if (!data) return <div>No data found</div>;

  const parsedData = parseMetamodelMetadata<MetamodelMetadata>(data.getMetamodel);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 justify-between py-2">
      <div className="flex gap-2 items-center">
        <div
          id="seed-phrase-name"
          className="text-xl outline-hidden"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const new_name = e.target.innerText;
            if (new_name.length === 0) {
              const nameElement = document.getElementById("seed-phrase-name");
              if (nameElement) {
                nameElement.innerText = parsedData.name;
              }
            }
            if (new_name.length > 0 && new_name !== parsedData.name) {
              update_metamodel({
                variables: {
                  data: {
                    id,
                    metadata: stringifyMetamodelMetadata({
                      ...parsedData,
                      name: new_name,
                    }),
                  },
                },
              }).then(() => {
                refetch();
              }).catch((error) => {
                console.error('Failed to update seed phrase:', error);
              });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              document.getElementById("seed-phrase-name")?.blur();
            }
          }}
        >
          {parsedData.name}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            document.getElementById("seed-phrase-name")?.focus();
          }}
        >
          Rename
        </button>
        <ShareMetapod />
        <div className="text-xs">
          Created at: {getTimeAgo(parseInt(data.getMetamodel.created_at))}
          <br />
          Updated at: {getTimeAgo(parseInt(data.getMetamodel.updated_at))}
        </div>
      </div>
    </div>
  );
}
