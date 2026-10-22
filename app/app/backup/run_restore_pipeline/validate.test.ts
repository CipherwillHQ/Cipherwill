// Tests ZIP selection and archive validation.
// Owns valid backups with missing MIME types and invalid file fixtures.
// Does not restore records or use a browser.

import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { pathToFileURL } from "node:url";
import JSZip from "jszip";

mock.module(pathToFileURL(require.resolve("react-hot-toast")), { defaultExport: { error: mock.fn(), success: mock.fn() } });
mock.module("../../../../common/time/sleep.ts", { namedExports: { sleep: async () => {} } });

test("valid ZIP backups load even without a MIME type", async () => {
  const { validateRestoreInput } = await import("./validate");
  const { loadRestorePayload } = await import("./load");
  const zip = new JSZip();
  zip.file("backup.json", JSON.stringify({ type: "CIPHERWILL_BACKUP", version: "0.0.2", data: [] }));
  const bytes = await zip.generateAsync({ type: "uint8array" });
  const file = new File([bytes as Uint8Array<ArrayBuffer>], "BACKUP.ZIP");
  assert.equal(validateRestoreInput({ backupFile: file }), file);
  assert.deepEqual(await loadRestorePayload({ setStatus: () => {} }, file), { version: "0.0.2", data: [] });
});

test("wrong file types and invalid ZIP contents remain rejected", async () => {
  const { validateRestoreInput } = await import("./validate");
  const { loadRestorePayload } = await import("./load");
  assert.equal(validateRestoreInput({ backupFile: new File(["text"], "backup.txt", { type: "text/plain" }) }), null);
  await assert.rejects(loadRestorePayload({ setStatus: () => {} }, new File(["text"], "backup.zip")), /Error while reading backup file/);
});
