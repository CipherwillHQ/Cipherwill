"use client";

import { useLazyQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import GET_FACTORS from "../../graphql/ops/auth/queries/AVAILABLE_AUTH_FACTORS";
import type { GraphQLErrorLike } from "@/types/interfaces/graphql";
import type { GetFactorsQuery } from "@/types/interfaces/metamodel";

export default function useAvailableAuthFactors(user: any) {
  const [available_methods, set_available_methods] = useState<any | null>(null);
  const [inactive_user, set_inactive_user] = useState<false | string>(false);
  const [getAuthFactors, { data: factorsData, error: factorsError }] = useLazyQuery<GetFactorsQuery>(GET_FACTORS);

  useEffect(() => {
    if (factorsData?.getFactors) {
      set_available_methods(factorsData.getFactors);
    }
  }, [factorsData]);

  useEffect(() => {
    const graphqlError = factorsError as GraphQLErrorLike | undefined;
    const code = graphqlError?.errors?.[0]?.extensions?.code;
    if (code === "USER_DEACTIVATED") {
      set_inactive_user(code);
    }
  }, [factorsError]);

  useEffect(() => {
    if (user) {
      getAuthFactors();
    }
  }, [user, getAuthFactors]);

  return { available_methods, inactive_user };
}
