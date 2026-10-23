// Wraps pod keys for permitted beneficiaries with cancellation.
// Owns guarded recipient reads and per-factor key encryption.
// Does not upload pods or commit wrapped keys.
import { ApolloClient } from "@apollo/client";
import { EncryptionKeys, Key } from "./types";
import GET_BENEFICIARY_FACTORS from "@/graphql/ops/auth/queries/GET_BENEFICIARY_FACTORS";
import { GetBeneficiaryFactorsQuery } from "@/types/interfaces/metamodel";
import { encryptWrappedKey } from "./encryptWrappedKey";

export default async function generate_keys_for_beneficiaries({
  key_cluster,
  encryption_keys,
  client,
  ignored_beneficiaries,
  signal,
}: {
  key_cluster: Key[];
  encryption_keys: EncryptionKeys;
  client: ApolloClient;
  signal?: AbortSignal;
  ignored_beneficiaries: string[];
}) {
  signal?.throwIfAborted();
  // get all beneficiary factors
  const beneficiary_factors = await client.query<GetBeneficiaryFactorsQuery>({
    query: GET_BENEFICIARY_FACTORS,
    fetchPolicy: "network-only",
  });
  
  signal?.throwIfAborted();
  if (!beneficiary_factors.data) {
    throw new Error("Failed to fetch beneficiary factors");
  }
  
  const all_beneficiary_factors =
    beneficiary_factors.data.getBeneficiaryFactors;

  // encrypt key for each beneficiary factor
  for await (const beneficiary_factor of all_beneficiary_factors) {
    if(
      ignored_beneficiaries.includes(beneficiary_factor.beneficiary_id)
    ){
      // if beneficiary is ignored, skip key generation for that beneficiary
      continue;
    }
    signal?.throwIfAborted();
    const time_capsule_public_key = beneficiary_factor.publicKey;
    // if zero factors then encrypt for null key
    if (beneficiary_factor.factors.length === 0) {
      for await (const encryption_key_id of Object.keys(encryption_keys)) {
        signal?.throwIfAborted();
        // add encrypted key to cluster
        key_cluster.push({
          beneficiary_id: beneficiary_factor.beneficiary_id,
          ref_id: encryption_keys[encryption_key_id].metamodel_ref_id,
          publicKey: "null",
          key: await encryptWrappedKey(
            encryption_keys[encryption_key_id].key,
            time_capsule_public_key, true, signal
          ),
        });
      }
    }
    // otherwise encrypt for each factor
    else {
      for await (const factor of beneficiary_factor.factors) {
        for await (const encryption_key_id of Object.keys(encryption_keys)) {
          signal?.throwIfAborted();
          // add encrypted key to cluster
          key_cluster.push({
            beneficiary_id: beneficiary_factor.beneficiary_id,
            ref_id: encryption_keys[encryption_key_id].metamodel_ref_id,
            publicKey: factor.publicKey,
            key: await encryptWrappedKey(
              await encryptWrappedKey(encryption_keys[encryption_key_id].key, time_capsule_public_key, true, signal),
              factor.publicKey, false, signal
            ),
          });
        }
      }
    }
  }
  signal?.throwIfAborted();
}
