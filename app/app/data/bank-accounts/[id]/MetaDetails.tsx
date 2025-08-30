"use client";
import { useMutation, useQuery } from "@apollo/client/react";
import GET_METAMODEL from "../../../../../graphql/ops/app/metamodel/queries/GET_METAMODEL";
import UPDATE_METAMODEL from "../../../../../graphql/ops/app/metamodel/mutations/UPDATE_METAMODEL";
import getTimeAgo from "../../../../../common/time/getTimeAgo";
import ShareMetapod from "@/components/app/data/ShareMetapod";
import { 
  GetMetamodelQuery, 
  GetMetamodelVariables, 
  MetamodelMetadata,
  UpdateMetamodelVariables,
  UpdateMetamodelMutation
} from "../../../../../types/interfaces";
import { parseMetamodelMetadata, stringifyMetamodelMetadata } from "../../../../../common/metamodel/utils";

export default function MetaDetails({ id }: { id: string }) {
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
  if (error && 'graphQLErrors' in error) {
    const graphQLErrors = (error as any).graphQLErrors;
    if (
      graphQLErrors &&
      graphQLErrors[0] &&
      graphQLErrors[0].extensions?.code === "MODEL_NOT_FOUND"
    ) {
      window.location.href = "/app/data/bank-accounts";
      return null;
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{JSON.stringify(error)}</div>;
  
  if (!data?.getMetamodel) {
    return <div>No data available</div>;
  }

  const metamodel = data.getMetamodel;
  const parsedData: MetamodelMetadata = parseMetamodelMetadata(metamodel);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 justify-between py-2">
      <div className="flex gap-2 items-center">
        <div
          id="bank-account-name"
          className="text-xl outline-hidden"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const new_name = e.target.innerText;
            if (new_name.length === 0) {
              const nameElement = document.getElementById("bank-account-name");
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
              });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              document.getElementById("bank-account-name")?.blur();
            }
          }}
        >
          {parsedData.name}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            document.getElementById("bank-account-name")?.focus();
          }}
        >
          Rename
        </button>
        <ShareMetapod />
        <div className="text-xs">
          Created at: {getTimeAgo(parseInt(metamodel.created_at))}
          <br />
          Updated at: {getTimeAgo(parseInt(metamodel.updated_at))}
        </div>
      </div>
    </div>
  );
}
