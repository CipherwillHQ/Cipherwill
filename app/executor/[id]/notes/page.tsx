"use client";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import GET_GRANTED_METAMODELS from "../../../../graphql/ops/app/executor/metamodels/GET_GRANTED_METAMODELS";
import { useParams } from "next/navigation";

export default function GrantedNotes() {
  const params = useParams();
  const id = params.id;

  const { loading, error, data, fetchMore } = useQuery(GET_GRANTED_METAMODELS, {
    variables: {
      access_id: id,
      type: "NOTE",
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <div>Error : {JSON.stringify(error)}</div>;
  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold">Notes</h1>
      <div className="flex flex-col gap-2" data-cy="donor-models">
        {data.getGrantedMetamodels.models.length === 0 && (
          <div className="py-2 opacity-50">No Notes Found</div>
        )}
        {data.getGrantedMetamodels.models.map((model: any) => {
          const parsed_data = JSON.parse(model.metadata);
          return (
            <Link
              key={model.id}
              href={`/executor/${id}/notes/${model.id}`}
              className="bg-secondary p-2 border border-default rounded-md hover:underline"
            >
              {parsed_data.title || "Untitled"}
            </Link>
          );
        })}
      </div>
      {data.getGrantedMetamodels.has_more && (
        <button
          className="my-2 p-1 border rounded-sm hover:bg-slate-100"
          onClick={() => {
            fetchMore({
              variables: {
                cursor:
                  data.getGrantedMetamodels.models[
                    data.getGrantedMetamodels.models.length - 1
                  ].id,
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                return {
                  getGrantedMetamodels: {
                    models: [
                      ...prev.getGrantedMetamodels.models,
                      ...fetchMoreResult.getGrantedMetamodels.models,
                    ],
                    has_more: fetchMoreResult.getGrantedMetamodels.has_more,
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
