"use client";

import GET_GRANTED_STORAGE_FOLDERS from "@/graphql/ops/app/executor/metamodels/GET_GRANTED_STORAGE_FOLDERS";
import { useQuery } from "@apollo/client";
import Link from "next/link";

export default function GrantedFolderList({
  folder_id = "root",
  access_id,
}: {
  folder_id?: string;
  access_id: string;
}) {
  const { data, loading, error, fetchMore } = useQuery(
    GET_GRANTED_STORAGE_FOLDERS,
    {
      variables: {
        access_id,
        folder_id,
      },
    }
  );
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error : {JSON.stringify(error)}</div>;
  return (
    <section className="py-4">
      {data &&
      data.getGrantedStorageFolders &&
      data.getGrantedStorageFolders.folders.length > 0 ? (
        <div className="flex flex-col gap-2">
          {data.getGrantedStorageFolders.folders.map((folder: any) => {
            return (
              <Link
                key={folder.id}
                href={`/executor/${access_id}/storage/folder/${folder.id}`}
                className="bg-secondary p-2 border border-default rounded-md hover:underline"
              >
                {folder.name || "Untitled"}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-2 opacity-50">No Folders Found</div>
      )}

      {data.getGrantedStorageFolders.has_more && (
        <button
          className="my-2 p-1 border rounded-sm hover:cursor-pointer w-full"
          onClick={() => {
            fetchMore({
              variables: {
                cursor:
                  data.getGrantedStorageFolders.folders[
                    data.getGrantedStorageFolders.folders.length - 1
                  ].id,
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                return {
                  getGrantedStorageFolders: {
                    folders: [
                      ...prev.getGrantedStorageFolders.folders,
                      ...fetchMoreResult.getGrantedStorageFolders.folders,
                    ],
                    has_more: fetchMoreResult.getGrantedStorageFolders.has_more,
                  },
                };
              },
            });
          }}
        >
          Load more
        </button>
      )}
    </section>
  );
}
