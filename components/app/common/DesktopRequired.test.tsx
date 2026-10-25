// Verifies desktop-required actions do not render controls in the native wrapper.
// Owns the native/browser boundary using the actual gate component.
// Does not launch a browser or mutate account data.
import assert from "node:assert/strict";
import { before, mock, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
let mobile = false;
mock.module("../../../common/mobile/useMobileClient.ts", { namedExports: { useMobileClient: () => mobile } });
let MobileDesktopGate: typeof import("./DesktopRequired").default;
before(async () => { MobileDesktopGate = (await import("./DesktopRequired")).default; });
test("native wrapper shows a desktop requirement without mounting action controls", () => {
  mobile = true;
  const Action = mock.fn(() => <button>Start backup</button>);
  const html = renderToStaticMarkup(<MobileDesktopGate action="back up your vault"><Action /></MobileDesktopGate>);
  assert.match(html, /Please sign in on desktop to back up your vault/);
  assert.equal(Action.mock.callCount(), 0);
});
test("ordinary browsers retain the original action controls", () => {
  mobile = false;
  const html = renderToStaticMarkup(<MobileDesktopGate action="back up your vault"><button>Start backup</button></MobileDesktopGate>);
  assert.match(html, /Start backup/);
  assert.doesNotMatch(html, /Please sign in on desktop/);
});
