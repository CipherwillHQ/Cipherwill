// Checks shared segment visibility in the will overview.
// Owns empty group, loading, error, and access-specific query regressions.
// Does not open a browser or contact the GraphQL backend.

import assert from "node:assert/strict";
import { beforeEach, mock, test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { MetamodelTypeCount } from "@/types/interfaces";

let counts: MetamodelTypeCount[] | undefined;
let loading = false;
let error: Error | undefined;
let variables: { access_id: string };
mock.module("@apollo/client/react", { namedExports: {
  useQuery: (_query: unknown, options: { variables: typeof variables }) => {
    variables = options.variables;
    return { loading, error, data: counts ? { getGrantedMetamodelTypeCounts: counts } : undefined, refetch: mock.fn() };
  },
} });

beforeEach(() => {
  counts = [{ type: "NOTE", count: 2 }, { type: "PASSWORD", count: 0 }, { type: "FILE", count: 1 }];
  loading = false;
  error = undefined;
});

test("the overview shows only populated shared segments and their groups", async () => {
  const { default: ExecutorSegmentGrid } = await import("./ExecutorSegmentGrid");
  const markup = renderToStaticMarkup(<ExecutorSegmentGrid accessId="will" />);
  assert.match(markup, /href="\/executor\/will\/notes"/);
  assert.match(markup, /href="\/executor\/will\/storage"/);
  assert.match(markup, />Data<\/h3>/);
  assert.match(markup, />Storage<\/h3>/);
  assert.doesNotMatch(markup, /href="\/executor\/will\/(passwords|email-accounts|device-locks|seed-phrases|defi-staking|bank-accounts|payment-cards)"/);
  assert.doesNotMatch(markup, />Web3 Finance<|>Finance</);
  assert.deepEqual(variables, { access_id: "will" });
});

test("empty first and last groups are removed when only a finance segment is populated", async () => {
  const { default: ExecutorSegmentGrid } = await import("./ExecutorSegmentGrid");
  counts = [{ type: "BANK_ACCOUNT", count: 1 }];
  const markup = renderToStaticMarkup(<ExecutorSegmentGrid accessId="will" />);
  assert.match(markup, /href="\/executor\/will\/bank-accounts"/);
  assert.match(markup, />Finance<\/h3>/);
  assert.doesNotMatch(markup, />Data<|>Web3 Finance<|>Storage<|href="\/executor\/will\/payment-cards"/);
});

test("the entire shared section is hidden when no items are available", async () => {
  const { default: ExecutorSegmentGrid } = await import("./ExecutorSegmentGrid");
  counts = [];
  assert.equal(renderToStaticMarkup(<ExecutorSegmentGrid accessId="empty-will" />), "");
});

test("unknown counts show loading without empty category cards", async () => {
  const { default: ExecutorSegmentGrid } = await import("./ExecutorSegmentGrid");
  counts = undefined;
  loading = true;
  const markup = renderToStaticMarkup(<ExecutorSegmentGrid accessId="will" />);
  assert.match(markup, /aria-label="Loading shared sections"/);
  assert.doesNotMatch(markup, /href="\/executor\/will\//);
});

test("failed counts offer recovery without claiming that shared segments are empty", async () => {
  const { default: ExecutorSegmentGrid } = await import("./ExecutorSegmentGrid");
  counts = undefined;
  error = new Error("Internal query error");
  const markup = renderToStaticMarkup(<ExecutorSegmentGrid accessId="will" />);
  assert.match(markup, /Unable to load shared sections/);
  assert.match(markup, /Try again/);
  assert.doesNotMatch(markup, /href="\/executor\/will\/|Internal query error/);
});
