// Verifies only displayed account metrics are calculated for the overview.
// Owns empty-account counts, factor sync status, and malformed-score cases.
// Does not load storage, profile milestones, or browser context.
import test from "node:test";
import assert from "node:assert/strict";
import type { GuidanceOverviewData } from "@/types/interfaces";
import { buildGuidanceOverview } from "./accountOverview";
export const overviewData: GuidanceOverviewData = {
  getUserScore: '{"base":300,"firstName":100,"lastName":100,"metamodel":100}',
  me: { first_name: " Asha ", email_verified: true }, getMetamodelTypeCounts: [{ type: "NOTE", count: 2 }, { type: "PASSWORD", count: 3 }],
  getSmartWillBeneficiaries: [{ id: "person-1" }], getFactors: [{ id: "factor-1" }, { id: "factor-2" }],
  getAllKeyCount: [{ publicKey: "null", count: 0 }, { publicKey: "factor-1", count: 5 }, { publicKey: "factor-2", count: 5 }],
};
test("overview totals score and displays record, beneficiary, and factor counts", () => {
  assert.deepEqual(buildGuidanceOverview(overviewData), { firstName: "Asha", emailVerified: true, score: 600, itemCount: 5,
    typeCounts: overviewData.getMetamodelTypeCounts, beneficiaryCount: 1, factorCount: 2, factorsInSync: true });
});
test("empty accounts display zero counts without inventing score points", () => {
  assert.deepEqual(buildGuidanceOverview({ ...overviewData, getUserScore: '{"base":300}', me: { first_name: " ", email_verified: false },
    getMetamodelTypeCounts: [], getSmartWillBeneficiaries: [], getFactors: [], getAllKeyCount: [{ publicKey: "null", count: 0 }] }),
    { firstName: null, emailVerified: false, score: 300, itemCount: 0, typeCounts: [], beneficiaryCount: 0, factorCount: 0, factorsInSync: false });
});
test("factors need sync when another factor or the unencrypted vault has more keys", () => {
  for (const getAllKeyCount of [
    [{ publicKey: "null", count: 0 }, { publicKey: "factor-1", count: 5 }, { publicKey: "factor-2", count: 3 }],
    [{ publicKey: "null", count: 6 }, { publicKey: "factor-1", count: 5 }, { publicKey: "factor-2", count: 5 }],
  ]) assert.equal(buildGuidanceOverview({ ...overviewData, getAllKeyCount }).factorsInSync, false);
});
test("matching factors stay in sync with fewer unencrypted keys or an empty vault", () => {
  for (const getAllKeyCount of [
    [{ publicKey: "null", count: 2 }, { publicKey: "factor-1", count: 5 }, { publicKey: "factor-2", count: 5 }],
    [{ publicKey: "null", count: 0 }, { publicKey: "factor-1", count: 0 }, { publicKey: "factor-2", count: 0 }],
  ]) assert.equal(buildGuidanceOverview({ ...overviewData, getAllKeyCount }).factorsInSync, true);
});
test("malformed score responses are not presented as real scores", () => {
  for (const getUserScore of ["invalid", "null", "[]", '{"base":"300"}']) {
    assert.throws(() => buildGuidanceOverview({ ...overviewData, getUserScore }));
  }
});
