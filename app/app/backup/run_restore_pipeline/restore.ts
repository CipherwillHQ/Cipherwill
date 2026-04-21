import toast from "react-hot-toast";
import GET_METAMODEL from "../../../../graphql/ops/app/metamodel/queries/GET_METAMODEL";
import CREATE_METAMODEL from "../../../../graphql/ops/app/metamodel/mutations/CREATE_METAMODEL";
import logger from "../../../../common/debug/logger";
import { sleep } from "../../../../common/time/sleep";
import upload_pod_data from "@/common/data/upload_pod_data";
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

    try {
      await client.query({
        query: GET_METAMODEL,
        fetchPolicy: "network-only",
        variables: {
          id: item.id,
        },
      });
      continue;
    } catch (error) {
      const errorCode = (error as GraphQLErrorLike)?.errors?.[0]?.extensions?.code;
      if (errorCode !== "MODEL_NOT_FOUND") {
        throw new RestoreStepError("restore", "Error while restoring backup", error);
      }
    }

    try {
      const response = await client.mutate({
        mutation: CREATE_METAMODEL,
        variables: {
          id: item.id,
          type: item.type,
          metadata: metamodelAdapter.getMetadata(item),
        },
      });

      if (dataAdapter.shouldUploadData && !dataAdapter.shouldUploadData(item)) {
        logger.info("Skipping uploading data for pod", item.id);
        continue;
      }

      await upload_pod_data({
        data_item: {
          ref_id: item.id,
          data_model_version: dataAdapter.getDataModelVersion(item),
          publicKey: session ? session.publicKey : undefined,
          data: dataAdapter.getUploadData(item),
        },
        client,
        metamodel_id: (response.data as any).createMetamodel.id,
      });
    } catch (error) {
      toast.error(`Error while uploading data: ${error}`);
    }
  }
}
