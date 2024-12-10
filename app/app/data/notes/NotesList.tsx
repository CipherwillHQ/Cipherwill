"use client";
import { useQuery } from "@apollo/client";
import GET_METAMODELS from "../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import NoteTile from "./NoteTile";

export default function NotesList() {
  const { data, loading, error, fetchMore } = useQuery(GET_METAMODELS, {
    variables: {
      type: "NOTE",
    },
  });
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{JSON.stringify(error)}</div>;
  return (
    <div className="flex flex-col w-full gap-2">
      {data.getMetamodels.models.length === 0 && <div>No notes</div>}

      {data.getMetamodels.models.length > 0 && (
        <div className="">
          <div className="hidden sm:flex bg-secondary p-2 rounded-t-md">
            <div>Note title</div>
          </div>
          {data.getMetamodels.models.map((model) => (
            <NoteTile
              key={model.id}
              id={model.id}
              data={JSON.parse(model.metadata)}
            />
          ))}
        </div>
      )}
      {data.getMetamodels.has_more && (
        <button
          className="my-2 p-1 border rounded hover:bg-slate-100"
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
