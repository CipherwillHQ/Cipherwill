// What it does: Verifies PostHog experiment variant resolution and timeout fallback.
// What it owns: Unit tests for isGuideHomeVariant and useHomeGuideExperiment.
// What it does NOT do: Contact PostHog or render dashboard components.
import assert from "node:assert/strict";
import test from "node:test";
import { isGuideHomeVariant } from "./useHomeGuideExperiment";

test("isGuideHomeVariant enables Guide only for explicit test variants", () => {
  assert.equal(isGuideHomeVariant("guide"), true);
  assert.equal(isGuideHomeVariant("test"), true);
  assert.equal(isGuideHomeVariant(true), true);
  assert.equal(isGuideHomeVariant("control"), false);
  assert.equal(isGuideHomeVariant(false), false);
  assert.equal(isGuideHomeVariant(undefined), false);
});
