import { ApolloClient } from "@apollo/client";
import { EncryptionKeys, Key } from "./types";
import GET_BENEFICIARY_FACTORS from "@/graphql/ops/auth/queries/GET_BENEFICIARY_FACTORS";
import { GetBeneficiaryFactorsQuery } from "@/types/interfaces/metamodel";
import encrypt from "@/crypto/e0/encrypt";

async function encrypt_for_time_capsule(
  data: string | File,
  publicKey: string
): Promise<string> {
  if (typeof data === "string") {
    return await encrypt(publicKey, Buffer.from(data), true);
  } else {
    return await encrypt(
      publicKey,
      Buffer.from(await data.arrayBuffer()),
      true
    );
  }
}

export default async function generate_keys_for_beneficiaries({
  key_cluster,
  encryption_keys,
  client,
}: {
  key_cluster: Key[];
  encryption_keys: EncryptionKeys;
  client: ApolloClient;
}) {
  // get all beneficiary factors
  const beneficiary_factors = await client.query<GetBeneficiaryFactorsQuery>({
    query: GET_BENEFICIARY_FACTORS,
    fetchPolicy: "network-only",
  });
  
  if (!beneficiary_factors.data) {
    throw new Error("Failed to fetch beneficiary factors");
  }
  
  const all_beneficiary_factors =
    beneficiary_factors.data.getBeneficiaryFactors;

  // encrypt key for each beneficiary factor
  for await (const beneficiary_factor of all_beneficiary_factors) {
    const time_capsule_public_key = beneficiary_factor.publicKey;
    // if zero factors then encrypt for null key
    if (beneficiary_factor.factors.length === 0) {
      for await (const encryption_key_id of Object.keys(encryption_keys)) {
        // add encrypted key to cluster
        key_cluster.push({
          beneficiary_id: beneficiary_factor.beneficiary_id,
          ref_id: encryption_keys[encryption_key_id].metamodel_ref_id,
          publicKey: "null",
          key: await encrypt_for_time_capsule(
            encryption_keys[encryption_key_id].key,
            time_capsule_public_key
          ),
        });
      }
    }
    // otherwise encrypt for each factor
    else {
      for await (const factor of beneficiary_factor.factors) {
        for await (const encryption_key_id of Object.keys(encryption_keys)) {
          // add encrypted key to cluster
          key_cluster.push({
            beneficiary_id: beneficiary_factor.beneficiary_id,
            ref_id: encryption_keys[encryption_key_id].metamodel_ref_id,
            publicKey: factor.publicKey,
            key: await encrypt(
              factor.publicKey,
              Buffer.from(
                await encrypt_for_time_capsule(
                  encryption_keys[encryption_key_id].key,
                  time_capsule_public_key
                )
              )
            ),
          });
        }
      }
    }
  }
}
