import GET_METAMODELS from "@/graphql/ops/app/metamodel/queries/GET_METAMODELS";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { BiCheckCircle, BiCircle } from "react-icons/bi";

export default function CompleteNoteCreationStep() {
  const { data, loading, error } = useQuery(GET_METAMODELS, {
    variables: {
      type: "NOTE",
    },
  });
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  const is_complete = data.getMetamodels.models.length > 0;
  return (
    <div className="w-full max-w-sm">
      <Link
        className={`${is_complete ? "pointer-events-none" : ""}`}
        href={"/app/data/notes"}
      >
        <div className="flex items-center py-1">
          {is_complete ? (
            <BiCheckCircle className="text-green-500 mr-2" size={22} />
          ) : (
            <BiCircle className="text-gray-500 mr-2" size={22} />
          )}
          <span className="font-medium">Add a note</span>
        </div>
      </Link>
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Add a sample note to get started with Cipherwill and understand how
        Cipherwill save your data.
      </div>
    </div>
  );
}
