// Tests backup completion and failures at validation and ZIP creation.
// Owns deferred ZIP generation with mocked export data and downloads.
// Does not open a browser or access live services.

import assert from "node:assert/strict";
import { beforeEach, mock, test } from "node:test";
import { setImmediate } from "node:timers/promises";
import { pathToFileURL } from "node:url";

const query = mock.fn(async (_input: any): Promise<any> => ({ data: { getMyKeyCount: [{ publicKey: "null", count: 1 }] } }));
const generateZip = mock.fn(async (_options: any) => new Blob(["backup"]));
const saveAs = mock.fn();
const file = mock.fn();
const statuses: string[] = [];
class BackupZip {
  file = file;
  generateAsync = generateZip;
}
mock.module(pathToFileURL(require.resolve("jszip")), { defaultExport: BackupZip });
mock.module(pathToFileURL(require.resolve("file-saver")), { namedExports: { saveAs } });
mock.module("../../../common/debug/logger.ts", { defaultExport: { info: mock.fn(), error: mock.fn() } });
mock.module("../../../common/time/sleep.ts", { namedExports: { sleep: async () => {} } });
mock.module(pathToFileURL(require.resolve("react-hot-toast")), { defaultExport: { error: mock.fn(), success: mock.fn() } });
mock.module("./run_backup_pipeline/collect.ts", { namedExports: { collectBackupData: async () => ({ keysByRef: {}, models: [] }) } });
mock.module("./run_backup_pipeline/decrypt.ts", { namedExports: { decryptBackupData: async () => [] } });
const input = {
  status: "Not started", setStatus: (value: string) => statuses.push(value), setProgress: mock.fn(),
  setDataPoints: mock.fn(), close: mock.fn(), session: null, client: { query } as any,
};

beforeEach(() => {
  statuses.length = 0;
  saveAs.mock.resetCalls();
  query.mock.mockImplementation(async () => ({ data: { getMyKeyCount: [{ publicKey: "null", count: 1 }] } }));
  generateZip.mock.mockImplementation(async () => new Blob(["backup"]));
});

test("ZIP generation finishes before backup reports completion", async () => {
  const { default: runBackup } = await import("./run_backup");
  let finishZip!: (value: Blob) => void;
  generateZip.mock.mockImplementation(() => new Promise<Blob>(resolve => { finishZip = resolve; }));
  const pending = runBackup(input);
  await setImmediate();
  assert.equal(statuses.includes("Completed backup"), false);
  assert.equal(saveAs.mock.callCount(), 0);
  finishZip(new Blob(["backup"]));
  await pending;
  assert.equal(statuses.at(-1), "Completed backup");
  assert.equal(saveAs.mock.callCount(), 1);
});

test("ZIP failure reports an error and never completion", async () => {
  const { default: runBackup } = await import("./run_backup");
  generateZip.mock.mockImplementation(async () => { throw new Error("ZIP generation failed"); });
  await runBackup(input);
  assert.equal(statuses.at(-1), "Error while backing up");
  assert.equal(statuses.includes("Completed backup"), false);
  assert.equal(saveAs.mock.callCount(), 0);
});

test("initial count-query failure reaches backup error handling", async () => {
  const { default: runBackup } = await import("./run_backup");
  query.mock.mockImplementation(async () => { throw new Error("Network unavailable"); });
  await runBackup(input);
  assert.equal(statuses.at(-1), "Error while backing up");
});
