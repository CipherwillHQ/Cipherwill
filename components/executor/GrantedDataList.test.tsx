// Checks read-only lists and the pagination used by executor categories.
// Owns beneficiary exclusions, folder routes, and page-merging regressions.
// Does not open a browser, decrypt data, or contact GraphQL services.

import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { mergeGrantedModelPages, mergeGrantedFolderPages } from "../../common/executor/grantedPages";
import type { GrantedMetamodel, GetGrantedMetamodelsQuery, GetGrantedStorageFoldersQuery } from "../../types/interfaces";

const sharedModel: GrantedMetamodel = {
  id: "shared-item", type: "PASSWORD", metadata: '{"name":"Shared account"}',
  created_at: "1700000000000", updated_at: "1700000000000",
};
let page: GetGrantedMetamodelsQuery["getGrantedMetamodels"] = {
  models: [sharedModel], has_more: false,
};
let loading = false;
let error: Error | undefined;
let variables: { access_id: string; type: string; cursor?: string; folder_id?: string };
const fetchMore = mock.fn(async (_options: unknown) => ({}));
const accessDetails = { id: "will", user: "donor", beneficiary_id: "recipient", created_at: "1700000000000", expire_at: "4102444800000" };

mock.module("next/navigation", { namedExports: { useParams: () => ({ id: "will" }) } });
mock.module("@apollo/client/react", { namedExports: {
  useQuery: (_query: unknown, options: { variables: typeof variables }) => {
    variables = options.variables;
    return { loading, error, data: loading ? undefined : { getGrantedMetamodels: page }, fetchMore, refetch: mock.fn() };
  },
} });
mock.module("../../contexts/AccessDetailsContext/index.tsx", {
  namedExports: { useAccessDetails: () => ({ accessDetails }) },
});

test("list excludes recipient restrictions and retains the other shared items", async () => {
  const { default: GrantedDataList } = await import("./GrantedDataList");
  page = {
    models: [
      sharedModel,
      { ...sharedModel, id: "excluded", metadata: '{"name":"Excluded account"}', ignored_beneficiaries: ["recipient"] },
      { ...sharedModel, id: "other-recipient", metadata: '{"name":"Another account"}', ignored_beneficiaries: ["someone-else"] },
    ],
    has_more: false,
  };
  const markup = renderToStaticMarkup(<GrantedDataList slug="passwords" />);
  assert.match(markup, /href="\/executor\/will\/passwords\/shared-item"/);
  assert.match(markup, /Another account/);
  assert.doesNotMatch(markup, /Excluded account|\/excluded"/);
  assert.doesNotMatch(markup, />Add|>Edit|>Delete/);
  assert.deepEqual(variables, { access_id: "will", type: "PASSWORD" });
});

test("storage preserves the current folder query and file detail route", async () => {
  const { default: GrantedDataList } = await import("./GrantedDataList");
  page = { models: [{ ...sharedModel, type: "FILE", metadata: '{"title":"Letter"}' }], has_more: false };
  const markup = renderToStaticMarkup(<GrantedDataList slug="storage" folderId="family-folder" />);
  assert.deepEqual(variables, { access_id: "will", type: "FILE", folder_id: "family-folder" });
  assert.match(markup, /href="\/executor\/will\/storage\/object\/shared-item"/);
  assert.match(markup, /Letter/);
});

test("lists distinguish loading, empty, and unavailable results", async () => {
  const { default: GrantedDataList } = await import("./GrantedDataList");
  loading = true;
  assert.match(renderToStaticMarkup(<GrantedDataList slug="notes" />), /aria-label="Loading shared items"/);
  loading = false;
  page = { models: [], has_more: false };
  assert.match(renderToStaticMarkup(<GrantedDataList slug="notes" />), /Nothing shared in this section/);
  error = new Error("Backend details");
  const markup = renderToStaticMarkup(<GrantedDataList slug="notes" />);
  assert.match(markup, /Unable to load shared items/);
  assert.doesNotMatch(markup, /Backend details/);
  error = undefined;
});

test("load more advances from the last fetched record, including an excluded record", async () => {
  const { default: GrantedDataList } = await import("./GrantedDataList");
  page = { models: [sharedModel, { ...sharedModel, id: "last-record", ignored_beneficiaries: ["recipient"] }], has_more: true };
  const tree = GrantedDataList({ slug: "passwords" });
  const button = tree.props.children.find((child: unknown) => child && typeof child === "object" && "type" in child && child.type === "button");
  assert.ok(button);
  await button.props.onClick();
  const options = fetchMore.mock.calls.at(-1)?.arguments[0] as { variables: { cursor: string }; updateQuery: unknown };
  assert.equal(options.variables.cursor, "last-record");
  assert.equal(options.updateQuery, mergeGrantedModelPages);
});

test("pagination retains previous models and adopts the next page's continuation state", () => {
  const previous = { getGrantedMetamodels: { models: [sharedModel], has_more: true } };
  const next = { getGrantedMetamodels: { models: [{ ...sharedModel, id: "next" }], has_more: false } };
  const merged = mergeGrantedModelPages(previous, { fetchMoreResult: next });
  assert.deepEqual(merged.getGrantedMetamodels.models.map((model) => model.id), ["shared-item", "next"]);
  assert.equal(merged.getGrantedMetamodels.has_more, false);
  assert.equal(previous.getGrantedMetamodels.models.length, 1);
  assert.equal(mergeGrantedModelPages(previous, {}), previous);
  const folderPage: GetGrantedStorageFoldersQuery = {
    getGrantedStorageFolders: { folders: [{ id: "one", name: "One", created_at: "1", updated_at: "1" }], has_more: true },
  };
  const nextFolderPage: GetGrantedStorageFoldersQuery = {
    getGrantedStorageFolders: { folders: [{ id: "two", name: "Two", created_at: "1", updated_at: "1" }], has_more: false },
  };
  const folders = mergeGrantedFolderPages(folderPage, { fetchMoreResult: nextFolderPage });
  assert.deepEqual(folders.getGrantedStorageFolders.folders.map((folder) => folder.id), ["one", "two"]);
  assert.equal(folders.getGrantedStorageFolders.has_more, false);
  assert.equal(mergeGrantedFolderPages(folderPage, {}), folderPage);
});
