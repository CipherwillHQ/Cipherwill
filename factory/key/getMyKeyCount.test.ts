// Tests backup key selection and file exclusion requests.
// Owns maximum-count factors and the backup-only query flag.
// Does not read keys or contact a server.

import assert from "node:assert/strict";
import { mock, test } from "node:test";
import getMyKeyCount from "./getMyKeyCount";

test("null is not offered for data available only through a secure factor", async () => {
  const client = { query: async () => ({ data: { getMyKeyCount: [
    { publicKey: "null", count: 0 }, { publicKey: "factor", count: 2 },
  ] } }) } as any;
  assert.deepEqual(await getMyKeyCount(client), { count: 2, publicKey: ["factor"] });
});

test("backup requests counts that exclude storage files", async () => {
  const query = mock.fn(async (_options: any) => ({ data: { getMyKeyCount: [] } }));
  await getMyKeyCount({ query } as any);
  assert.equal(query.mock.calls[0].arguments[0].variables?.exclude_files, true);
});
