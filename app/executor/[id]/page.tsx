"use client";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import GET_ACCESS_DETAILS from "../../../graphql/ops/app/executor/access/queries/GET_ACCESS_DETAILS";
import getTimeRemaining from "../../../common/time/getTimeRemaining";
import DonorDetails from "./DonorDetails";
import { useParams } from "next/navigation";
import segments from "@/app/app/segments/segments";
import { Divider, Segment } from "@/types/Segments";

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
      <div className="flex flex-col gap-2">
        <h2>Execution Panel for</h2>
        {data && data.getAccessDetails && (
          <DonorDetails id={data.getAccessDetails.user} />
        )}
        Valid Until:{" "}
        {getTimeRemaining(parseInt(data.getAccessDetails.expire_at))}
        <div className="flex flex-wrap gap-2">
          {segments.map((segment: Segment) => {
            if ("divider" in segment && segment.divider)
              return (
                <div className="w-full">{(segment as Divider).divider}</div>
              );

            return (
              <Link href={`/executor/${id}/${segment.slug}`} key={segment.slug}>
                <button className="border border-default w-60 bg-white hover:bg-primary-50 dark:bg-dark dark:hover:bg-dark-900 transition-colors duration-300 p-2 rounded-md hover:cursor-pointer">
                  {segment.title}
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
