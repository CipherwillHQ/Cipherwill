"use client";

import React, { ReactNode, useState } from "react";
import { ApolloProvider } from "@apollo/client/react";
import { getGraphQLClient } from "../../graphql/client";
import { useAuth } from "../AuthContext";
import { ComponentProps } from "@/types/interfaces";

export function ApolloContext({ children }: ComponentProps) {
  const { getJWT } = useAuth();
  // Setting client as state objects helps to maintain the cache
  const [client] = useState(getGraphQLClient(getJWT));
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
