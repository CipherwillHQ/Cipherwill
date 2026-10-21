// Verifies empty executor items and the existing saved-content decryption flow.
// Owns pod/key query states with mocked access keys and local encrypted fixtures.
// Does not open a browser or contact the backend.

import assert from "node:assert/strict";
import { beforeEach, mock, test } from "node:test";
import { setImmediate } from "node:timers/promises";
import { pathToFileURL } from "node:url";
import CryptoJS from "crypto-js";
import { CombinedGraphQLErrors } from "@apollo/client/errors";

const effects: Array<() => void> = [];
const setData = mock.fn();
const setKeyMetadata = mock.fn();
const decryptKey = mock.fn<(options: {
  encrypted_key: string; time_capsule_private_key: string; current_session_private_key: string | null;
}) => Promise<string>>(async () => "pod-key");
const savedKey = { id: "key", ref_id: "item", key: "encrypted-key", created_at: "1700000000000", updated_at: "1700000000000" };
const savedPod = { getPod: {
  id: "pod", ref_id: "item", mime_type: "text/plain", encoding: "utf-8", size: "100",
  created_at: "1700000000000", updated_at: "1700000000000",
  content: CryptoJS.AES.encrypt(JSON.stringify({ type: "DEVICE_LOCK", data: { pin: "1234" } }), "pod-key").toString(),
} };
let podData: typeof savedPod | undefined;
let podError: Error | undefined;
let podLoading = false;
let key: typeof savedKey | null = null;
let keySkipped: boolean | undefined;
let keyError: Error | undefined;
const query = mock.fn(async (options: { query: string; variables?: unknown }) => ({
  data: options.query === "GET_POD" ? savedPod : { getBeneficiaryEncryptionKey: "access-key" },
}));

mock.module("react", { namedExports: { useEffect: (effect: () => void) => effects.push(effect) } });
mock.module("@apollo/client/react", { namedExports: {
  useApolloClient: () => ({ query }),
  useQuery: (document: string, options: { skip?: boolean }) => {
    if (document === "GET_POD") return { data: podData, error: podError, loading: podLoading };
    keySkipped = options.skip;
    return options.skip ? { loading: false } : { data: { getKeyByRefId: key }, error: keyError, loading: false };
  },
} });
mock.module("../../../contexts/SessionContext/index.tsx", { namedExports: {
  useSession: () => ({ session: { publicKey: "factor-public-key", privateKey: "factor-private-key" } }),
} });
mock.module("../../../graphql/ops/app/pod/queries/GET_POD.ts", { defaultExport: "GET_POD" });
mock.module("../../../graphql/ops/app/key/Queries/GET_KEY_BY_REF_ID.ts", { defaultExport: "GET_KEY_BY_REF_ID" });
mock.module("../../../graphql/ops/app/executor/access/queries/GET_BENEFICIARY_ENCRYPTION_KEY.ts", { defaultExport: "GET_BENEFICIARY_ENCRYPTION_KEY" });
mock.module("../data/get_pod_decryption_key.ts", { defaultExport: decryptKey });
mock.module("../../debug/logger.ts", { defaultExport: { error: mock.fn() } });
mock.module(pathToFileURL(require.resolve("react-hot-toast")), { defaultExport: { error: mock.fn() } });

beforeEach(() => {
  effects.length = 0;
  podData = undefined;
  podError = undefined;
  podLoading = false;
  key = null;
  keySkipped = undefined;
  keyError = undefined;
  query.mock.resetCalls();
  decryptKey.mock.resetCalls();
  setData.mock.resetCalls();
  setKeyMetadata.mock.resetCalls();
});

test("a missing pod is empty and does not need an encryption key", async () => {
  const { default: useDecryptedPod } = await import("./useDecryptedPod");
  podError = new CombinedGraphQLErrors({ errors: [{ message: "No pod found", extensions: { code: "POD_NOT_FOUND" } }] });
  const result = useDecryptedPod({ access_id: "will", metamodel_id: "item", setData, setKeyMetadata });
  assert.equal(result.isEmpty, true);
  assert.equal(result.error, undefined);
  assert.equal(result.loading, false);
  assert.equal(keySkipped, true);
  for (const effect of effects) effect();
  await setImmediate();
  assert.equal(query.mock.callCount(), 0);
  assert.equal(decryptKey.mock.callCount(), 0);
  assert.equal(setData.mock.callCount(), 0);
});

test("saved content with a missing key remains distinguishable from an empty item", async () => {
  const { default: useDecryptedPod } = await import("./useDecryptedPod");
  podData = savedPod;
  const result = useDecryptedPod({ access_id: "will", metamodel_id: "item", setData, setKeyMetadata });
  assert.equal(result.isEmpty, false);
  assert.equal(result.data?.getKeyByRefId, null);
  assert.equal(keySkipped, false);
});

test("a pod network failure is unavailable rather than empty", async () => {
  const { default: useDecryptedPod } = await import("./useDecryptedPod");
  podError = new Error("Network failure");
  const result = useDecryptedPod({ access_id: "will", metamodel_id: "item", setData, setKeyMetadata });
  assert.equal(result.isEmpty, false);
  assert.equal(result.error, podError);
  assert.equal(keySkipped, true);
});

test("a pod access failure is unavailable rather than empty", async () => {
  const { default: useDecryptedPod } = await import("./useDecryptedPod");
  podError = new CombinedGraphQLErrors({ errors: [{ message: "Access denied", extensions: { code: "FORBIDDEN" } }] });
  const result = useDecryptedPod({ access_id: "will", metamodel_id: "item", setData, setKeyMetadata });
  assert.equal(result.isEmpty, false);
  assert.equal(result.error, podError);
  assert.equal(keySkipped, true);
});

test("pod loading defers key lookup and does not claim the item is empty", async () => {
  const { default: useDecryptedPod } = await import("./useDecryptedPod");
  podLoading = true;
  const result = useDecryptedPod({ access_id: "will", metamodel_id: "item", setData, setKeyMetadata });
  assert.equal(result.loading, true);
  assert.equal(result.isEmpty, false);
  assert.equal(keySkipped, true);
});

test("saved details still use beneficiary and session keys to decrypt the pod", async () => {
  const { default: useDecryptedPod } = await import("./useDecryptedPod");
  podData = savedPod;
  key = savedKey;
  useDecryptedPod({ access_id: "will", metamodel_id: "item", setData, setKeyMetadata });
  for (const effect of effects) effect();
  await setImmediate();
  assert.deepEqual(setKeyMetadata.mock.calls[0].arguments, [savedKey]);
  assert.equal(query.mock.calls[0].arguments[0].query, "GET_BENEFICIARY_ENCRYPTION_KEY");
  assert.deepEqual(query.mock.calls[0].arguments[0].variables, { access_id: "will" });
  assert.deepEqual(decryptKey.mock.calls[0].arguments[0], {
    encrypted_key: "encrypted-key", time_capsule_private_key: "access-key", current_session_private_key: "factor-private-key",
  });
  assert.deepEqual(setData.mock.calls[0].arguments, [{ pin: "1234" }]);
});
