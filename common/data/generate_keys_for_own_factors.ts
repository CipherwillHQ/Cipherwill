import { ApolloClient } from "@apollo/client";
import { EncryptionKey, Key } from "./types";
import GET_FACTORS from "@/graphql/ops/auth/queries/AVAILABLE_AUTH_FACTORS";
import { GetFactorsQuery } from "@/types/interfaces/metamodel";
import encrypt from "@/crypto/e0/encrypt";

export default async function generate_keys_for_own_factors({
  key_cluster,
  encryption_key,
  client,
}: {
  key_cluster: Key[];
  encryption_key: EncryptionKey;
  client: ApolloClient;
}) {
  // get all own factors
  const factors = await client.query<GetFactorsQuery>({
    query: GET_FACTORS,
    fetchPolicy: "network-only"
  });

  const all_factors = factors.data?.getFactors || [];

  // if zero factors then encrypt for null key
  if (all_factors.length === 0) {
    key_cluster.push({
      beneficiary_id: "null",
      ref_id: encryption_key.metamodel_ref_id,
      publicKey: "null",
      key: encryption_key.key,
    });
  }
  // otherwise encrypt for each factor
  else {
    for await (const factor of all_factors) {
      key_cluster.push({
        beneficiary_id: "null",
        ref_id: encryption_key.metamodel_ref_id,
        publicKey: factor.publicKey,
        key: await encrypt(
          factor.publicKey,
          Buffer.from(encryption_key.key)
        ),
      });
    }
  }
}
