// Verifies factor enrollment preserves source keys if synchronization fails.
// Owns migration ordering and native back-state cleanup before page reload.
// Does not encrypt real vault content or call the production API.
import assert from "node:assert/strict";
import { after, before, beforeEach, mock, test } from "node:test";
import { pathToFileURL } from "node:url";
const events: string[] = [];
const migrate = mock.fn(async () => { events.push("migrate"); });
const mutate = mock.fn(async (_request: unknown) => { events.push("delete-source"); });
const client = {
  query: async () => ({ data: { getAllKeyCount: [{ publicKey: "null", count: 1 }] } }),
  mutate,
};
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
Object.defineProperty(globalThis, "window", { configurable: true, value: { location: { reload: () => events.push("reload") } } });
after(() => {
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
});
mock.module("../../../../common/auth/mobileAuthBridge.ts", { namedExports: { getMobileAuthBridge: () => ({}) } });
mock.module("../../../../common/mobile/deviceBridge.ts", { namedExports: {
  requestDevice: async (_type: string, payload: { dirty: boolean }) => { events.push(`dirty:${payload.dirty}`); },
} });
mock.module("../../../../common/factor/perform_migrate_in.ts", { defaultExport: migrate });
mock.module("../../../../common/time/sleep.ts", { namedExports: { sleep: async () => {} } });
mock.module(pathToFileURL(require.resolve("react-hot-toast")), { defaultExport: { success: mock.fn(), error: mock.fn() } });
let sync: typeof import("./continuousFactorIn").default;
before(async () => { sync = (await import("./continuousFactorIn")).default; });
beforeEach(() => {
  events.length = 0; mutate.mock.resetCalls();
  migrate.mock.mockImplementation(async () => { events.push("migrate"); });
});
test("interrupted synchronization cannot delete the source keys or reload", async () => {
  migrate.mock.mockImplementationOnce(async () => { events.push("migrate"); throw new Error("Offline"); });
  await assert.rejects(sync({ createFactor: { publicKey: "new-factor" } }, client, {}), /Offline/);
  assert.equal(mutate.mock.callCount(), 0);
  assert.deepEqual(events, ["dirty:true", "migrate", "dirty:false"]);
});
test("source cleanup follows successful synchronization and back protection clears before reload", async () => {
  await sync({ createFactor: { publicKey: "new-factor" } }, client, {});
  assert.deepEqual(events, ["dirty:true", "migrate", "delete-source", "dirty:false", "reload"]);
});
