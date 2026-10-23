// Migrates beneficiary access after a confirmed final server save.
// Owns key-session checks and browser migration error propagation.
// Does not create beneficiaries or hide failed migrations from guidance.
import type { ApolloClient } from "@apollo/client";
import toast from "react-hot-toast";
import perform_migrate_in from "@/common/factor/perform_migrate_in";
import GET_MY_KEY_COUNT from "@/graphql/ops/app/key/Queries/GET_MY_KEY_COUNT";
import GET_SMARTWILL_BENEFICIARY from "@/graphql/ops/app/smartwill/queries/GET_SMARTWILL_BENEFICIARY";
import GET_BENEFICIARY_KEY_COUNT from "@/graphql/ops/auth/queries/GET_BENEFICIARY_KEY_COUNT";
import type { GuidanceSession } from "@/types/interfaces";

export async function migrateGuidedBeneficiary(personId: string, ctx: { client: ApolloClient; session: GuidanceSession | null }, signal?: AbortSignal) {
  signal?.throwIfAborted();
  const counts = await ctx.client.query<{ getMyKeyCount: Array<{ count: number; publicKey: string }> }>({
    query: GET_MY_KEY_COUNT, fetchPolicy: "network-only",
  });
  signal?.throwIfAborted();
  let maxCount = 0;
  let maxPublicKey = "null";
  for (const item of counts.data?.getMyKeyCount ?? []) {
    if (item.count > maxCount || (maxCount > 0 && item.count === maxCount && item.publicKey === ctx.session?.publicKey)) {
      maxCount = item.count;
      maxPublicKey = item.publicKey;
    }
  }
  if (maxPublicKey !== "null" && (ctx.session?.publicKey !== maxPublicKey || !ctx.session.privateKey)) {
    toast.error(`Beneficiary added. Switch session to key ${maxPublicKey.slice(-8)} and click migrate.`);
    throw new Error("Migration requires a different encryption session");
  }
  const beneficiaries = await ctx.client.query<{ getSmartWillBeneficiaries: Array<{ id: string; person_id: string }> }>({
    query: GET_SMARTWILL_BENEFICIARY, fetchPolicy: "network-only",
  });
  signal?.throwIfAborted();
  const target = beneficiaries.data?.getSmartWillBeneficiaries.find(item => item.person_id === personId);
  if (!target) throw new Error("Migration target unavailable");
  if (maxCount === 0) return;
  await perform_migrate_in(maxPublicKey, ctx.client, "beneficiary-migration", ctx.session?.privateKey ?? null, target.id, signal);
  signal?.throwIfAborted();
  const result = await ctx.client.query<{ getBeneficiaryKeyCount: Array<{
    beneficiary_id: string; factor_wise_count: Array<{ publicKey: string; count: number }>;
  }> }>({ query: GET_BENEFICIARY_KEY_COUNT, fetchPolicy: "network-only" });
  signal?.throwIfAborted();
  const migrated = result.data?.getBeneficiaryKeyCount.find(item => item.beneficiary_id === target.id);
  const encryptedFactors = migrated?.factor_wise_count.filter(factor => factor.publicKey !== "null") ?? [];
  const targets = encryptedFactors.length > 0 ? encryptedFactors : migrated?.factor_wise_count ?? [];
  if (targets.length === 0 || targets.some(factor => factor.count < maxCount)) {
    throw new Error("Beneficiary keys are not fully synced");
  }
}
