// Verifies guided asset mapping and credential-safe input normalization.
// Owns schema compatibility, note escaping, and exact password preservation.
// Does not run uploads or read account data.
import test from "node:test";
import assert from "node:assert/strict";
import { buildGuidedAssetInput } from "./assetInputSchema";
import { testAssetSchemas } from "./fixtures/assetSchemas";
import { normalizeAnswer, coerceValueForInput } from "./submission";

test("password values preserve whitespace throughout submission and asset preparation", () => {
  const input = { key: "password", type: "single_line_text", sensitive: true, minLength: 1 } as const;
  const value = "  secret\t ";
  assert.equal(normalizeAnswer(input, coerceValueForInput(input, value)), value);
  const asset = buildGuidedAssetInput({ itemId: "guided_password", service: "Email", username: "Me", password: value }, testAssetSchemas.PASSWORD);
  assert.equal(asset.pod.data.password, value);
  assert.deepEqual(asset.metadata, { name: "Email" });
});

test("asset fields are allowlisted and plain-text notes become escaped rich-text content", () => {
  const asset = buildGuidedAssetInput({ type: "NOTE", itemId: "guided_note", title: " Family ",
    content: '<img src=x>\n"Message" & family', unexpected: "secret" }, testAssetSchemas.NOTE);
  assert.equal(asset.pod.data.content, '<p>&lt;img src=x&gt;<br>&quot;Message&quot; &amp; family</p>');
  assert.equal(asset.pod.version, "0.0.2");
  assert.doesNotMatch(JSON.stringify(asset), /unexpected|secret/);
  assert.throws(() => buildGuidedAssetInput({ itemId: "guided_password", service: "Email", username: "Me" }, testAssetSchemas.PASSWORD));
});

test("a new category uses its catalog schema without a browser dispatcher change", () => {
  const asset = buildGuidedAssetInput({ itemId: "guided_card", issuer: "Example", number: "001234", ignored: "private" }, {
    type: "PAYMENT_CARD", podType: "payment_card", version: "0.0.1", metadata: { name: "issuer" },
    inputs: [{ key: "issuer", type: "single_line_text" }, { key: "number", type: "single_line_text", sensitive: true }],
    fields: { issuer: { answer: "issuer" }, card_number: { answer: "number" } },
  });
  assert.equal(asset.type, "PAYMENT_CARD");
  assert.deepEqual(asset.pod.data, { issuer: "Example", card_number: "001234" });
  assert.doesNotMatch(JSON.stringify(asset), /ignored|private/);
});
