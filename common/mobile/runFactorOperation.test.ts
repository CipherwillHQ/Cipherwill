// Verifies mobile factor work keeps native back protection until it settles.
// Owns nested operations, exception cleanup and browser compatibility checks.
// Does not run real migrations or alter vault data.
import assert from "node:assert/strict";
import { before, beforeEach, mock, test } from "node:test";
let mobile = true;
const messages: { dirty: boolean }[] = [];
mock.module("../auth/mobileAuthBridge.ts", { namedExports: { getMobileAuthBridge: () => mobile ? {} : undefined } });
mock.module("./deviceBridge.ts", { namedExports: { requestDevice: async (_type: string, payload: { dirty: boolean }) => { messages.push(payload); } } });
let run: typeof import("./runFactorOperation").runFactorOperation;
before(async () => { run = (await import("./runFactorOperation")).runFactorOperation; });
beforeEach(() => { mobile = true; messages.length = 0; });
test("nested migrations keep navigation guarded until the outer removal completes", async () => {
  await run(async () => {
    assert.deepEqual(messages.at(-1), { dirty: true });
    await run(async () => "inner");
    assert.deepEqual(messages.at(-1), { dirty: true });
  });
  assert.deepEqual(messages.at(-1), { dirty: false });
});
test("a failed migration releases the navigation guard and preserves its error", async () => {
  await assert.rejects(run(async () => { throw new Error("Upload interrupted"); }), /Upload interrupted/);
  assert.deepEqual(messages, [{ dirty: true }, { dirty: false }]);
  assert.equal(await run(async () => "retry"), "retry");
});
test("browser operations keep their result without invoking native features", async () => {
  mobile = false;
  assert.equal(await run(async () => "browser-result"), "browser-result");
  assert.deepEqual(messages, []);
});
