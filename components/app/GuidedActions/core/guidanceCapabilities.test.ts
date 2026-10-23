// Verifies capability compatibility independently of objective definition revisions.
// Owns unsupported input, provider, operation, and protocol filtering tests.
// Does not execute objectives or request private context.
import test from "node:test";
import assert from "node:assert/strict";
import { supportsGuidanceDefinition } from "./guidanceCapabilities";
import { runtimeFlow } from "./fixtures/runtime";
test("large revision IDs stay supported while newer protocols and capabilities are filtered", () => {
  assert.equal(supportsGuidanceDefinition(runtimeFlow("flow", { version: 2000000000, protocolVersion: 2 }), [], []), true);
  assert.equal(supportsGuidanceDefinition(runtimeFlow("flow", { protocolVersion: 4 }), [], []), false);
  assert.equal(supportsGuidanceDefinition(runtimeFlow("flow", { contexts: ["unknown"] }), [], []), false);
  const flow = runtimeFlow("flow");
  flow.completion.actions = [{ id: "new", type: "unknown" }];
  assert.equal(supportsGuidanceDefinition(flow, [], []), false);
});
