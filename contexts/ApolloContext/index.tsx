"use client";

import React, { ReactNode, useState } from "react";
import { ApolloProvider } from "@apollo/client";
import { getGraphQLClient } from "../../graphql/client";
import { useAuth } from "../AuthContext";

interface Props {
  children?: ReactNode;
}

export function ApolloContext({ children }: Props) {
  const { getJWT } = useAuth();
  // Setting client as state objects helps to maintain the cache
  const [client] = useState(getGraphQLClient(getJWT));
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
