// Restores missing text items from a local backup.
// Owns exclusion persistence, upload failures, and safe retry decisions.
// Does not overwrite existing saved content or restore storage files.

import GET_METAMODEL from "../../../../graphql/ops/app/metamodel/queries/GET_METAMODEL";
import CREATE_METAMODEL from "../../../../graphql/ops/app/metamodel/mutations/CREATE_METAMODEL";
import logger from "../../../../common/debug/logger";
import { sleep } from "../../../../common/time/sleep";
import upload_pod_data from "@/common/data/upload_pod_data";
import { isPodReadable } from "@/common/data/is_pod_readable";
import type { GetMetamodelQuery } from "@/types/interfaces";
import type { GraphQLErrorLike } from "@/types/interfaces/graphql";
import { resolveMetamodelAdapter, resolveRestoreAdapter } from "./adapters";
import { RestoreStepError } from "./errors";
import { LoadedBackupPayload, RunRestoreArgs } from "./types";

export async function runRestoreLoop(
  { setStatus, client, session }: Pick<RunRestoreArgs, "setStatus" | "client" | "session">,
  payload: LoadedBackupPayload
) {
  logger.info(`Restoring backup file version ${payload.version}`);
  const totalCount = payload.data.length;
  let currentCount = 0;
  const metamodelAdapter = resolveMetamodelAdapter({
    backupVersion: payload.version,
  });

  for (const item of payload.data) {
    if (item.type === "FILE") {
      continue;
    }
    const dataAdapter = resolveRestoreAdapter({
      item,
    });

    currentCount++;
    setStatus(
      `Restoring (${currentCount}/${totalCount}) | Time remaining: ${(
        (totalCount - currentCount) /
        60
      ).toFixed(2)} minutes`
    );
    await sleep(800);

    let metamodel: GetMetamodelQuery["getMetamodel"] | undefined;
    try {
      const response = await client.query<GetMetamodelQuery>({
        query: GET_METAMODEL,
        fetchPolicy: "network-only",
        variables: {
          id: item.id,
        },
      });
      metamodel = response.data?.getMetamodel;
    } catch (error) {
      const errorCode = (error as GraphQLErrorLike)?.errors?.[0]?.extensions?.code;
      if (errorCode !== "MODEL_NOT_FOUND") {
        throw new RestoreStepError("restore", "Error while restoring backup", error);
      }
    }

    try {
      if (metamodel && await isPodReadable({ id: item.id, client, session })) {
        continue;
      }

      const ignoredBeneficiaries = [...new Set([
        ...(metamodel?.ignored_beneficiaries || []),
        ...(item.ignored_beneficiaries || []),
      ])];
      if (!metamodel || ignoredBeneficiaries.length !== (metamodel.ignored_beneficiaries || []).length) {
        await client.mutate({
          mutation: CREATE_METAMODEL,
          variables: {
            id: item.id,
            type: metamodel?.type || item.type,
            metadata: metamodel?.metadata || metamodelAdapter.getMetadata(item),
            ignored_beneficiaries: item.ignored_beneficiaries || [],
            restore: true,
          },
        });
      }

      if (dataAdapter.shouldUploadData && !dataAdapter.shouldUploadData(item)) {
        logger.info("Skipping uploading data for pod", item.id);
        continue;
      }

      await upload_pod_data({
        data_items: [
          {
            ref_id: item.id,
            data_model_version: dataAdapter.getDataModelVersion(item),
            publicKey: session ? session.publicKey : undefined,
            data: dataAdapter.getUploadData(item),
          },
        ],
        client,
        metamodel_id: item.id,
        require_missing_pod: true,
      });
    } catch (error) {
      throw new RestoreStepError("restore", error instanceof Error ? error.message : "Error while restoring backup", error);
    }
  }
}
