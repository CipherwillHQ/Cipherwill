// Renders the shared storage folders in a responsive card grid.
// Owns folder query states and pagination within the current location.
// Does not load files, decrypt contents, or modify folders.

"use client";

import { useQuery } from "@apollo/client/react";
import { TbFolder } from "react-icons/tb";
import { mergeGrantedFolderPages } from "@/common/executor/grantedPages";
import DataGridSkeleton from "@/components/app/data/DataGridSkeleton";
import ExecutorDataCard from "@/components/executor/ExecutorDataCard";
import ExecutorState from "@/components/executor/ExecutorState";
import GET_GRANTED_STORAGE_FOLDERS from "@/graphql/ops/app/executor/metamodels/GET_GRANTED_STORAGE_FOLDERS";
import type { GetGrantedStorageFoldersQuery, GetGrantedStorageFoldersVariables } from "@/types/interfaces";

export default function GrantedFolderList({
  folder_id = "root",
  access_id,
}: {
  folder_id?: string;
  access_id: string;
}) {
  const { data, loading, error, fetchMore, refetch } = useQuery<GetGrantedStorageFoldersQuery, GetGrantedStorageFoldersVariables>(
    GET_GRANTED_STORAGE_FOLDERS,
    { variables: { access_id, folder_id } },
  );
  const page = data?.getGrantedStorageFolders;

  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold">Folders</h2>
      {error ? (
        <ExecutorState error title="Unable to load folders" description="Please try again to view the shared folders.">
          <button type="button" onClick={() => void refetch()} className="min-h-11 rounded-xl border border-default px-5 text-sm font-medium hover:bg-primary-50 dark:hover:bg-darkAccent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Try again</button>
        </ExecutorState>
      ) : loading && !page ? (
        <div role="status" aria-label="Loading shared folders"><DataGridSkeleton /></div>
      ) : page?.folders.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {page.folders.map((folder) => (
            <ExecutorDataCard key={folder.id} href={"/executor/" + access_id + "/storage/folder/" + folder.id} title={folder.name || "Untitled"} updatedAt={folder.updated_at} icon={<TbFolder />} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-default p-5 text-sm text-neutral-500 dark:text-neutral-400">No folders in this location.</p>
      )}
      {page?.has_more && page.folders.length > 0 && (
        <button
          type="button"
          disabled={loading}
          onClick={() => void fetchMore({ variables: { cursor: page.folders[page.folders.length - 1].id }, updateQuery: mergeGrantedFolderPages })}
          className="min-h-11 rounded-xl border border-default bg-secondary px-5 text-sm font-medium transition-colors hover:bg-primary-50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-darkAccent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {loading ? "Loading…" : "Load more folders"}
        </button>
      )}
    </section>
  );
}
