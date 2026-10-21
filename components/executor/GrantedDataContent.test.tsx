// Checks the redesigned details and sensitive-value reveal behavior.
// Owns decryption integration, safe note rendering, and visibility regressions.
// Does not open a browser or perform cryptographic operations.

import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { pathToFileURL } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { executorFields, isExecutorFieldSensitive } from "../../common/executor/fields";

let values: unknown[] = [];
let stateIndex = 0;
let modelType = "PASSWORD";
let loading = false;
let error: Error | undefined;
let decryptionError: Error | undefined;
let keyMissing = false;
let decryptionArgs: { access_id: string; metamodel_id: string };
const sanitize = mock.fn((value: string) => value.replace(/<script>.*?<\/script>/g, ""));

mock.module("react", { defaultExport: React, namedExports: {
  ...React,
  useState: (initial: unknown) => {
    const index = stateIndex++;
    if (values[index] === undefined) values[index] = initial;
    return [values[index], (value: unknown) => { values[index] = value; }];
  },
} });
mock.module("@apollo/client/react", { namedExports: {
  useQuery: () => ({
    loading, error,
    data: loading ? undefined : { getGrantedMetamodel: {
      id: "item", type: modelType, metadata: '{"name":"Shared item"}',
      created_at: "1700000000000", updated_at: "1700000000000",
    } },
  }),
} });
mock.module("../../common/executor/hooks/useDecryptedPod.tsx", {
  defaultExport: (args: typeof decryptionArgs) => {
    decryptionArgs = args;
    return { data: { getKeyByRefId: keyMissing ? null : {} }, error: decryptionError };
  },
});
mock.module(pathToFileURL(require.resolve("../../common/security/sanitizeHtml.ts")), { defaultExport: sanitize });

test("shared details use existing decryption and mask sensitive values", async () => {
  const { default: GrantedDataContent } = await import("./GrantedDataContent");
  stateIndex = 0;
  values = [{ username: "asha", password: "secret-password" }, null, false];
  const markup = renderToStaticMarkup(<GrantedDataContent slug="passwords" accessId="will" modelId="item" />);
  assert.equal(decryptionArgs.access_id, "will");
  assert.equal(decryptionArgs.metamodel_id, "item");
  assert.match(markup, /Username/);
  assert.match(markup, /asha/);
  assert.match(markup, /Reveal Password/);
  assert.match(markup, /••••••••••••/);
  assert.doesNotMatch(markup, /secret-password/);
});

test("reveal and hide require the field's explicit button action", async () => {
  const { default: ExecutorField } = await import("./ExecutorField");
  stateIndex = 0;
  values = [false];
  const props = { label: "Password", value: "secret-password", sensitive: true };
  const masked = ExecutorField(props);
  const revealButton = masked.props.children[0].props.children[1];
  assert.equal(revealButton.props["aria-label"], "Reveal Password");
  revealButton.props.onClick();
  stateIndex = 0;
  const revealed = ExecutorField(props);
  assert.match(renderToStaticMarkup(revealed), /secret-password/);
  assert.equal(revealed.props.children[0].props.children[1].props["aria-label"], "Hide Password");
  revealed.props.children[0].props.children[1].props.onClick();
  stateIndex = 0;
  assert.doesNotMatch(renderToStaticMarkup(ExecutorField(props)), /secret-password/);
});

test("note HTML is sanitized and legacy string notes remain readable", async () => {
  const { default: GrantedDataContent } = await import("./GrantedDataContent");
  modelType = "NOTE";
  stateIndex = 0;
  values = [{ content: "<p>Family instructions</p><script>unsafe()</script>" }, null];
  const markup = renderToStaticMarkup(<GrantedDataContent slug="notes" accessId="will" modelId="item" />);
  assert.match(markup, /<p>Family instructions<\/p>/);
  assert.doesNotMatch(markup, /unsafe\(\)/);
  assert.equal(sanitize.mock.calls.length, 1);
  stateIndex = 0;
  values = ["Legacy personal message", null];
  assert.match(renderToStaticMarkup(<GrantedDataContent slug="notes" accessId="will" modelId="item" />), /Legacy personal message/);
});

test("details show loading and unavailable states without rendering protected fields", async () => {
  const { default: GrantedDataContent } = await import("./GrantedDataContent");
  for (const state of ["loading", "query-error", "key-missing", "key-error"]) {
    loading = state === "loading";
    error = state === "query-error" ? new Error("Query failure") : undefined;
    decryptionError = state === "key-error" ? new Error("Key failure") : undefined;
    keyMissing = state === "key-missing";
    stateIndex = 0;
    values = [{ username: "protected-username" }, null];
    const markup = renderToStaticMarkup(<GrantedDataContent slug="passwords" accessId="will" modelId="item" />);
    assert.doesNotMatch(markup, /protected-username/);
    assert.match(markup, state === "loading" ? /Loading shared details/ : /This item is unavailable/);
  }
});

test("masking covers passwords, seed phrases, and financial identifiers", () => {
  for (const [slug, key] of [
    ["passwords", "password"], ["email-accounts", "backupCodes"],
    ["device-locks", "pin"], ["seed-phrases", "phrase"],
    ["payment-cards", "card_number"], ["payment-cards", "cvv"],
    ["bank-accounts", "account_number"], ["defi-staking", "password"],
  ]) {
    const field = executorFields[slug].find((item) => item.key === key);
    assert.ok(field);
    assert.equal(isExecutorFieldSensitive(field), true);
  }
  assert.equal(isExecutorFieldSensitive({ key: "username", label: "Username" }), false);
});
