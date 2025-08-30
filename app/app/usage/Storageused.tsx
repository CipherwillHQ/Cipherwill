import { bytesToReadable } from "@/common/storage/bytes_to_redable";
import GET_STORAGE_USED from "@/graphql/ops/auth/queries/GET_STORAGE_USED";
import { useQuery } from "@apollo/client/react";
import type { GetStorageUsedQuery } from "@/types/interfaces/metamodel";

export default function Storageused() {
  const { data, loading, error } = useQuery<GetStorageUsedQuery>(GET_STORAGE_USED);

  if (loading) return <div>Loading storage usage...</div>;
  if (error) return <div>Error loading storage usage: {error.message}</div>;
  
  const storageUsed = data?.getStorageUsed;
  
  if (!storageUsed) {
    return <div>No storage usage data available</div>;
  }
  return (
    <div className="p-4">
      <h2 className="mb-2 font-semibold text-lg">Storage</h2>
      <div className="p-4 bg-secondary rounded-md border border-default">
        <div>
          Text pod usage:{" "}
          {bytesToReadable(parseInt(storageUsed.text_pods || "0"))}
        </div>
        <div>
          Storage pod usage:{" "}
          {bytesToReadable(parseInt(storageUsed.storage_pods || "0"))}
        </div>
      </div>
    </div>
  );
}
