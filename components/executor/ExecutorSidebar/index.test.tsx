// Checks navigation throughout the executor workspace.
// Owns populated category destinations, query states, and nested active states.
// Does not open a browser or fetch donor information.

import assert from "node:assert/strict";
import { beforeEach, mock, test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { MetamodelTypeCount } from "@/types/interfaces";

let pathname = "/executor";
const allCounts = ["NOTE", "EMAIL_ACCOUNT", "DEVICE_LOCK", "PASSWORD", "SEED_PHRASE", "DEFI_STAKING", "BANK_ACCOUNT", "PAYMENT_CARD", "FILE"].map((type) => ({ type, count: 1 }));
let counts: MetamodelTypeCount[] | undefined = allCounts;
let loading = false;
let error: Error | undefined;
let queryOptions: { variables: { access_id: string }; skip: boolean };
mock.module("@apollo/client/react", { namedExports: {
  useQuery: (_query: unknown, options: typeof queryOptions) => {
    queryOptions = options;
    return { loading, error, data: counts ? { getGrantedMetamodelTypeCounts: counts } : undefined, refetch: mock.fn() };
  },
} });
mock.module("next/navigation", { namedExports: { usePathname: () => pathname } });
mock.module("../../app/Sidebar/SidebarLogo.tsx", { defaultExport: () => null });
mock.module("../../app/Sidebar/SwitchThemeButton.tsx", { defaultExport: () => null });
mock.module("../../public/logo/SymbolicLogo.tsx", { defaultExport: () => null });
mock.module("./DonorName.tsx", { defaultExport: () => "Asha Patel" });

beforeEach(() => {
  pathname = "/executor";
  counts = allCounts;
  loading = false;
  error = undefined;
});

test("shared wills remains available on the dashboard landing page", async () => {
  const { default: ExecutorSidebar } = await import("./index");
  pathname = "/executor";
  const markup = renderToStaticMarkup(<ExecutorSidebar />);
  assert.match(markup, /<a(?=[^>]*href="\/executor")(?=[^>]*aria-current="page")[^>]*>/);
  assert.match(markup, /href="\/app"/);
  assert.doesNotMatch(markup, /undefined/);
});

test("individual will overview has an active navigation item", async () => {
  const { default: ExecutorSidebar } = await import("./index");
  pathname = "/executor/will";
  const markup = renderToStaticMarkup(<ExecutorSidebar />);
  assert.match(markup, /<a(?=[^>]*href="\/executor\/will")(?=[^>]*aria-current="page")[^>]*>/);
  assert.match(markup, /Asha Patel/);
  for (const slug of ["notes", "email-accounts", "device-locks", "passwords", "seed-phrases", "defi-staking", "bank-accounts", "payment-cards", "storage"]) {
    assert.match(markup, new RegExp('href="/executor/will/' + slug + '"'));
  }
  assert.doesNotMatch(markup, /\/undefined/);
});

test("nested detail and storage pages keep their category active", async () => {
  const { default: ExecutorSidebar } = await import("./index");
  for (const route of ["passwords/item", "notes/item", "storage/folder/family", "storage/object/file"]) {
    pathname = "/executor/will/" + route;
    const markup = renderToStaticMarkup(<ExecutorSidebar />);
    const category = route.split("/")[0];
    assert.match(markup, new RegExp('<a(?=[^>]*href="/executor/will/' + category + '")(?=[^>]*aria-current="page")[^>]*>'));
    assert.equal(Array.from(markup.matchAll(/aria-current="page"/g)).length, 1);
  }
});

test("only populated segments and their group headings appear", async () => {
  const { default: ExecutorSidebar } = await import("./index");
  pathname = "/executor/will";
  counts = [{ type: "NOTE", count: 2 }, { type: "PASSWORD", count: 0 }, { type: "FILE", count: 1 }];
  const markup = renderToStaticMarkup(<ExecutorSidebar />);
  assert.match(markup, /href="\/executor\/will\/notes"/);
  assert.match(markup, /href="\/executor\/will\/storage"/);
  assert.doesNotMatch(markup, /href="\/executor\/will\/(passwords|email-accounts|device-locks|seed-phrases|defi-staking|bank-accounts|payment-cards)"/);
  assert.doesNotMatch(markup, />Web3 Finance<|>Finance</);
  assert.deepEqual(queryOptions, { variables: { access_id: "will" }, skip: false });
});

test("a will with no shared items keeps overview navigation without segment headings", async () => {
  const { default: ExecutorSidebar } = await import("./index");
  pathname = "/executor/empty-will";
  counts = [];
  const markup = renderToStaticMarkup(<ExecutorSidebar />);
  assert.match(markup, /href="\/executor"/);
  assert.match(markup, /href="\/executor\/empty-will"/);
  assert.doesNotMatch(markup, /href="\/executor\/empty-will\/|>Data<|>Web3 Finance<|>Finance<|>Storage</);
});

test("segment loading and errors do not expose unverified categories", async () => {
  const { default: ExecutorSidebar } = await import("./index");
  pathname = "/executor/will";
  counts = undefined;
  loading = true;
  const pending = renderToStaticMarkup(<ExecutorSidebar />);
  assert.doesNotMatch(pending, /href="\/executor\/will\//);
  assert.match(pending, /aria-label="Loading shared sections"/);
  loading = false;
  error = new Error("Internal query error");
  const failed = renderToStaticMarkup(<ExecutorSidebar />);
  assert.doesNotMatch(failed, /href="\/executor\/will\/|Internal query error/);
  assert.match(failed, /Unable to load sections/);
  assert.match(failed, /aria-label="Reload shared sections"/);
});

test("the landing page skips segment counts and switching wills uses the current access ID", async () => {
  const { default: ExecutorSidebar } = await import("./index");
  renderToStaticMarkup(<ExecutorSidebar />);
  assert.equal(queryOptions.skip, true);
  pathname = "/executor/another-will/notes/item";
  renderToStaticMarkup(<ExecutorSidebar />);
  assert.deepEqual(queryOptions, { variables: { access_id: "another-will" }, skip: false });
});
