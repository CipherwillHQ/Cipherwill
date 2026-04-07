import type { ApolloClient } from "@apollo/client";
import toast from "react-hot-toast";
import perform_migrate_in from "@/common/factor/perform_migrate_in";
import GET_SMARTWILL_BENEFICIARY from "../../../../graphql/ops/app/smartwill/queries/GET_SMARTWILL_BENEFICIARY";
import GET_BENEFICIARY_KEY_COUNT from "../../../../graphql/ops/auth/queries/GET_BENEFICIARY_KEY_COUNT";
import {
  handleBlockedMigration,
  setMigratingProgress,
  setMigrationSuccess,
} from "./progress";
import type { SetMigrationProgress } from "./progress";
import type { BeneficiaryRecord, MigrationTargetResult } from "./types";

type AddBeneficiaryMutation = (options: any) => Promise<any>;

type PipelineContext = {
  personId: string;
  maxPublicKey: string;
  sessionPublicKey?: string | null;
  sessionPrivateKey?: string | null;
  client: ApolloClient;
  addBeneficiary: AddBeneficiaryMutation;
  setMigrationProgress: SetMigrationProgress;
};

const getBeneficiaryList = async (
  client: ApolloClient
): Promise<BeneficiaryRecord[]> => {
  const result = await client.query({
    query: GET_SMARTWILL_BENEFICIARY,
    fetchPolicy: "network-only",
  });
  return (
    ((result.data as any)?.getSmartWillBeneficiaries as BeneficiaryRecord[]) ||
    []
  );
};

export const createBeneficiary = async ({
  personId,
  client,
  addBeneficiary,
}: Pick<PipelineContext, "personId" | "client" | "addBeneficiary">) => {
  const beforeList = await getBeneficiaryList(client);
  const existingBeneficiaryIds = new Set(
    beforeList.filter((x) => x.person_id === personId).map((x) => x.id)
  );

  await addBeneficiary({
    variables: {
      id: personId,
    },
    refetchQueries: [
      {
        query: GET_SMARTWILL_BENEFICIARY,
      },
      {
        query: GET_BENEFICIARY_KEY_COUNT,
      },
    ],
    awaitRefetchQueries: true,
  });

  toast.success("Beneficiary Added");

  return {
    existingBeneficiaryIds,
  };
};

export const resolveAddedBeneficiary = async ({
  personId,
  existingBeneficiaryIds,
  client,
}: {
  personId: string;
  existingBeneficiaryIds: Set<string>;
  client: ApolloClient;
}) => {
  const afterList = await getBeneficiaryList(client);
  return (
    afterList.find(
      (x) => x.person_id === personId && !existingBeneficiaryIds.has(x.id)
    ) || afterList.find((x) => x.person_id === personId)
  );
};

export const canAutoMigrate = ({
  maxPublicKey,
  sessionPublicKey,
}: Pick<PipelineContext, "maxPublicKey" | "sessionPublicKey">) => {
  if (maxPublicKey !== "null" && sessionPublicKey !== maxPublicKey) {
    return {
      ok: false as const,
      requiredKeySuffix: maxPublicKey.slice(-8),
    };
  }

  return {
    ok: true as const,
    requiredKeySuffix: null,
  };
};

const prepareMigrationTarget = async ({
  personId,
  maxPublicKey,
  sessionPublicKey,
  client,
  existingBeneficiaryIds,
}: Pick<
  PipelineContext,
  "personId" | "maxPublicKey" | "sessionPublicKey" | "client"
> & {
  existingBeneficiaryIds: Set<string>;
}): Promise<MigrationTargetResult> => {
  const addedBeneficiary = await resolveAddedBeneficiary({
    personId,
    existingBeneficiaryIds,
    client,
  });

  if (!addedBeneficiary) {
    return { ok: false, reason: "missing-added-beneficiary" };
  }

  const autoMigrate = canAutoMigrate({
    maxPublicKey,
    sessionPublicKey,
  });

  if (!autoMigrate.ok) {
    return {
      ok: false,
      reason: "key-mismatch",
      requiredKeySuffix: autoMigrate.requiredKeySuffix ?? undefined,
    };
  }

  return { ok: true, beneficiaryId: addedBeneficiary.id };
};

export const runMigration = async ({
  beneficiaryId,
  maxPublicKey,
  sessionPrivateKey,
  client,
}: {
  beneficiaryId: string;
  maxPublicKey: string;
  sessionPrivateKey?: string | null;
  client: ApolloClient;
}) => {
  toast.success(
    `Migration Started from -> ${
      maxPublicKey === "null" ? "Unencrypted vault" : maxPublicKey
    }`
  );

  await perform_migrate_in(
    maxPublicKey,
    client,
    "dosent-matter-its-a-beneficiary-id-migration",
    sessionPrivateKey ?? null,
    beneficiaryId
  );

  await client.query({
    query: GET_BENEFICIARY_KEY_COUNT,
    fetchPolicy: "network-only",
  });

  toast.success(
    `Migration Completed from -> ${
      maxPublicKey === "null" ? "Unencrypted vault" : maxPublicKey
    }`
  );
};

export const executeBeneficiaryAutoMigrationPipeline = async (
  context: PipelineContext
) => {
  const { existingBeneficiaryIds } = await createBeneficiary(context);
  setMigratingProgress(context.setMigrationProgress);

  const target = await prepareMigrationTarget({
    ...context,
    existingBeneficiaryIds,
  });

  if (!target.ok) {
    handleBlockedMigration(target, context.setMigrationProgress);
    return;
  }

  await runMigration({
    beneficiaryId: target.beneficiaryId,
    maxPublicKey: context.maxPublicKey,
    sessionPrivateKey: context.sessionPrivateKey,
    client: context.client,
  });
  setMigrationSuccess(context.setMigrationProgress);
};
