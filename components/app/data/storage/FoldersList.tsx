"use client";
import { useQuery } from "@apollo/client";
import GET_FOLDERS from "@/graphql/ops/app/storage/queries/GET_FOLDERS";
import FolderTile from "./FolderTile";

export default function FoldersList({ folder_id }: { folder_id?: string }) {
  const { data, loading, error, fetchMore } = useQuery(GET_FOLDERS, {
    variables: {
      folder_id,
    },
  });
  if (loading) {
    return (
      <div className="px-4">
        <div className="bg-neutral-200 dark:bg-neutral-900 animate-pulse w-full h-10 rounded-md mb-2" />
      </div>
    );
  }
  if (error) return <div>{JSON.stringify(error)}</div>;
  return (
    <div className="flex flex-col w-full gap-2 p-4">
      {data.getFolders.folders.length === 0 && <div>No folders</div>}
      {data.getFolders.folders.length > 0 && (
        <h2 className="font-semibold text-gray-500">Folders</h2>
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
        {data.getFolders.folders.map((folder) => (
          <FolderTile key={folder.id} id={folder.id} name={folder.name} />
        ))}
      </div>
      {data.getFolders.has_more && (
        <button
          className="my-2 p-1 border rounded hover:bg-slate-100"
          onClick={() => {
            fetchMore({
              variables: {
                cursor:
                  data.getFolders.folders[data.getFolders.folders.length - 1]
                    .id,
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                return {
                  getFolders: {
                    folders: [
                      ...prev.getFolders.folders,
                      ...fetchMoreResult.getFolders.folders,
                    ],
                    has_more: fetchMoreResult.getFolders.has_more,
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
