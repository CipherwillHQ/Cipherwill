// Tests note format compatibility during restore.
// Owns legacy and current note serialization fixtures.
// Does not upload data or access live account contents.

import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { pathToFileURL } from "node:url";
import { resolveRestoreAdapter } from "./adapters";

mock.module("../../../../common/debug/logger.ts", { defaultExport: { error: mock.fn() } });
mock.module(pathToFileURL(require.resolve("react-hot-toast")), { defaultExport: { error: mock.fn() } });

for (const data of ["Old note\nSecond line", { type: "note", version: "0.0.1", data: "Old note\nSecond line" }]) {
  test(`legacy ${typeof data} note opens after restore`, async () => {
    const { parsePodJsonToModel } = await import("../../../../contexts/PodHelper/helpers");
    const item = { id: "legacy-note", type: "NOTE", data };
    const restored = resolveRestoreAdapter({ item }).getUploadData(item);
    const parsed = parsePodJsonToModel(restored, { TYPE: "note", VERSION: "0.0.2", REF_ID: item.id, DATA_SAMPLE: {} });
    assert.deepEqual(parsed?.data, { content: "Old note</br>Second line" });
  });
}

test("current notes and bank accounts preserve their fields", () => {
  for (const item of [
    { id: "note", type: "NOTE", data: { type: "note", version: "0.0.2", data: { content: "Current note" } } },
    { id: "bank", type: "BANK_ACCOUNT", data: { type: "bank_account", version: "0.0.1", data: { bank_name: "Bank" } } },
  ]) {
    assert.deepEqual(JSON.parse(resolveRestoreAdapter({ item }).getUploadData(item)), item.data);
  }
});
