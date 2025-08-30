import { ApolloClient } from "@apollo/client";
import { EncryptionKeys, Key } from "./types";
import GET_FACTORS from "@/graphql/ops/auth/queries/AVAILABLE_AUTH_FACTORS";
import { GetFactorsQuery } from "@/types/interfaces/metamodel";
import encrypt from "@/crypto/e0/encrypt";

export default async function generate_keys_for_own_factors({
  key_cluster,
  encryption_keys,
  client,
}: {
  key_cluster: Key[];
  encryption_keys: EncryptionKeys;
  client: ApolloClient;
}) {
  // get all own factors
  const factors = await client.query<GetFactorsQuery>({
    query: GET_FACTORS,
    fetchPolicy:"network-only"
  });

  const all_factors = factors.data?.getFactors || [];

  // if zero factors then encrypt for null key
  if (all_factors.length === 0) {
    for await (const encryption_key_id of Object.keys(encryption_keys)) {
      key_cluster.push({
        beneficiary_id: "null",
        ref_id: encryption_keys[encryption_key_id].metamodel_ref_id,
        publicKey: "null",
        key: encryption_keys[encryption_key_id].key,
      });
    }
  }
  // otherwise encrypt for each factor
  else {
    for await (const factor of all_factors) {
      for await (const encryption_key_id of Object.keys(encryption_keys)) {
        key_cluster.push({
          beneficiary_id: "null",
          ref_id: encryption_keys[encryption_key_id].metamodel_ref_id,
          publicKey: factor.publicKey,
          key: await encrypt(
            factor.publicKey,
            Buffer.from(encryption_keys[encryption_key_id].key)
          ),
        });
      }
    }
  }
}
