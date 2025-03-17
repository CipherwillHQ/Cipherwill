"use client";
import GET_METAMODELS from "@/graphql/ops/app/metamodel/queries/GET_METAMODELS";
import { useQuery } from "@apollo/client";
import FileTile from "./FileTile";

export default function FileList({ folder_id }: { folder_id?: string }) {
  const { data, loading, error, fetchMore } = useQuery(GET_METAMODELS, {
    variables: {
      type: "FILE",
      folder_id,
    },
  });
  if (loading) {
    return (
      <div className="px-4">
        <div className="bg-neutral-200 dark:bg-neutral-900 animate-pulse w-full h-10 rounded-md" />
      </div>
    );
  }
  if (error) return <div>{JSON.stringify(error)}</div>;
  return (
    <div className="flex flex-col w-full gap-2 p-4">
      {data.getMetamodels.models.length === 0 && <div>No files</div>}

      {data.getMetamodels.models.length > 0 && (
        <h2 className="font-semibold text-gray-500">Files</h2>
      )}
      <div
        className="grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        2xl:grid-cols-5
        gap-2
        "
      >
        {data.getMetamodels.models.map((model) => (
          <FileTile
            key={model.id}
            id={model.id}
            data={JSON.parse(model.metadata)}
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
              updateQuery: (prev, { fetchMoreResult }) => {
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
