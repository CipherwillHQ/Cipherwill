"use client";
import GET_GRANTED_METAMODELS from "@/graphql/ops/app/executor/metamodels/GET_GRANTED_METAMODELS";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import GrantedFolderList from "./GrantedFolderList";
import Link from "next/link";
import type { 
  GetGrantedMetamodelsQuery, 
  GetGrantedMetamodelsVariables,
  GrantedMetamodel 
} from "@/types/interfaces/metamodel";

export default function GrantedFolderView() {
  const params = useParams() as { id: string; folder_id: string };
  const id: string = params?.id;
  const folder_id: string = params?.folder_id;

  const { loading, error, data, fetchMore } = useQuery<GetGrantedMetamodelsQuery, GetGrantedMetamodelsVariables>(
    GET_GRANTED_METAMODELS, 
    {
      variables: {
        access_id: id,
        type: "FILE",
        folder_id: folder_id,
      },
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <div>Error : {error.message}</div>;
  if (!data) return <div>No data available</div>;
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold">Folders</h2>
      <GrantedFolderList access_id={id} folder_id={folder_id} />
      <h2 className="text-xl font-semibold">Files</h2>
      <div className="flex flex-col gap-2" data-cy="donor-models">
        {data.getGrantedMetamodels?.models?.length === 0 && (
          <div className="py-2 opacity-50">No Files Found</div>
        )}
        {data.getGrantedMetamodels?.models?.map((model: GrantedMetamodel) => {
          const parsed_data = JSON.parse(model.metadata);

          return (
            <Link
              key={model.id}
              href={`/executor/${id}/storage/object/${model.id}`}
              className="bg-secondary p-2 border border-default rounded-md hover:underline"
            >
              {parsed_data.title || "Untitled"}
            </Link>
          );
        })}
      </div>
      {data.getGrantedMetamodels?.has_more && (
        <button
          className="my-2 p-1 border rounded-sm hover:bg-slate-100"
          onClick={() => {
            const models = data.getGrantedMetamodels?.models;
            if (models && models.length > 0) {
              fetchMore({
                variables: {
                  cursor: models[models.length - 1].id,
                },
                updateQuery: (prev: GetGrantedMetamodelsQuery, { fetchMoreResult }: { fetchMoreResult: GetGrantedMetamodelsQuery }) => {
                  if (!fetchMoreResult) return prev;
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
            }
          }}
        >
          Load more
        </button>
      )}
    </div>
  );
}
