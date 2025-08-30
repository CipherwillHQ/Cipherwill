"use client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import GET_ACCESS_DETAILS from "../../../graphql/ops/app/executor/access/queries/GET_ACCESS_DETAILS";
import getTimeRemaining from "../../../common/time/getTimeRemaining";
import DonorDetails from "./DonorDetails";
import { useParams } from "next/navigation";
import segments from "@/app/app/segments/segments";
import { Divider, Segment } from "@/types/Segments";
import type { 
  GetAccessDetailsQuery, 
  GetAccessDetailsVariables 
} from "@/types/interfaces/metamodel";

export default function ExecutorPanel() {
  const params = useParams() as { id: string };

  const id = params?.id;

  const { loading, error, data } = useQuery<GetAccessDetailsQuery, GetAccessDetailsVariables>(
    GET_ACCESS_DETAILS, 
    {
      variables: {
        id,
      },
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <div>Error : {error.message}</div>;
  if (!data?.getAccessDetails) return <div>No access details available</div>;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        <h2>Execution Panel for</h2>
        <DonorDetails id={data.getAccessDetails.user} />
        Valid Until:{" "}
        {getTimeRemaining(parseInt(data.getAccessDetails.expire_at))}
        <div className="flex flex-wrap gap-2">
          {segments.map((segment: Segment) => {
            if ("divider" in segment && segment.divider)
              return (
                <div key={(segment as Divider).divider} className="w-full">
                  {(segment as Divider).divider}
                </div>
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
