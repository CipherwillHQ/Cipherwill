// Verifies that local personalization uses only descriptive asset fields.
// Owns fixtures containing secrets that must not enter guidance responses.
// Does not perform network calls or inspect real user data.
import test from "node:test";
import assert from "node:assert/strict";
import { getGuidanceAssetLabel } from "./assetContext";

test("bank context uses the bank name and excludes its account number", () => {
  const label = getGuidanceAssetLabel(JSON.stringify({ type: "bank_account", data: {
    bank_name: "Example Bank", account_number: "123456-secret", password: "secret-password",
  } }), "BANK_ACCOUNT");
  assert.equal(label, "your Example Bank bank account");
  assert.doesNotMatch(label!, /123456|secret/);
});

test("unsupported and mismatched assets do not produce personalized labels", () => {
  assert.equal(getGuidanceAssetLabel('{"type":"password","data":{"password":"secret"}}', "PASSWORD"), null);
  assert.equal(getGuidanceAssetLabel('{"type":"password","data":{"bank_name":"secret"}}', "BANK_ACCOUNT"), null);
});
