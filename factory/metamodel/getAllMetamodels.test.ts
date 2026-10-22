// Tests metadata pagination and exported beneficiary exclusions.
// Owns empty pages and multi-page query fixtures.
// Does not query the backend or inspect encrypted contents.

import assert from "node:assert/strict";
import { mock, test } from "node:test";
mock.module("../../common/debug/logger.ts", { defaultExport: { info: mock.fn() } });

test("an empty metadata page returns an empty list", async () => {
  const { default: getAllMetamodels } = await import("./getAllMetamodels");
  assert.deepEqual(await getAllMetamodels({ client: { query: async () => ({ data: { getMetamodels: { models: [], has_more: false } } }) } as any }), []);
});

test("pagination retains exclusions and advances to the final page", async () => {
  const { default: getAllMetamodels } = await import("./getAllMetamodels");
  const first = { id: "note-1", ignored_beneficiaries: ["person"] };
  const second = { id: "note-2", ignored_beneficiaries: [] };
  const query = mock.fn(async (_options: any) => ({ data: { getMetamodels: { models: [first], has_more: true } } }));
  query.mock.mockImplementationOnce(async () => ({ data: { getMetamodels: { models: [second], has_more: false } } }), 1);
  assert.deepEqual(await getAllMetamodels({ client: { query } as any }), [first, second]);
  assert.equal(query.mock.calls[1].arguments[0].variables.cursor, first.id);
  const { print } = await import("graphql");
  assert.match(print(query.mock.calls[0].arguments[0].query), /ignored_beneficiaries/);
});
