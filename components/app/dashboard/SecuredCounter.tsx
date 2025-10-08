"use client";
import { useQuery } from "@apollo/client/react";
import GET_METAMODEL_TYPE_COUNTS from "../../../graphql/ops/app/metamodel/queries/GET_METAMODEL_TYPE_COUNTS";
import { GetMetamodelTypeCountsQuery } from "@/types/interfaces/metamodel";
import { TbShieldCheck } from "react-icons/tb";

export default function SecuredCounter() {
  const { loading, error, data } = useQuery<GetMetamodelTypeCountsQuery>(
    GET_METAMODEL_TYPE_COUNTS
  );

  if (loading) return null;

  if (error)
    return (
      <div className="flex flex-col gap-3 bg-secondary border border-default rounded-lg p-4 h-96 overflow-auto customScrollbar">
        <div className="flex items-center gap-3">
          <TbShieldCheck className="text-primary" size={24} />
          <h2 className="font-semibold text-lg">Secured Items</h2>
        </div>
        <div className="text-sm text-red-500">Error loading data</div>
      </div>
    );

  const totalCount =
    data?.getMetamodelTypeCounts?.reduce((sum, item) => sum + item.count, 0) ||
    0;
  const typesCount = data?.getMetamodelTypeCounts?.length || 0;

  // Hide component if no secured items
  if (totalCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 justify-between bg-secondary border border-default rounded-lg p-4 h-96 overflow-auto customScrollbar">
      <div
      className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3">
        <TbShieldCheck className="text-primary flex-shrink-0" size={24} />
        <h2 className="font-semibold text-lg">Secured Data</h2>
      </div>

      <div className="">
        You've secured{" "}
        <span className="font-semibold">{typesCount}</span>{" "}
        {totalCount === 1 ? "type" : "types"} of data
      </div>

      {data?.getMetamodelTypeCounts && data.getMetamodelTypeCounts.length > 0 && (
        <div className="">
          {data.getMetamodelTypeCounts.map((item) => (
            <div
              key={item.type}
              className="flex items-center justify-between"
            >
              <span className="text-sm font-medium capitalize">
                {item.type.replace(/_/g, " ")}
              </span>
              <span className="text-sm font-bold">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-default">
        <span className="font-medium">Total Secured Data Points</span>
        <span className="font-bold">
          {totalCount.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
