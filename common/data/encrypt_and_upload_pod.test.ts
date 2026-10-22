// Tests conditional session creation through the encrypted upload pipeline.
// Owns restore guard forwarding and ordinary save compatibility.
// Does not contact a backend or upload to object storage.

import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { pathToFileURL } from "node:url";
import CryptoJS from "crypto-js";

mock.module("../debug/logger.ts", { defaultExport: { info: mock.fn(), error: mock.fn() } });
mock.module(pathToFileURL(require.resolve("react-hot-toast")), { defaultExport: { error: mock.fn() } });

test("restore requests the server guard and ordinary uploads leave it disabled", async () => {
  const { default: encryptAndUpload } = await import("./encrypt_and_upload_pod");
  for (const require_missing_pod of [true, undefined]) {
    const mutate = mock.fn(async ({ mutation, variables }: any) => {
      if (mutation.definitions[0].name.value === "createUploadPodSession") {
        assert.equal(variables.require_missing_pod, require_missing_pod ?? false);
        return { data: { createUploadPodSession: { id: "session", type: "TEXT_POD" } } };
      }
      const plaintext = CryptoJS.AES.decrypt(await variables.file.text(), "test-key").toString(CryptoJS.enc.Utf8);
      assert.equal(plaintext, "saved-text");
      return { data: { uploadSessionPod: { id: "session" } } };
    });
    const sessions = await encryptAndUpload({
      encryption_keys: { note: { metamodel_ref_id: "note", key: "test-key" } },
      data_items: [{ ref_id: "note", data_model_version: "0.0.2", data: "saved-text" }],
      client: { mutate } as any,
      require_missing_pod,
    });
    assert.deepEqual(sessions, [{ ref_id: "note", session_id: "session", type: "TEXT_POD" }]);
  }
});
