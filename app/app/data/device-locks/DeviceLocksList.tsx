"use client";
import { useQuery } from "@apollo/client/react";
import GET_METAMODELS from "../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import DeviceLockTile from "./DeviceLockTile";
import { GetMetamodelsQuery, GetMetamodelsVariables } from "../../../../types/interfaces";
import { parseMetamodelMetadata } from "../../../../common/metamodel/utils";

export default function DeviceLocksList() {
  const { data, loading, error, fetchMore } = useQuery<GetMetamodelsQuery, GetMetamodelsVariables>(
    GET_METAMODELS,
    {
      variables: {
        type: "DEVICE_LOCK",
      },
    }
  );
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{JSON.stringify(error)}</div>;
  
  if (!data?.getMetamodels) {
    return <div>No data available</div>;
  }

  const { models, has_more } = data.getMetamodels;

  return (
    <div className="flex flex-col w-full">
      {models.length === 0 && <div>No devices</div>}

      <div className="flex flex-wrap gap-2 w-full">
        {models.map((model) => (
          <DeviceLockTile
            key={model.id}
            id={model.id}
            data={parseMetamodelMetadata(model)}
          />
        ))}
      </div>
      {has_more && (
        <button
          className="my-2 p-1 border rounded-sm hover:bg-slate-100"
          onClick={() => {
            fetchMore({
              variables: {
                cursor: models[models.length - 1].id,
              },
              updateQuery: (prev: GetMetamodelsQuery, { fetchMoreResult }: { fetchMoreResult: GetMetamodelsQuery }) => {
                return {
                  getMetamodels: {
                    models: [
                      ...prev.getMetamodels.models,
                      ...fetchMoreResult.getMetamodels.models,
                    ],
                    has_more: fetchMoreResult.getMetamodels.has_more,
                  },
                };
              },
            });
          }}
        >
          Load more
        </button>
      )}
    </div>
  );
}
