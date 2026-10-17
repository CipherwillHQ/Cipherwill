// What it does: Checks Chat ordering and visibility in the shared sidebar.
// What it owns: Navigation regressions across PostHog feature flag states.
// What it does NOT do: Open a browser or render account and support widgets.

import assert from "node:assert/strict";
import { beforeEach, mock, test } from "node:test";
import { pathToFileURL } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";

let chatEnabled: boolean | undefined;
const featureFlag = mock.fn((_flag: string) => chatEnabled);

mock.module("next/navigation", { namedExports: { usePathname: () => "/app/chat" } });
mock.module(pathToFileURL(require.resolve("posthog-js/react")), {
  namedExports: { useFeatureFlagEnabled: featureFlag },
});
mock.module("../../../contexts/SessionContext/index.tsx", {
  namedExports: { useSession: () => ({ lock: mock.fn(), session: null }) },
});
mock.module("../../../contexts/UserSetupContext/index.tsx", {
  namedExports: { useUserContext: () => ({ preferences: {} }) },
});
mock.module("./SwitchThemeButton.tsx", { defaultExport: () => null });
mock.module("../../common/PremiumFlag.tsx", { defaultExport: () => null });
mock.module("../../common/UserFlag.tsx", { defaultExport: () => null });
mock.module("../../debug/DevOnly.tsx", { defaultExport: () => null });
mock.module("../LiveChatBox.tsx", { defaultExport: () => null });

beforeEach(() => {
  featureFlag.mock.resetCalls();
});

for (const flagState of [true, false, undefined]) {
  test(`shared desktop and mobile sidebar gates Chat when chat-feature is ${flagState}`, async () => {
    const { default: SidebarPanel } = await import("./SidebarPanel");
    chatEnabled = flagState;
    const markup = renderToStaticMarkup(<SidebarPanel />);
    const navigationPaths = Array.from(
      markup.matchAll(/data-cy="([^"]+)-nav-link"/g),
      (match: RegExpMatchArray) => match[1],
    );

    if (flagState === true) {
      assert.deepEqual(navigationPaths.slice(0, 3), ["/app", "/app/chat", "/app/segments"]);
      assert.match(markup, /href="\/app\/chat"/);
      assert.match(markup, />Chat<\/div>/);
      assert.match(markup, /<a[^>]*data-cy="\/app\/chat-nav-link"[^>]*><div data-sidebar-active="true"/);
    } else {
      assert.deepEqual(navigationPaths.slice(0, 2), ["/app", "/app/segments"]);
      assert.equal(navigationPaths.includes("/app/chat"), false);
      assert.doesNotMatch(markup, /href="\/app\/chat"/);
      assert.doesNotMatch(markup, />Chat<\/div>/);
    }
    assert.deepEqual(featureFlag.mock.calls[0]?.arguments, ["chat-feature"]);
  });
}
