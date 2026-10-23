// Verifies the guide fills the content area while shared app navigation remains.
// Owns route-specific shell rendering regressions.
// Does not open a browser or mount account providers.
import test, { mock } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";

let pathname = "/app/guide";
mock.module("next/navigation", { namedExports: { usePathname: () => pathname } });
mock.module("../Sidebar/index.tsx", { defaultExport: () => <aside>App navigation</aside> });

test("the guide retains the sidebar and fills the content area without a reading-width restriction", async () => {
  const { default: Shell } = await import("./AppPageShell");
  const html = renderToStaticMarkup(<Shell><main>Guide slides</main></Shell>);
  assert.match(html, /cw-vh-screen cw-app-safe-area/);
  assert.match(html, /Guide slides/);
  assert.match(html, /App navigation/);
  assert.match(html, /flex min-h-full w-full flex-col/);
  assert.doesNotMatch(html, /cw-content-width-wrapper|pb-40/);
});

test("ordinary app pages keep their existing sidebar, scrolling, and content width", async () => {
  const { default: Shell } = await import("./AppPageShell");
  pathname = "/app";
  const html = renderToStaticMarkup(<Shell><main>Dashboard</main></Shell>);
  assert.match(html, /App navigation/);
  assert.match(html, /cw-content-width-wrapper/);
  assert.match(html, /pb-40/);
  assert.match(html, /Dashboard/);
});
