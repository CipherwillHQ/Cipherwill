"use client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import GET_GRANTED_METAMODELS from "../../../../graphql/ops/app/executor/metamodels/GET_GRANTED_METAMODELS";
import { useParams } from "next/navigation";
import type { 
  GetGrantedMetamodelsQuery, 
  GetGrantedMetamodelsVariables,
  MetamodelMetadata 
} from "@/types/interfaces/metamodel";
import { useAccessDetails } from "@/contexts/AccessDetailsContext";

export default function GrantedBankAccounts() {
  const params = useParams();
  const id = params?.id as string;
  const { accessDetails } = useAccessDetails();

  const { loading, error, data, fetchMore } = useQuery<GetGrantedMetamodelsQuery, GetGrantedMetamodelsVariables>(GET_GRANTED_METAMODELS, {
    variables: {
      access_id: id,
      type: "BANK_ACCOUNT",
    },
  });

  if (loading || !accessDetails) return <p>Loading...</p>;
  if (error) return <div>Error : {error.message}</div>;
  if (!data?.getGrantedMetamodels) return <div>No data available</div>;
  const final_models = data.getGrantedMetamodels.models.filter((model => 
    !model.ignored_beneficiaries?.includes(accessDetails.beneficiary_id)
  ));
  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold">Bank Accounts</h1>
      <div className="flex flex-col" data-cy="donor-models">
        {final_models.length === 0 && (
          <div className="py-2 opacity-50">No Bank Account Found</div>
        )}
        {final_models.map((model) => {
          const parsed_data: MetamodelMetadata = JSON.parse(model.metadata);
          return (
            <Link
              key={model.id}
              href={`/executor/${id}/bank-accounts/${model.id}`}
              className="bg-secondary p-2 border border-default rounded-md hover:underline"
            >
              {parsed_data.name || "Untitled"}
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
              updateQuery: (prev: GetGrantedMetamodelsQuery, { fetchMoreResult }: { fetchMoreResult: GetGrantedMetamodelsQuery }) => {
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
