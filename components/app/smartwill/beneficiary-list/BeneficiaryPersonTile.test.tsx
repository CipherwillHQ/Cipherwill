// Tests beneficiary row navigation alongside existing management controls.
// Owns link destination and independent message, removal, and migration rendering.
// Does not open a browser, run migrations, or delete beneficiaries.

import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { SmartWillBeneficiary } from "@/types/interfaces";

mock.module("@apollo/client/react", { namedExports: {
  useApolloClient: () => ({}),
  useMutation: () => [mock.fn()],
} });
mock.module("../../../../contexts/SessionContext/index.tsx", { namedExports: {
  useSession: () => ({ session: {} }),
} });
mock.module("../CustomMessage.tsx", { defaultExport: () => <button>Create Message</button> });
mock.module("../ConfirmationPopup.tsx", { defaultExport: () => null });
mock.module("./beneficiaryMigration.ts", { namedExports: {
  executeBeneficiaryMigration: mock.fn(), getMigrationSessionError: () => null,
  getMigrationSourceLabel: () => "Unencrypted vault",
} });

const beneficiary: SmartWillBeneficiary = {
  id: "beneficiary-record", person_id: "person-record", user_id: "owner",
  publicKey: "test-key", custom_message: null, created_at: "0",
};
const props = {
  beneficiary,
  person: { id: "person-record", first_name: "Asha", email: "asha@example.com" },
  beneficiary_key_count: [{ beneficiary_id: "beneficiary-record", factor_wise_count: [{ publicKey: "null", count: 1 }] }],
  max_key_count: 1, max_publicKey: "null",
};

test("a beneficiary row links to its own record and keeps message and removal outside the link", async () => {
  const { default: Tile } = await import("./BeneficiaryPersonTile");
  const html = renderToStaticMarkup(<Tile {...props} />);
  const link = html.match(/<a\b[^>]*>[\s\S]*?<\/a>/)?.[0] || "";

  assert.match(link, /href="\/app\/beneficiaries\/beneficiary-record"/);
  assert.match(link, /asha@example.com/);
  assert.match(link, /View details/);
  assert.match(link, /after:inset-0/);
  assert.doesNotMatch(link, /<button/);
  assert.match(html, /<button>Create Message<\/button>/);
  assert.match(html, /remove-beneficiary-button/);
  assert.match(html, /In Sync/);
});

test("migration stays available alongside beneficiary detail navigation", async () => {
  const { default: Tile } = await import("./BeneficiaryPersonTile");
  const html = renderToStaticMarkup(<Tile {...props} max_key_count={2} />);
  const link = html.match(/<a\b[^>]*>[\s\S]*?<\/a>/)?.[0] || "";

  assert.match(html, /href="\/app\/beneficiaries\/beneficiary-record"/);
  assert.match(html, /Requires Migration/);
  assert.match(html, />Click to Migrate<\/button>/);
  assert.doesNotMatch(link, /Click to Migrate/);
});
