import { ApolloClient } from "@apollo/client";
import toast from "react-hot-toast";
import logger from "@/common/debug/logger";
import perform_migrate_in from "@/common/factor/perform_migrate_in";
import GET_MY_KEY_COUNT from "../../../../graphql/ops/app/key/Queries/GET_MY_KEY_COUNT";
import GET_SMARTWILL_BENEFICIARY from "../../../../graphql/ops/app/smartwill/queries/GET_SMARTWILL_BENEFICIARY";
import GET_BENEFICIARY_KEY_COUNT from "../../../../graphql/ops/auth/queries/GET_BENEFICIARY_KEY_COUNT";
import type { ObjectiveActionSpec } from "./types";

type SessionLike = {
  publicKey?: string | null;
  privateKey?: string | null;
} | null;

export type ObjectiveActionExecutionContext = {
  client: ApolloClient;
  session: SessionLike;
};

async function runBeneficiaryMigrationAction(
  action: ObjectiveActionSpec,
  ctx: ObjectiveActionExecutionContext,
) {
  const beneficiaryPersonId =
    typeof action.payload?.beneficiaryPersonId === "string"
      ? action.payload.beneficiaryPersonId
      : null;

  if (!beneficiaryPersonId) {
    logger.warn("Skipping migrate_beneficiary_data action without beneficiaryPersonId");
    return;
  }

  const keyCountResult = await ctx.client.query({
    query: GET_MY_KEY_COUNT,
    fetchPolicy: "network-only",
  });

  let maxCount = 0;
  let maxPublicKey = "null";
  const counts = (keyCountResult.data as any)?.getMyKeyCount ?? [];
  for (const keyItem of counts) {
    if (keyItem.count > maxCount) {
      maxCount = keyItem.count;
      maxPublicKey = keyItem.publicKey;
    }
  }

  if (maxPublicKey !== "null" && ctx.session?.publicKey !== maxPublicKey) {
    toast.error(
      "Beneficiary added. Switch session to key " +
        maxPublicKey.slice(-8) +
        " and click migrate.",
    );
    return;
  }

  const beneficiariesResult = await ctx.client.query({
    query: GET_SMARTWILL_BENEFICIARY,
    fetchPolicy: "network-only",
  });
  const beneficiaries =
    ((beneficiariesResult.data as any)?.getSmartWillBeneficiaries as any[]) || [];
  const targetBeneficiary = beneficiaries.find(
    (item: any) => item.person_id === beneficiaryPersonId,
  );

  if (!targetBeneficiary?.id) {
    toast.error(
      "Beneficiary was added, but migration could not identify the target. Use Click to Migrate.",
    );
    return;
  }

  toast.success(
    `Migration Started from -> ${
      maxPublicKey === "null" ? "Unencrypted vault" : maxPublicKey
    }`,
  );
  await perform_migrate_in(
    maxPublicKey,
    ctx.client,
    "dosent-matter-its-a-beneficiary-id-migration",
    ctx.session ? (ctx.session.privateKey ?? null) : null,
    targetBeneficiary.id,
  );
  await ctx.client.query({
    query: GET_BENEFICIARY_KEY_COUNT,
    fetchPolicy: "network-only",
  });
  toast.success(
    `Migration Completed from -> ${
      maxPublicKey === "null" ? "Unencrypted vault" : maxPublicKey
    }`,
  );
}

export async function executeObjectiveAction(
  action: ObjectiveActionSpec,
  ctx: ObjectiveActionExecutionContext,
) {
  if (action.type === "migrate_beneficiary_data") {
    await runBeneficiaryMigrationAction(action, ctx);
    return;
  }

  logger.warn(`No objective action handler registered for action type: ${action.type}`);
}
