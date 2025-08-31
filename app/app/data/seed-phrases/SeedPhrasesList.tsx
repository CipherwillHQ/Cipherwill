"use client";
import { useQuery } from "@apollo/client/react";
import GET_METAMODELS from "../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import SeedPhraseTile from "./SeedPhraseTile";
import { GetMetamodelsQuery, GetMetamodelsVariables, MetamodelMetadata } from "../../../../types/interfaces";
import { parseMetamodelMetadata } from "../../../../common/metamodel/utils";

export default function SeedPhrasesList() {
  const { data, loading, error, fetchMore } = useQuery<GetMetamodelsQuery, GetMetamodelsVariables>(GET_METAMODELS, {
    variables: {
      type: "SEED_PHRASE",
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{JSON.stringify(error)}</div>;
  if (!data) return <div>No data found</div>;
  return (
    <div className="flex flex-col w-full">
      {data.getMetamodels.models.length === 0 && <div>No seed phrases</div>}

      <div className="flex flex-wrap gap-2 w-full">
        {data.getMetamodels.models.map((model) => (
          <SeedPhraseTile
            key={model.id}
            id={model.id}
            data={parseMetamodelMetadata<MetamodelMetadata>(model)}
          />
        ))}
      </div>
      {data.getMetamodels.has_more && (
        <button
          className="my-2 p-1 border rounded-sm hover:bg-slate-100"
          onClick={() => {
            fetchMore({
              variables: {
                cursor:
                  data.getMetamodels.models[
                    data.getMetamodels.models.length - 1
                  ].id,
              },
              updateQuery: (prev: GetMetamodelsQuery, { fetchMoreResult }: { fetchMoreResult: GetMetamodelsQuery }) => {
                if (!fetchMoreResult) return prev;
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
