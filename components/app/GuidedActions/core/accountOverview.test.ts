// Verifies only displayed account metrics are calculated for the overview.
// Owns empty-account counts and malformed-score regression cases.
// Does not load storage, profile milestones, or browser context.
import test from "node:test";
import assert from "node:assert/strict";
import type { GuidanceOverviewData } from "@/types/interfaces";
import { buildGuidanceOverview } from "./accountOverview";
export const overviewData: GuidanceOverviewData = {
  getUserScore: '{"base":300,"firstName":100,"lastName":100,"metamodel":100}',
  me: { first_name: " Asha ", email_verified: true }, getMetamodelTypeCounts: [{ type: "NOTE", count: 2 }, { type: "PASSWORD", count: 3 }],
  getSmartWillBeneficiaries: [{ id: "person-1" }], getFactors: [{ id: "factor-1" }, { id: "factor-2" }],
};
test("overview totals score and displays record, beneficiary, and factor counts", () => {
  assert.deepEqual(buildGuidanceOverview(overviewData), { firstName: "Asha", emailVerified: true, score: 600, itemCount: 5,
    typeCounts: overviewData.getMetamodelTypeCounts, beneficiaryCount: 1, factorCount: 2 });
});
test("empty accounts display zero counts without inventing score points", () => {
  assert.deepEqual(buildGuidanceOverview({ ...overviewData, getUserScore: '{"base":300}', me: { first_name: " ", email_verified: false },
    getMetamodelTypeCounts: [], getSmartWillBeneficiaries: [], getFactors: [] }),
    { firstName: null, emailVerified: false, score: 300, itemCount: 0, typeCounts: [], beneficiaryCount: 0, factorCount: 0 });
});
test("malformed score responses are not presented as real scores", () => {
  for (const getUserScore of ["invalid", "null", "[]", '{"base":"300"}']) {
    assert.throws(() => buildGuidanceOverview({ ...overviewData, getUserScore }));
  }
});
