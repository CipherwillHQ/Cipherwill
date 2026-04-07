import { sleep } from "../../../../common/time/sleep";
import getAllKeys from "../../../../factory/key/getAllKeys";
import getAllMetamodels from "../../../../factory/metamodel/getAllMetamodels";
import {
  RunBackupArgs,
  ValidationResult,
  CollectionResult,
  BackupKey,
  BackupModel,
} from "./types";

export async function collectBackupData(
  { setDataPoints, setStatus, setProgress, client }: RunBackupArgs,
  { dataCount, maxPublicKey }: ValidationResult
): Promise<CollectionResult> {
  setDataPoints(dataCount.count);
  setStatus("Downloading encrypted data");
  setProgress(10);

  const keys = (await getAllKeys({
    client,
    maxPublicKey,
  })) as BackupKey[];

  const keysByRef = keys.reduce(
    (acc, key) => ({ ...acc, [key.ref_id]: key }),
    {} as Record<string, BackupKey>
  );

  await sleep(1000);
  setStatus("Downloading metadata");
  setProgress(20);

  const models = (await getAllMetamodels({
    client,
  })) as BackupModel[];

  await sleep(1000);
  return { keysByRef, models };
}
