// Verifies will links, deadline states, and confirmation before revocation.
// Owns permission-ID routing, cancellation, and pending-action regression cases.
// Does not open a browser, revoke real access, or infer missing identities.
import test, { beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import type { GuidanceAccessRowProps } from "@/types/interfaces";
import AccessRow from "./AccessRow";

const confirm = mock.fn((message: string) => false);
const revoke = mock.fn(async () => {});
const close = mock.fn();
const props: GuidanceAccessRowProps = {
  kind: "granted", access: { id: "permission-1", user: "person-1", beneficiary_id: "different-relation-id",
    created_at: "1", expire_at: String(Date.UTC(2099, 0, 1)) },
  person: { id: "person-1", first_name: "Asha", email: "asha@example.com" },
  onClose: close, onRevoke: revoke, revokingId: null,
};
beforeEach(() => {
  confirm.mock.resetCalls(); confirm.mock.mockImplementation(() => false); revoke.mock.resetCalls(); close.mock.resetCalls();
  Object.defineProperty(globalThis, "window", { configurable: true, value: { confirm } });
});
afterEach(() => { Reflect.deleteProperty(globalThis, "window"); });

test("View will uses the permission ID and closes the expanded pill", () => {
  const row = AccessRow({ ...props, kind: "shared" });
  assert.match(renderToStaticMarkup(row), /href="\/executor\/permission-1"/);
  assert.doesNotMatch(renderToStaticMarkup(row), /different-relation-id/);
  row.props.children[1].props.onClick();
  assert.equal(close.mock.callCount(), 1);
});
test("cancelling revocation does nothing; confirmation submits the access ID", () => {
  const row = AccessRow(props);
  row.props.children[1].props.onClick();
  assert.equal(revoke.mock.callCount(), 0);
  confirm.mock.mockImplementation(() => true);
  row.props.children[1].props.onClick();
  assert.match(confirm.mock.calls[1].arguments[0], /Asha/);
  assert.deepEqual(revoke.mock.calls[0].arguments, ["permission-1"]);
});
test("pending revocation and unavailable names disable destructive actions", () => {
  assert.match(renderToStaticMarkup(AccessRow({ ...props, revokingId: props.access.id })), /disabled=""[\s\S]*Revoking/);
  assert.match(renderToStaticMarkup(AccessRow({ ...props, person: undefined })), /Name unavailable[\s\S]*disabled=""/);
});
test("passed deadlines remain visible; outgoing permissions can still be revoked", () => {
  const expired = { ...props, access: { ...props.access, expire_at: "1" } };
  const incoming = renderToStaticMarkup(AccessRow({ ...expired, kind: "shared" }));
  assert.match(incoming, /Scheduled end:|Access ended/); assert.doesNotMatch(incoming, /href="\/executor/);
  const outgoing = renderToStaticMarkup(AccessRow(expired));
  assert.match(outgoing, /Scheduled end:[\s\S]*Revoke/); assert.doesNotMatch(outgoing, /disabled=""/);
});
