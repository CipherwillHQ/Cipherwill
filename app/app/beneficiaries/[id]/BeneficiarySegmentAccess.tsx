// Shows how many items a beneficiary is assigned in each data segment.
// Owns the segment count query, totals, and count loading or error states.
// Does not decrypt data or change the beneficiary's access choices.
"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import segments from "@/app/app/segments/segments";
import type { Segment } from "@/types/Segments";
import type { GetMetamodelTypeCountsQuery } from "@/types/interfaces";
import GET_BENEFICIARY_SEGMENT_COUNTS from "@/graphql/ops/app/smartwill/queries/GET_BENEFICIARY_SEGMENT_COUNTS";

const dataSegments = segments.filter((segment): segment is Segment => "metamodel_type" in segment);

export default function BeneficiarySegmentAccess({ beneficiaryId }: { beneficiaryId: string }) {
  const { data, loading, error } = useQuery<GetMetamodelTypeCountsQuery>(
    GET_BENEFICIARY_SEGMENT_COUNTS,
    { variables: { beneficiary_id: beneficiaryId }, fetchPolicy: "network-only" }
  );
  const counts = data?.getMetamodelTypeCounts || [];
  const countsByType = Object.fromEntries(counts.map((entry) => [entry.type, entry.count]));
  const total = counts.reduce((sum, entry) => sum + entry.count, 0);
  const segmentCount = counts.filter((entry) => entry.count > 0).length;

  return (
    <section className="min-w-0 bg-secondary border border-default rounded-2xl p-4 sm:p-6">
      <h2 className="text-base font-semibold">Data they will receive</h2>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        Based on your current beneficiary choices, excluding items withheld from this person.
        They will receive access when your will is executed.
      </p>
      {loading ? <p className="mt-4" role="status">Loading data by segment...</p> : error ? (
        <p className="mt-4" role="alert">We couldn't load the data counts. Refresh this page to try again.</p>
      ) : (
        <>
          <p className="mt-4" data-cy="beneficiary-data-total">
            <span className="text-2xl font-semibold">{total}</span> {total === 1 ? "item" : "items"}
            {" "}across {segmentCount} {segmentCount === 1 ? "segment" : "segments"}
          </p>
          {total === 0 && (
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              No data is currently assigned to this beneficiary.
            </p>
          )}
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dataSegments.map((segment) => {
              const count = countsByType[segment.metamodel_type] || 0;
              return (
                <li key={segment.metamodel_type} className="min-w-0">
                  <Link
                    href={segment.path}
                    className="flex h-full min-w-0 flex-col gap-4 rounded-2xl border border-default bg-secondary p-4 hover:border-primary/30 transition-colors active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="shrink-0 text-xl text-primary dark:text-primary-300" aria-hidden="true">
                        {segment.icon}
                      </span>
                      <span className="min-w-0 text-sm font-medium">{segment.title}</span>
                    </div>
                    <span className="text-base font-semibold tabular-nums" data-cy={`beneficiary-count-${segment.slug}`}>
                      {count} {count === 1 ? "item" : "items"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
