import type { ApolloClient } from "@apollo/client";
import perform_migrate_in from "../../../../common/factor/perform_migrate_in";
import GET_BENEFICIARY_KEY_COUNT from "../../../../graphql/ops/auth/queries/GET_BENEFICIARY_KEY_COUNT";

export const UNENCRYPTED_PUBLIC_KEY = "null";

export function getMigrationSourceLabel(publicKey: string) {
  if (publicKey === UNENCRYPTED_PUBLIC_KEY) {
    return "Unencrypted vault";
  }
  return publicKey;
}

export function getMigrationSessionError(
  requiredPublicKey: string,
  sessionPublicKey?: string | null
) {
  if (requiredPublicKey === UNENCRYPTED_PUBLIC_KEY) return null;
  if (sessionPublicKey === requiredPublicKey) return null;

  return "You need to login session with key " + requiredPublicKey.slice(-8);
}

export async function executeBeneficiaryMigration({
  client,
  publicKey,
  privateKey,
  beneficiaryId,
}: {
  client: ApolloClient;
  publicKey: string;
  privateKey?: string | null;
  beneficiaryId: string;
}) {
  await perform_migrate_in(
    publicKey,
    client,
    "dosent-matter-its-a-beneficiary-id-migration",
    privateKey ?? null,
    beneficiaryId
  );

  await client.query({
    query: GET_BENEFICIARY_KEY_COUNT,
    fetchPolicy: "network-only",
  });
}
