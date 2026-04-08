"use client";

import { useLazyQuery } from "@apollo/client/react";
import { useEffect, useMemo } from "react";
import GET_FACTORS from "../../graphql/ops/auth/queries/AVAILABLE_AUTH_FACTORS";
import type { GraphQLErrorLike } from "@/types/interfaces/graphql";
import type { GetFactorsQuery } from "@/types/interfaces/metamodel";

export default function useAvailableAuthFactors(user: any) {
  const [getAuthFactors, { data: factorsData, error: factorsError }] = useLazyQuery<GetFactorsQuery>(GET_FACTORS);

  const inactive_user = useMemo<false | string>(() => {
    const graphqlError = factorsError as GraphQLErrorLike | undefined;
    const code = graphqlError?.errors?.[0]?.extensions?.code;
    return code === "USER_DEACTIVATED" ? code : false;
  }, [factorsError]);

  const available_methods = factorsData?.getFactors ?? null;

  useEffect(() => {
    if (user) {
      getAuthFactors();
    }
  }, [user, getAuthFactors]);

  return { available_methods, inactive_user };
}
