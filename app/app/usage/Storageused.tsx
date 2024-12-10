import { bytesToReadable } from "@/common/storage/bytes_to_redable";
import GET_STORAGE_USED from "@/graphql/ops/auth/queries/GET_STORAGE_USED";
import { useQuery } from "@apollo/client";

export default function Storageused() {
  const { data, loading, error } = useQuery(GET_STORAGE_USED);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  const storageUsed = data?.getStorageUsed;
  return (
    <div className="p-4">
      <h2 className="mb-2 font-semibold text-lg">Storage</h2>
      <div className="p-4 bg-secondary rounded-md border border-default">
        <div>
          Text pod usage:{" "}
          {bytesToReadable(parseInt(storageUsed?.text_pods) || 0)}
        </div>
        <div>
          Storage pod usage:{" "}
          {bytesToReadable(parseInt(storageUsed?.storage_pods) || 0)}
        </div>
      </div>
    </div>
  );
}
