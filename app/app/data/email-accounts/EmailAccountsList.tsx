"use client";
import { useQuery } from "@apollo/client/react";
import GET_METAMODELS from "../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import DataTile from "@/components/app/data/DataTile";
import AddDataCard from "@/components/app/data/AddDataCard";
import DataGridSkeleton from "@/components/app/data/DataGridSkeleton";
import DataGridEmpty from "@/components/app/data/DataGridEmpty";
import { GetMetamodelsQuery, GetMetamodelsVariables } from "../../../../types/interfaces";
import { parseMetamodelMetadata } from "../../../../common/metamodel/utils";
import { TbMail } from "react-icons/tb";

export default function EmailAccountsList() {
  const { data, loading, error, fetchMore } = useQuery<GetMetamodelsQuery, GetMetamodelsVariables>(
    GET_METAMODELS,
    {
      variables: {
        type: "EMAIL_ACCOUNT",
      },
    }
  );
  
  if (loading) return <DataGridSkeleton />;
  if (error) return <div>{JSON.stringify(error)}</div>;
  
  if (!data?.getMetamodels) {
    return <div>No data available</div>;
  }

  const { models, has_more } = data.getMetamodels;

  return (
    <div className="flex flex-col w-full">
      {models.length === 0 ? (
        <DataGridEmpty
          icon={<TbMail size={44} strokeWidth={1.5} />}
          title="No email accounts yet"
        >
          <AddDataCard
            type="EMAIL_ACCOUNT"
            defaultName="Untitled email account"
            label="Add your first email account"
            basePath="/app/data/email-accounts"
            variant="empty"
          />
        </DataGridEmpty>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {models.map((model) => (
              <DataTile
                key={model.id}
                id={model.id}
                name={parseMetamodelMetadata(model).name}
                updated_at={model.updated_at}
                basePath="/app/data/email-accounts"
                icon={<TbMail size={20} />}
              />
            ))}
            <AddDataCard
              type="EMAIL_ACCOUNT"
              defaultName="Untitled email account"
              label="Add another email account"
              basePath="/app/data/email-accounts"
            />
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
        </>
      )}
    </div>
  );
}
