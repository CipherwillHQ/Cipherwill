// Verifies encrypted asset reads feed local templates without plaintext requests.
// Owns fake Apollo responses and locally encrypted pod fixtures.
// Does not access the network, browser, or real vault.
import test from "node:test";
import assert from "node:assert/strict";
import CryptoJS from "crypto-js";
import type { ApolloClient } from "@apollo/client";
import { loadGuidanceAssets } from "./loadGuidanceAssets";

test("decrypts asset details locally and sends only identifiers in uncached reads", async () => {
  const requests: Array<{ query: unknown; variables?: unknown; fetchPolicy?: string }> = [];
  const plaintext = JSON.stringify({ type: "bank_account", version: "0.0.1",
    data: { bank_name: "Private Bank", account_number: "private-account", password: "private-password" } });
  const client = { query: async (request: any) => {
    requests.push(request);
    const name = request.query.definitions[0].name.value;
    if (name === "GET_METAMODEL_TYPE_COUNTS") return { data: { getMetamodelTypeCounts: [{ type: "BANK_ACCOUNT", count: 1 }] } };
    if (name === "GET_METAMODELS") return { data: { getMetamodels: { models: [{ id: "asset-1" }], has_more: false } } };
    if (name === "GET_POD") return { data: { getPod: { content: CryptoJS.AES.encrypt(plaintext, "local-key").toString() } } };
    return { data: { getKeyByRefId: { key: "local-key" } } };
  } } as unknown as ApolloClient;
  const context = await loadGuidanceAssets(client, null);
  assert.deepEqual(context, { total: 1, label: "your Private Bank bank account" });
  assert.ok(requests.every(request => request.fetchPolicy === "no-cache"));
  assert.doesNotMatch(JSON.stringify(requests), /Private Bank|private-account|private-password|local-key/);
  assert.doesNotMatch(JSON.stringify(context), /private-account|private-password/);
});

test("unreadable assets leave the conversation usable with generic context", async () => {
  const client = { query: async (request: any) => {
    const name = request.query.definitions[0].name.value;
    if (name === "GET_METAMODEL_TYPE_COUNTS") return { data: { getMetamodelTypeCounts: [{ type: "BANK_ACCOUNT", count: 1 }] } };
    if (name === "GET_METAMODELS") return { data: { getMetamodels: { models: [{ id: "locked-asset" }], has_more: false } } };
    return { data: {} };
  } } as unknown as ApolloClient;
  assert.deepEqual(await loadGuidanceAssets(client, null), { total: 1, label: null });
});

test("locking during asset loading stops subsequent reads and decryption", async () => {
  const controller = new AbortController();
  let requests = 0;
  const client = { query: async () => {
    requests++;
    controller.abort();
    return { data: { getMetamodelTypeCounts: [{ type: "BANK_ACCOUNT", count: 1 }] } };
  } } as unknown as ApolloClient;
  await assert.rejects(loadGuidanceAssets(client, null, controller.signal), { name: "AbortError" });
  assert.equal(requests, 1);
});
