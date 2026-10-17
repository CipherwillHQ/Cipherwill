// What it does: Checks Chat access for enabled, disabled, and loading flags.
// What it owns: Placeholder rendering and replacement redirects to Home.
// What it does NOT do: Open a browser or contact PostHog services.

import assert from "node:assert/strict";
import { beforeEach, mock, test } from "node:test";
import { pathToFileURL } from "node:url";
import { redirect, RedirectType } from "next/navigation";
import { renderToStaticMarkup } from "react-dom/server";

let chatEnabled: boolean | undefined;
const redirectTo = mock.fn(redirect);
const featureFlag = mock.fn((_flag: string) => chatEnabled);

mock.module("next/navigation", { namedExports: {
  redirect: redirectTo,
  RedirectType,
  usePathname: () => "/app/chat",
} });
mock.module(pathToFileURL(require.resolve("posthog-js/react")), {
  namedExports: { useFeatureFlagEnabled: featureFlag },
});

beforeEach(() => {
  chatEnabled = undefined;
  redirectTo.mock.resetCalls();
  featureFlag.mock.resetCalls();
});

test("enabled Chat renders its placeholder, responsive headers, and mobile navigation", async () => {
  const { default: ChatPage } = await import("./page");
  chatEnabled = true;
  const markup = renderToStaticMarkup(<ChatPage />);

  assert.match(markup, /Chat is coming soon\./);
  assert.match(markup, /text-lg font-semibold">Chat<\/h1>/);
  assert.match(markup, /text-2xl font-semibold">Chat<\/h1>/);
  assert.match(markup, /href="\/app\/data"/);
  assert.equal(redirectTo.mock.callCount(), 0);
  assert.deepEqual(featureFlag.mock.calls[0].arguments, ["chat-feature"]);
});

test("loading Chat hides its content without redirecting", async () => {
  const { default: ChatPage } = await import("./page");

  assert.equal(renderToStaticMarkup(<ChatPage />), "");
  assert.equal(redirectTo.mock.callCount(), 0);
});

test("disabled Chat redirects direct visits to Home with replacement history", async () => {
  const { default: ChatPage } = await import("./page");
  chatEnabled = false;

  assert.throws(() => renderToStaticMarkup(<ChatPage />), /NEXT_REDIRECT/);
  assert.deepEqual(redirectTo.mock.calls[0].arguments, ["/app", RedirectType.replace]);
});

test("Chat waits for flags and removes its placeholder if access is revoked", async () => {
  const { default: ChatPage } = await import("./page");

  assert.equal(renderToStaticMarkup(<ChatPage />), "");
  chatEnabled = true;
  assert.match(renderToStaticMarkup(<ChatPage />), /Chat is coming soon\./);
  chatEnabled = false;
  assert.throws(() => renderToStaticMarkup(<ChatPage />), /NEXT_REDIRECT/);
  assert.equal(redirectTo.mock.callCount(), 1);
});
