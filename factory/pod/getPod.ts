import { ApolloClient } from "@apollo/client";
import GET_POD from "../../graphql/ops/app/pod/queries/GET_POD";
import { GetPodQuery, GetPodVariables } from "../../types/interfaces/metamodel";
import type { GraphQLErrorLike } from "../../types/interfaces/graphql";

export default async function getPod(
  ref_id: string,
  client: ApolloClient
) {
  try {
    const pod = await client.query<GetPodQuery, GetPodVariables>({
      query: GET_POD,
      fetchPolicy: "network-only",
      variables: {
        ref_id,
      },
    });
    if (pod?.data?.getPod?.content) {
      return pod.data.getPod.content;
    } else {
      return pod.data?.getPod?.content || null;
    }
  } catch (error) {
    const errorCode = (error as GraphQLErrorLike)?.errors?.[0]?.extensions?.code;
    if (errorCode === "POD_NOT_FOUND") {
      return null;
    } else {
      throw error;
    }
  }
}
