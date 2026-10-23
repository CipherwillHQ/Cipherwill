// Shares the initial account and catalog read between guidance services.
// Owns one bootstrap request and clearing a failed promise for retry.
// Does not process steps or fetch/decrypt asset context.
import type { ApolloClient } from "@apollo/client";
import type { GuidanceBootstrapData } from "@/types/interfaces";
import { GET_GUIDANCE_ACCOUNT } from "./completionQueries";

export class InitialGuidance {
  private pending: Promise<ApolloClient.QueryResult<GuidanceBootstrapData>> | null = null;

  constructor(private client: ApolloClient) {}

  load(refresh = false) {
    if (refresh) this.pending = null;
    return this.pending ??= this.client.query<GuidanceBootstrapData>({
      query: GET_GUIDANCE_ACCOUNT, fetchPolicy: "no-cache",
    }).catch(error => { this.pending = null; throw error; });
  }
}
