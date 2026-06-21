"use client";
import { useQuery } from "@apollo/client/react";
import GET_METAMODELS from "../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import DataTile from "@/components/app/data/DataTile";
import AddDataCard from "@/components/app/data/AddDataCard";
import DataGridSkeleton from "@/components/app/data/DataGridSkeleton";
import DataGridEmpty from "@/components/app/data/DataGridEmpty";
import { GetMetamodelsQuery, GetMetamodelsVariables, MetamodelMetadata } from "../../../../types/interfaces";
import { parseMetamodelMetadata } from "../../../../common/metamodel/utils";
import { TbCreditCard } from "react-icons/tb";

export default function CardsList() {
  const { data, loading, error, fetchMore } = useQuery<GetMetamodelsQuery, GetMetamodelsVariables>(GET_METAMODELS, {
    variables: {
      type: "PAYMENT_CARD",
    },
  });

  if (loading) return <DataGridSkeleton />;
  if (error) return <div>{JSON.stringify(error)}</div>;
  if (!data) return <div>No data found</div>;
  return (
    <div className="flex flex-col w-full">
      {data.getMetamodels.models.length === 0 ? (
        <DataGridEmpty
          icon={<TbCreditCard size={44} strokeWidth={1.5} />}
          title="No payment cards yet"
        >
          <AddDataCard
            type="PAYMENT_CARD"
            defaultName="Untitled card"
            label="Add your first payment card"
            variant="empty"
          />
        </DataGridEmpty>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {data.getMetamodels.models.map((model) => (
              <DataTile
                key={model.id}
                id={model.id}
                name={parseMetamodelMetadata<MetamodelMetadata>(model).name}
                updated_at={model.updated_at}
                basePath="/app/data/payment-cards"
                icon={<TbCreditCard size={20} />}
              />
            ))}
            <AddDataCard
              type="PAYMENT_CARD"
              defaultName="Untitled card"
              label="Add another payment card"
            />
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
        </>
      )}
    </div>
  );
}
