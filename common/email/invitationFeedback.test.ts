// What it does: Tests the invitation outcome messages displayed to customers.
// What it owns: Accurate feedback for sent, failed, duplicate, and skipped invitations.
// What it does NOT do: Send invitations or render a browser UI.

import assert from "node:assert/strict";
import { test } from "node:test";
import invitationFeedback from "./invitationFeedback";

test("displays the first invitation as sent", () => {
  assert.equal(invitationFeedback({ status: "sent" }), "Invitation email sent.");
});
test("displays duplicates as already sent", () => {
  assert.match(invitationFeedback({ status: "already_sent" }), /already sent/);
});
test("displays a provider failure as retryable", () => {
  assert.match(invitationFeedback({ status: "failed" }), /failed.*retry/);
});
test("displays skipped invitations with their reason", () => {
  assert.equal(invitationFeedback({ status: "skipped", reason: "Email disabled" }), "Invitation email skipped. Email disabled");
});
