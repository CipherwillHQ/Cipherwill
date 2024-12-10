"use client";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import GET_ACCESS_DETAILS from "../../../graphql/ops/app/executor/access/queries/GET_ACCESS_DETAILS";
import getTimeRemaining from "../../../common/time/getTimeRemaining";
import DonorDetails from "./DonorDetails";
import { useParams } from "next/navigation";

const metamodels = [
  {
    title: "Bank Accounts",
    path: "/bank-accounts",
  },
  {
    title: "Notes",
    path: "/notes",
  },
];

export default function ExecutorPanel() {
  const params = useParams();

  const id = params.id;

  const { loading, error, data } = useQuery(GET_ACCESS_DETAILS, {
    variables: {
      id,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <div>Error : {JSON.stringify(error)}</div>;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 p-2">
        <h2>Execution Panel for</h2>
        {data && data.getAccessDetails && (
          <DonorDetails id={data.getAccessDetails.user} />
        )}
        Valid Until:{" "}
        {getTimeRemaining(parseInt(data.getAccessDetails.expire_at))}
        <div className="flex flex-wrap gap-2">
          {metamodels.map((metamodel) => {
            return (
              <Link
                href={`/executor/${id}${metamodel.path}`}
                key={metamodel.path}
              >
                <button className="border border-default w-60 bg-secondary p-2 rounded-md hover:underline">
                  {metamodel.title}
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
