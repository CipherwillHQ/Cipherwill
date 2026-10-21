// Loads populated segments for the current executor access record.
// Owns the shared Apollo query and filtering used by overview and navigation.
// Does not infer availability from paginated item lists or load item contents.

"use client";

import { useQuery } from "@apollo/client/react";
import { getAvailableExecutorSegments } from "@/common/executor/segments";
import GET_GRANTED_METAMODEL_TYPE_COUNTS from "@/graphql/ops/app/executor/metamodels/GET_GRANTED_METAMODEL_TYPE_COUNTS";
import type { GetAccessDetailsVariables, GetGrantedMetamodelTypeCountsQuery } from "@/types/interfaces";

export default function useExecutorSegments(accessId?: string) {
  const { data, loading, error, refetch } = useQuery<GetGrantedMetamodelTypeCountsQuery, GetAccessDetailsVariables>(
    GET_GRANTED_METAMODEL_TYPE_COUNTS,
    { variables: { access_id: accessId ?? "" }, skip: !accessId },
  );

  return {
    segments: data ? getAvailableExecutorSegments(data.getGrantedMetamodelTypeCounts) : [],
    loading,
    error,
    refetch,
  };
}
