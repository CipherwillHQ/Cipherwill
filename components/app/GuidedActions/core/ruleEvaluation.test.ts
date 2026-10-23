// Verifies catalog conditions, plain-text interpolation, and input constraints.
// Owns pure-rule edge cases without any engine or network dependencies.
// Does not inspect real asset details.
import test from "node:test";
import assert from "node:assert/strict";
import type { GuidanceScope } from "@/types/interfaces";
import { matchesCondition, readGuidancePath, renderGuidanceText } from "./ruleEvaluation";
import { normalizeAnswer } from "./submission";

const scope: GuidanceScope = { account: { firstName: null, lastName: null, birthDate: null, beneficiaryCount: 0 },
  answers: { invite: false }, effects: {}, context: { vault: { count: 2, tags: ["bank"], label: "<private bank>" } }, completion: null };

test("false and zero are present and compound conditions evaluate explicitly", () => {
  assert.equal(matchesCondition({ path: "answers.invite", operator: "present" }, scope), true);
  assert.equal(matchesCondition({ all: [
    { path: "account.beneficiaryCount", operator: "equals", value: 0 },
    { any: [{ path: "context.vault.tags", operator: "includes", value: "bank" }] },
    { not: { path: "answers.invite", operator: "equals", value: true } },
  ] }, scope), true);
  assert.equal(matchesCondition({ path: "context.vault.count", operator: "gte", value: 2 }, scope), true);
  assert.equal(matchesCondition({ path: "context.vault.count", operator: "lt", value: 2 }, scope), false);
  assert.equal(matchesCondition({ path: "context.vault.count", operator: "lte", value: 2 }, scope), true);
});

test("templates resolve primitives as plain text and block prototype paths", () => {
  assert.equal(renderGuidanceText("{{context.vault.label}} {{answers.invite}} {{context.vault}}", scope), "<private bank> false ");
  assert.equal(readGuidancePath(scope, "answers.constructor"), undefined);
  assert.equal(readGuidancePath(scope, "context.__proto__"), undefined);
  assert.equal(renderGuidanceText([
    { when: { path: "missing", operator: "present" }, text: "Wrong" }, { text: "Fallback" },
  ], scope), "Fallback");
});

test("generic dates allow future schedules while explicit birth-date bounds reject them", () => {
  assert.equal(normalizeAnswer({ type: "date", key: "date" }, "2099-01-01"), "2099-01-01");
  assert.throws(() => normalizeAnswer({ type: "date", key: "date", maxDate: "today" }, "2099-01-01"));
  assert.throws(() => normalizeAnswer({ type: "date", key: "date" }, "2023-02-29"));
  assert.throws(() => normalizeAnswer({ type: "single_line_text", key: "code", pattern: "^[A-Z]{3}$" }, "lower"));
  assert.throws(() => normalizeAnswer({ type: "boolean", key: "yes" }, null));
  assert.equal(normalizeAnswer({ type: "boolean", key: "yes", skippable: true }, null), null);
});
