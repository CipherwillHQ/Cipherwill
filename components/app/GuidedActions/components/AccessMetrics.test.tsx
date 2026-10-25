// Verifies conditional access pills and their inline permission lists.
// Owns empty-list, independent failure, name batching, and count-update cases.
// Does not open a browser or modify real access permissions.
import test, { beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import type { DocumentNode } from "graphql";
import type { AccessDetails, GetPersonByIdsVariables, OverviewExpansionProps } from "@/types/interfaces";

const access: AccessDetails = { id: "access-1", user: "person-1", beneficiary_id: "relation-1",
  created_at: "1", expire_at: String(Date.UTC(2099, 0, 1)) };
let shared: AccessDetails[] = [], granted: AccessDetails[] = [];
let sharedError: Error | undefined, grantedError: Error | undefined;
let loading = false, revokingId: string | null = null;
const refresh = mock.fn(async () => {});
const revoke = mock.fn(async () => {});
const people = mock.fn((query: DocumentNode, options: { variables: GetPersonByIdsVariables }) => ({ loading: false, data: { getPersonByIds: [
  { id: "person-1", first_name: "Asha", email: "asha@example.com" },
  { id: "person-2", first_name: "Rohan", email: "rohan@example.com" },
] } }));
mock.module("../hooks/useGuidanceAccess.ts", { defaultExport: () => ({
  shared: { data: { getAllBeneficiaryAccess: shared }, loading, error: sharedError, refetch: refresh },
  granted: { data: { getAllGrantedBeneficiaries: granted }, loading, error: grantedError, refetch: refresh },
  onRevoke: revoke, revokingId, revokeError: null,
}) });
mock.module(pathToFileURL(require.resolve("@apollo/client/react")), { namedExports: { useQuery: people } });
mock.module("./DataRecordsBreakdown.module.css", { defaultExport: { panel: "panel" } });
beforeEach(() => {
  shared = []; granted = []; sharedError = undefined; grantedError = undefined;
  loading = false; revokingId = null; people.mock.resetCalls(); refresh.mock.resetCalls(); revoke.mock.resetCalls();
});
const props: OverviewExpansionProps = { expanded: null, onExpand: () => {} };

test("empty permission lists render nothing, including during initial loading", async () => {
  const { default: Metrics } = await import("./AccessMetrics");
  for (loading of [false, true]) assert.equal(renderToStaticMarkup(<Metrics {...props} />), "");
  assert.equal(people.mock.callCount(), 0);
});
test("each direction appears only when it has permissions", async () => {
  const { default: Metrics } = await import("./AccessMetrics");
  shared = [access];
  const incoming = renderToStaticMarkup(<Metrics {...props} />);
  assert.match(incoming, /Shared wills \(1\)/); assert.doesNotMatch(incoming, /Granted access/);
  shared = []; granted = [access];
  const outgoing = renderToStaticMarkup(<Metrics {...props} />);
  assert.match(outgoing, /Granted access \(1\)/); assert.doesNotMatch(outgoing, /Shared wills/);
  shared = [access];
  assert.match(renderToStaticMarkup(<Metrics {...props} />), /Shared wills \(1\)[\s\S]*Granted access \(1\)/);
  assert.equal(people.mock.callCount(), 0);
});
test("opening shared wills batches names and links by access ID", async () => {
  const { default: Metrics } = await import("./AccessMetrics");
  shared = [access, { ...access, id: "access-2", user: "person-2" }];
  const html = renderToStaticMarkup(<Metrics {...props} expanded="shared" />);
  assert.equal(people.mock.callCount(), 1);
  assert.deepEqual(people.mock.calls[0].arguments[1].variables.list, ["person-1", "person-2"]);
  assert.match(html, /Asha[\s\S]*Rohan/);
  assert.match(html, /href="\/executor\/access-1"/);
  assert.match(html, /href="\/executor\/access-2"/);
  assert.match(html, /Access until:/);
  assert.doesNotMatch(html, /Revoke|role="dialog"/);
});
test("granted access stays visible during refresh and disappears after the last grant is removed", async () => {
  const { default: Metrics } = await import("./AccessMetrics");
  granted = [access]; loading = true; revokingId = access.id;
  const pending = renderToStaticMarkup(<Metrics {...props} expanded="granted" />);
  assert.match(pending, /Granted access \(1\)/);
  assert.match(pending, /disabled=""[\s\S]*Revoking/);
  granted = []; loading = false; revokingId = null;
  assert.equal(renderToStaticMarkup(<Metrics {...props} expanded="granted" />), "");
});
test("a failed permission query leaves the other pill available with a targeted retry", async () => {
  const { default: Metrics } = await import("./AccessMetrics");
  shared = [access]; grantedError = new Error("Unavailable");
  const tree = Metrics(props);
  const html = renderToStaticMarkup(tree);
  assert.match(html, /Shared wills \(1\)/);
  assert.match(html, /Retry loading granted access/);
  await tree.props.children[2].props.onClick();
  assert.equal(refresh.mock.callCount(), 1);
});
