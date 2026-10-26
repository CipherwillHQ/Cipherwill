// Tests beneficiary security status against current factor responses.
// Owns coverage of membership, loading, missing data, and lookup errors.
// Does not open a browser or read real accounts or security factors.

import assert from "node:assert/strict";
import { beforeEach, mock, test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { GetBeneficiaryFactorsQuery } from "@/types/interfaces";
import GET_BENEFICIARY_FACTORS from "@/graphql/ops/auth/queries/GET_BENEFICIARY_FACTORS";

const factor = { id: "factor-1", name: "Private factor name", type: "passkey", publicKey: "private-factor-key" };
let response: { data?: GetBeneficiaryFactorsQuery; loading: boolean; error?: Error };
const query = mock.fn((_document: unknown, _options: unknown) => response);
mock.module("@apollo/client/react", { namedExports: { useQuery: query } });

beforeEach(() => {
  response = { data: { getBeneficiaryFactors: [
    { beneficiary_id: "beneficiary-1", publicKey: "time-capsule-key", factors: [factor] },
  ] }, loading: false };
  query.mock.resetCalls();
});

test("a member with a factor shows an encrypted badge without revealing factor details", async () => {
  const { default: Status } = await import("./BeneficiarySecurityStatus");
  const html = renderToStaticMarkup(<Status beneficiaryId="beneficiary-1" accountType="User" />);

  assert.match(html, /End-to-end encrypted/);
  assert.match(html, /has added a security factor/);
  assert.doesNotMatch(html, /Private factor name|private-factor-key|time-capsule-key|passkey/);
  assert.equal(query.mock.calls[0].arguments[0], GET_BENEFICIARY_FACTORS);
  assert.deepEqual(query.mock.calls[0].arguments[1], { skip: false, fetchPolicy: "network-only" });
});

test("factor status matches the beneficiary record even when another beneficiary has factors", async () => {
  const { default: Status } = await import("./BeneficiarySecurityStatus");
  response.data!.getBeneficiaryFactors.unshift({
    beneficiary_id: "another-beneficiary", publicKey: "another-key", factors: [],
  });
  assert.match(renderToStaticMarkup(<Status beneficiaryId="beneficiary-1" accountType="User" />), /End-to-end encrypted/);

  const html = renderToStaticMarkup(<Status beneficiaryId="another-beneficiary" accountType="User" />);
  assert.match(html, /No security factors added/);
  assert.doesNotMatch(html, /End-to-end encrypted/);
});

test("the badge disappears when the beneficiary no longer has security factors", async () => {
  const { default: Status } = await import("./BeneficiarySecurityStatus");
  response.data!.getBeneficiaryFactors[0].factors = [];
  const html = renderToStaticMarkup(<Status beneficiaryId="beneficiary-1" accountType="User" />);

  assert.match(html, /No security factors added/);
  assert.match(html, /hasn&#x27;t added a security factor/);
  assert.doesNotMatch(html, /End-to-end encrypted/);
});

test("guests and unknown membership skip the factor query and never show a cached encrypted badge", async () => {
  const { default: Status } = await import("./BeneficiarySecurityStatus");
  const guest = renderToStaticMarkup(<Status beneficiaryId="beneficiary-1" accountType="Guest" />);
  assert.match(guest, /No security factors added/);
  assert.match(guest, /create a Cipherwill account/);
  assert.doesNotMatch(guest, /End-to-end encrypted/);
  assert.deepEqual(query.mock.calls[0].arguments[1], { skip: true, fetchPolicy: "network-only" });

  const unknown = renderToStaticMarkup(<Status beneficiaryId="beneficiary-1" accountType={undefined} />);
  assert.match(unknown, /Security status unavailable/);
  assert.doesNotMatch(unknown, /End-to-end encrypted|No security factors added/);
  assert.deepEqual(query.mock.calls[1].arguments[1], { skip: true, fetchPolicy: "network-only" });
});

test("loading or failed lookups never show an encrypted badge from stale data", async () => {
  const { default: Status } = await import("./BeneficiarySecurityStatus");
  response.loading = true;
  const loading = renderToStaticMarkup(<Status beneficiaryId="beneficiary-1" accountType="User" />);
  assert.match(loading, /role="status"/);
  assert.match(loading, /Checking security factors/);
  assert.doesNotMatch(loading, /End-to-end encrypted|No security factors added/);

  response.loading = false;
  response.error = new Error("API unavailable");
  const failed = renderToStaticMarkup(<Status beneficiaryId="beneficiary-1" accountType="User" />);
  assert.match(failed, /Security status unavailable/);
  assert.doesNotMatch(failed, /End-to-end encrypted|No security factors added/);
});

test("missing query data or a missing beneficiary does not claim they have no security factors", async () => {
  const { default: Status } = await import("./BeneficiarySecurityStatus");
  const missing = renderToStaticMarkup(<Status beneficiaryId="missing-beneficiary" accountType="User" />);
  assert.match(missing, /Security status unavailable/);
  assert.doesNotMatch(missing, /End-to-end encrypted|No security factors added/);

  response.data = undefined;
  const unavailable = renderToStaticMarkup(<Status beneficiaryId="beneficiary-1" accountType="User" />);
  assert.match(unavailable, /Security status unavailable/);
  assert.doesNotMatch(unavailable, /End-to-end encrypted|No security factors added/);
});
