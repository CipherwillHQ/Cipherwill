// Verifies expiry and recovery without treating deferrals as completion.
// Owns time boundaries, dismissed choices, and unavailable-objective filtering.
// Does not call APIs or access decrypted asset contents.
import test from "node:test";
import assert from "node:assert/strict";
import type { GuidanceDefinition, GuidanceScope } from "@/types/interfaces";
import { chooseObjective } from "./flowRules";
import { deferredGuidanceItems, restoreEnabledSegmentGuidance } from "./objectiveChoices";
import { firstAssetFixture } from "./fixtures/firstAsset";

const flow = firstAssetFixture(0);
const scope: GuidanceScope = { account: { firstName: null, lastName: null, birthDate: null, beneficiaryCount: 0,
  plan: "free", deferrals: [{ objectiveId: flow.id, resumeAfter: "1000", dismissed: false }] },
  answers: {}, effects: {}, context: { savedAssets: { NOTE: 0 } }, completion: null };

test("temporary deferrals expire exactly at their return timestamp; dismissals never expire", () => {
  assert.equal(chooseObjective([flow], scope, new Set(), 999), null);
  assert.equal(chooseObjective([flow], scope, new Set(), 1000)?.id, flow.id);
  const dismissed = { ...scope, account: { ...scope.account,
    deferrals: [{ objectiveId: flow.id, resumeAfter: null, dismissed: true }] } };
  assert.equal(chooseObjective([flow], dismissed, new Set(), Number.MAX_SAFE_INTEGER), null);
  assert.deepEqual(deferredGuidanceItems([flow], dismissed, new Set()), []);
});

test("Do later excludes removed, complete, premium, and disabled data objectives", () => {
  const catalog: GuidanceDefinition[] = [flow,
    { ...flow, id: "complete", completedWhen: undefined },
    { ...flow, id: "premium", segment: { key: "seed", planRequired: "premium", requireEnabled: false } },
    { ...flow, id: "disabled", segment: { key: "bank", planRequired: "free", requireEnabled: true } }];
  const choices = [flow.id, "complete", "premium", "disabled", "removed"].map(objectiveId => ({
    objectiveId, resumeAfter: "1000", dismissed: false }));
  const account = { ...scope.account, deferrals: choices, completedObjectiveIds: ["complete"] };
  assert.deepEqual(deferredGuidanceItems(catalog, { ...scope, account }, new Set()), [
    { objectiveId: flow.id, title: flow.title, resumeAfter: "1000" }]);
});

test("enabling a segment clears its temporary choices while respecting explicit dismissals", () => {
  const catalog = ["enable_bank", "add_bank", "dismissed_bank"].map(id => ({ ...flow, id,
    segment: { key: "bank", planRequired: "free" as const, requireEnabled: false } }));
  const previous = { ...scope.account, preferences: { bank: false }, deferrals: [
    { objectiveId: "enable_bank", resumeAfter: "1000", dismissed: false },
    { objectiveId: "add_bank", resumeAfter: "1000", dismissed: false },
    { objectiveId: "dismissed_bank", resumeAfter: null, dismissed: true },
    { objectiveId: "other", resumeAfter: "1000", dismissed: false },
  ] };
  const next = restoreEnabledSegmentGuidance(previous, { ...previous, preferences: { bank: true } }, catalog);
  assert.deepEqual(next.deferrals.map(choice => choice.objectiveId), ["dismissed_bank", "other"]);
  assert.equal(previous.deferrals.length, 4);
});
