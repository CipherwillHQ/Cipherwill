// Checks the executor dashboard's access and query states.
// Owns shared-will links, expired access, and unavailable-state regressions.
// Does not open a browser or contact the GraphQL backend.

import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { getExecutorAccessStatus } from "../../common/executor/accessStatus";
import type { AccessDetails } from "../../types/interfaces";

const activeAccess: AccessDetails = {
  id: "active-will", user: "donor", beneficiary_id: "beneficiary",
  created_at: "1700000000000", expire_at: "4102444800000",
};
const expiredAccess = { ...activeAccess, id: "expired-will", expire_at: "1700000000000" };
let loading = false;
let error: Error | undefined;
let accessList: AccessDetails[] = [];
let unavailable = false;
const refetch = mock.fn(async () => ({}));

mock.module("@apollo/client/react", { namedExports: {
  useQuery: (query: { definitions: Array<{ name?: { value: string } }> }) => {
    const name = query.definitions[0].name?.value;
    if (name === "GET_PERSON_BY_IDS") {
      return { data: { getPersonByIds: [{ id: "donor", first_name: "Asha", last_name: "Patel", email: "asha@example.com" }] } };
    }
    return { loading, error, data: unavailable ? undefined : { getAllBeneficiaryAccess: accessList }, refetch };
  },
} });
mock.module("../../contexts/AccessDetailsContext/index.tsx", {
  namedExports: { useAccessDetails: () => ({ loading, error, accessDetails: unavailable ? null : accessList[0] }) },
});

test("dashboard renders empty, loading, and recoverable error states", async () => {
  const { default: ExecutorDashboard } = await import("./ExecutorDashboard");
  accessList = [];
  assert.match(renderToStaticMarkup(<ExecutorDashboard />), /No wills shared with you yet/);
  loading = true;
  assert.match(renderToStaticMarkup(<ExecutorDashboard />), /aria-label="Loading shared wills"/);
  loading = false;
  error = new Error("Internal query error");
  const failed = renderToStaticMarkup(<ExecutorDashboard />);
  assert.match(failed, /Unable to load shared wills/);
  assert.match(failed, /Try again/);
  assert.doesNotMatch(failed, /Internal query error/);
  error = undefined;
});

test("only available wills have access links and the donor has a full name", async () => {
  const { default: ExecutorDashboard } = await import("./ExecutorDashboard");
  accessList = [activeAccess, expiredAccess];
  const markup = renderToStaticMarkup(<ExecutorDashboard />);
  assert.match(markup, /href="\/executor\/active-will"/);
  assert.doesNotMatch(markup, /href="\/executor\/expired-will"/);
  assert.match(markup, /Asha Patel/);
  assert.match(markup, /asha@example.com/);
  assert.match(markup, /Access ended/);
  assert.match(markup, /Read-only/);
});

test("access boundary hides children until access is available", async () => {
  const { default: ExecutorAccessBoundary } = await import("./ExecutorAccessBoundary");
  for (const state of ["loading", "missing", "expired", "error"]) {
    loading = state === "loading";
    unavailable = state === "missing";
    accessList = [state === "expired" ? expiredAccess : activeAccess];
    error = state === "error" ? new Error("Access refused") : undefined;
    const markup = renderToStaticMarkup(<ExecutorAccessBoundary><div>Protected details</div></ExecutorAccessBoundary>);
    assert.doesNotMatch(markup, /Protected details/);
  }
  loading = false;
  unavailable = false;
  error = undefined;
  accessList = [activeAccess];
  const granted = renderToStaticMarkup(<ExecutorAccessBoundary><div>Protected details</div></ExecutorAccessBoundary>);
  assert.match(granted, /Protected details/);
  assert.match(granted, /Access granted/);
  assert.match(granted, /Read-only/);
  assert.match(granted, /Available until/);
});

test("deadline equality is treated as expired", () => {
  const deadline = Number(activeAccess.expire_at);
  assert.equal(getExecutorAccessStatus(activeAccess.expire_at, deadline - 1).expired, false);
  assert.equal(getExecutorAccessStatus(activeAccess.expire_at, deadline).expired, true);
  assert.equal(getExecutorAccessStatus(activeAccess.expire_at, deadline + 1).expired, true);
  assert.equal(getExecutorAccessStatus(activeAccess.expire_at, deadline - 1).deadlineLabel, "1 Jan 2100, 12:00 AM UTC");
});
