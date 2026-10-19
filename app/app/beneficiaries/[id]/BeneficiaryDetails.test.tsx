// Tests beneficiary details, navigation, and visible account and message states.
// Owns page rendering checks with isolated GraphQL responses.
// Does not open a browser, connect to the API, or mutate real beneficiaries.

import assert from "node:assert/strict";
import { beforeEach, mock, test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { SmartWillBeneficiary, Person } from "@/types/interfaces";
import GET_SMARTWILL_BENEFICIARY from "@/graphql/ops/app/smartwill/queries/GET_SMARTWILL_BENEFICIARY";
import GET_PERSON_BY_IDS from "@/graphql/ops/app/people/queries/GET_PERSON_BY_IDS";
import GET_BENEFICIARY_SEGMENT_COUNTS from "@/graphql/ops/app/smartwill/queries/GET_BENEFICIARY_SEGMENT_COUNTS";

const beneficiary: SmartWillBeneficiary = {
  id: "beneficiary-1", person_id: "person-1", user_id: "owner-1",
  publicKey: "test-key", created_at: "1792348200000", custom_message: "Take care.\nLove always.",
};
const person: Person = {
  id: "person-1", first_name: "Asha", last_name: "Shah", email: "asha@example.com", __typename: "User",
};
let beneficiaries = { data: { getSmartWillBeneficiaries: [beneficiary] }, loading: false, error: undefined as Error | undefined };
let people = { data: { getPersonByIds: [person] }, loading: false, error: undefined as Error | undefined };
let segments = {
  data: { getMetamodelTypeCounts: [{ type: "NOTE", count: 2 }, { type: "PASSWORD", count: 1 }] },
  loading: false, error: undefined as Error | undefined,
};
const query = mock.fn((document: unknown, options: { skip?: boolean }) => {
  if (document === GET_SMARTWILL_BENEFICIARY) return beneficiaries;
  if (document === GET_PERSON_BY_IDS) return options.skip ? { loading: false } : people;
  if (document === GET_BENEFICIARY_SEGMENT_COUNTS) return segments;
  throw new Error("Unexpected query");
});
let messageProps: { beneficiary_id: string; custom_message: string | null } | undefined;

mock.module("@apollo/client/react", { namedExports: { useQuery: query } });
mock.module("../../../../components/app/smartwill/CustomMessage.tsx", {
  defaultExport: (props: typeof messageProps) => { messageProps = props; return null; },
});

beforeEach(() => {
  beneficiaries = { data: { getSmartWillBeneficiaries: [{ ...beneficiary }] }, loading: false, error: undefined };
  people = { data: { getPersonByIds: [{ ...person }] }, loading: false, error: undefined };
  segments = { data: { getMetamodelTypeCounts: [{ type: "NOTE", count: 2 }, { type: "PASSWORD", count: 1 }] }, loading: false, error: undefined };
  messageProps = undefined;
  query.mock.resetCalls();
});

test("direct detail visits show identity, added date, account status, segment counts, and saved message", async () => {
  const { default: Details } = await import("./BeneficiaryDetails");
  const html = renderToStaticMarkup(<Details beneficiaryId="beneficiary-1" />);

  assert.match(html, /href="\/app\/beneficiaries"/);
  assert.match(html, /Asha Shah/);
  assert.match(html, /asha@example.com/);
  assert.match(html, /dateTime="2026-10-18T18:30:00\.000Z"/);
  assert.match(html, />On Cipherwill<\/span>/);
  assert.match(html, /beneficiary-data-total"><span[^>]*>3<\/span> items across 2 segments/);
  assert.match(html, /beneficiary-count-notes">2 items/);
  assert.match(html, /beneficiary-count-passwords">1 item/);
  assert.match(html, /beneficiary-count-storage">0 items/);
  assert.match(html, /Take care\.\nLove always\./);
  assert.deepEqual(messageProps, { beneficiary_id: "beneficiary-1", custom_message: beneficiary.custom_message });
  assert.deepEqual(query.mock.calls.find((call) => call.arguments[0] === GET_PERSON_BY_IDS)?.arguments[1], {
    variables: { list: ["person-1"] }, skip: false, fetchPolicy: "cache-and-network",
  });
  assert.deepEqual(query.mock.calls.find((call) => call.arguments[0] === GET_BENEFICIARY_SEGMENT_COUNTS)?.arguments[1], {
    variables: { beneficiary_id: "beneficiary-1" }, fetchPolicy: "network-only",
  });
});

test("guests show pending membership and missing legacy dates are not shown as 1970", async () => {
  const { default: Details } = await import("./BeneficiaryDetails");
  people.data.getPersonByIds[0] = { id: "person-1", email: person.email, first_name: "Asha", __typename: "Guest" };
  beneficiaries.data.getSmartWillBeneficiaries[0].created_at = "0";
  const html = renderToStaticMarkup(<Details beneficiaryId="beneficiary-1" />);

  assert.match(html, /Not on Cipherwill yet/);
  assert.match(html, /Not recorded/);
  assert.doesNotMatch(html, /1970|dateTime=/);
  people.data.getPersonByIds[0] = person;
  assert.match(renderToStaticMarkup(<Details beneficiaryId="beneficiary-1" />), />On Cipherwill<\/span>/);
});

test("missing account type remains unavailable instead of declaring that the person is a guest", async () => {
  const { default: Details } = await import("./BeneficiaryDetails");
  people.data.getPersonByIds[0].__typename = undefined;
  const html = renderToStaticMarkup(<Details beneficiaryId="beneficiary-1" />);

  assert.match(html, /Account status unavailable/);
  assert.doesNotMatch(html, /Not on Cipherwill yet/);
});

test("missing beneficiaries retain back navigation and do not load person or access data", async () => {
  const { default: Details } = await import("./BeneficiaryDetails");
  const html = renderToStaticMarkup(<Details beneficiaryId="another-beneficiary" />);

  assert.match(html, /Beneficiary not found/);
  assert.match(html, /href="\/app\/beneficiaries"/);
  assert.equal(query.mock.calls.find((call) => call.arguments[0] === GET_PERSON_BY_IDS)?.arguments[1]?.skip, true);
  assert.equal(query.mock.calls.some((call) => call.arguments[0] === GET_BENEFICIARY_SEGMENT_COUNTS), false);
  assert.doesNotMatch(html, /asha@example.com|Take care/);
});

test("page loading and API errors do not expose incomplete details", async () => {
  const { default: Details } = await import("./BeneficiaryDetails");
  beneficiaries.loading = true;
  assert.match(renderToStaticMarkup(<Details beneficiaryId="beneficiary-1" />), /role="status">Loading beneficiary details/);
  beneficiaries.loading = false;
  people.error = new Error("API unavailable");
  const html = renderToStaticMarkup(<Details beneficiaryId="beneficiary-1" />);

  assert.match(html, /role="alert"/);
  assert.doesNotMatch(html, /Data they will receive|Take care/);
});

test("empty segment access and empty messages are clear, while count errors do not claim zero items", async () => {
  const { default: Details } = await import("./BeneficiaryDetails");
  segments.data.getMetamodelTypeCounts = [];
  beneficiaries.data.getSmartWillBeneficiaries[0].custom_message = null;
  let html = renderToStaticMarkup(<Details beneficiaryId="beneficiary-1" />);
  assert.match(html, /No data is currently assigned/);
  assert.match(html, /No custom message has been created/);

  segments.error = new Error("Counts unavailable");
  html = renderToStaticMarkup(<Details beneficiaryId="beneficiary-1" />);
  assert.match(html, /role="alert"/);
  assert.doesNotMatch(html, /beneficiary-data-total|No data is currently assigned/);
});

test("custom message preview escapes HTML and preserves line breaks", async () => {
  const { default: Details } = await import("./BeneficiaryDetails");
  beneficiaries.data.getSmartWillBeneficiaries[0].custom_message = "<script>alert('hi')</script>\nFor you.";
  const html = renderToStaticMarkup(<Details beneficiaryId="beneficiary-1" />);

  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /\nFor you\./);
  assert.doesNotMatch(html, /<script>/);
});

test("the route passes the beneficiary record ID to its detail view", async () => {
  const { default: Page } = await import("./page");
  const view = await Page({ params: Promise.resolve({ id: "beneficiary-1" }) });
  assert.equal(view.props.beneficiaryId, "beneficiary-1");
});
