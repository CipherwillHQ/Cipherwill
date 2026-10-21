// Renders the executor's shared items in the dashboard card grid.
// Owns list loading, empty states, beneficiary filtering, and pagination.
// Does not decrypt contents or provide write actions.

"use client";

import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import { getExecutorSegment } from "@/common/executor/segments";
import { mergeGrantedModelPages } from "@/common/executor/grantedPages";
import { parseMetamodelMetadata } from "@/common/metamodel/utils";
import DataGridSkeleton from "@/components/app/data/DataGridSkeleton";
import { useAccessDetails } from "@/contexts/AccessDetailsContext";
import GET_GRANTED_METAMODELS from "@/graphql/ops/app/executor/metamodels/GET_GRANTED_METAMODELS";
import type { ExecutorDataListProps, GetGrantedMetamodelsQuery, GetGrantedMetamodelsVariables } from "@/types/interfaces";
import ExecutorDataCard from "./ExecutorDataCard";
import ExecutorState from "./ExecutorState";

export default function GrantedDataList({ slug, folderId, children }: ExecutorDataListProps) {
  const { id } = useParams<{ id: string }>();
  const { accessDetails } = useAccessDetails();
  const segment = getExecutorSegment(slug);
  const { loading, error, data, fetchMore, refetch } = useQuery<GetGrantedMetamodelsQuery, GetGrantedMetamodelsVariables>(
    GET_GRANTED_METAMODELS,
    { variables: { access_id: id, type: segment.metamodel_type, ...(folderId ? { folder_id: folderId } : {}) } },
  );
  const page = data?.getGrantedMetamodels;
  const models = accessDetails
    ? page?.models.filter((model) => !model.ignored_beneficiaries?.includes(accessDetails.beneficiary_id)) ?? []
    : [];
  const basePath = "/executor/" + id + "/" + slug + (slug === "storage" ? "/object" : "");

  return (
    <div className="w-full space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{segment.title}</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{segment.description}</p>
      </header>
      {children}
      {children && <h2 className="text-base font-semibold">Files</h2>}
      {error ? (
        <ExecutorState error title="Unable to load shared items" description="Please try again to view the information shared with you.">
          <button type="button" onClick={() => void refetch()} className="min-h-11 rounded-xl border border-default px-5 text-sm font-medium hover:bg-primary-50 dark:hover:bg-darkAccent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Try again</button>
        </ExecutorState>
      ) : loading && !page ? (
        <div role="status" aria-label="Loading shared items"><DataGridSkeleton /></div>
      ) : (
        <>
          <div data-cy="donor-models" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {models.map((model) => {
              const metadata = parseMetamodelMetadata(model);
              return <ExecutorDataCard key={model.id} href={basePath + "/" + model.id} title={metadata.title || metadata.name || "Untitled"} updatedAt={model.updated_at} icon={segment.icon} />;
            })}
          </div>
          {!models.length && (
            <ExecutorState title="Nothing shared in this section" description="Only the items included in your access will appear here." />
          )}
        </>
      )}
      {page?.has_more && page.models.length > 0 && (
        <button
          type="button"
          disabled={loading}
          onClick={() => void fetchMore({ variables: { cursor: page.models[page.models.length - 1].id }, updateQuery: mergeGrantedModelPages })}
          className="min-h-11 rounded-xl border border-default bg-secondary px-5 text-sm font-medium transition-colors hover:bg-primary-50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-darkAccent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {loading ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}
