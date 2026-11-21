// Verifies apex cipherwill.com redirect rules and .well-known exclusions.
// Owns host-level redirect matching assertions against Next.js route compilation.
// Does not start an HTTP server or test reverse-proxy TLS configuration.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const canonicalRedirects = require("./canonicalRedirects.js") as Array<{
  source: string;
  has: Array<{ type: string; value: string }>;
  destination: string;
  permanent: boolean;
}>;
const { pathToRegexp } = require("next/dist/compiled/path-to-regexp") as {
  pathToRegexp: (path: string) => RegExp;
};

function resolveRedirect(host: string, pathname: string): string | null {
  for (const rule of canonicalRedirects) {
    if (!rule.has.every((h) => h.type === "host" && h.value === host)) continue;
    const match = pathToRegexp(rule.source).exec(pathname);
    if (!match) continue;
    return match[1] ? rule.destination.replace(":path", match[1]) : rule.destination;
  }
  return null;
}

test("redirects apex cipherwill.com paths permanently to www.cipherwill.com", () => {
  assert.equal(canonicalRedirects.every((rule) => rule.permanent === true), true);
  assert.equal(resolveRedirect("cipherwill.com", "/"), "https://www.cipherwill.com/");
  assert.equal(resolveRedirect("cipherwill.com", "/pricing"), "https://www.cipherwill.com/pricing");
  assert.equal(resolveRedirect("cipherwill.com", "/app/notes"), "https://www.cipherwill.com/app/notes");
  assert.equal(resolveRedirect("cipherwill.com", "/upgrade"), "https://www.cipherwill.com/upgrade");
});

test("excludes .well-known verification files and non-apex hosts", () => {
  assert.equal(resolveRedirect("cipherwill.com", "/.well-known/assetlinks.json"), null);
  assert.equal(resolveRedirect("cipherwill.com", "/.well-known"), null);
  assert.equal(resolveRedirect("www.cipherwill.com", "/"), null);
  assert.equal(resolveRedirect("www.cipherwill.com", "/app"), null);
  assert.equal(resolveRedirect("localhost", "/"), null);
});
