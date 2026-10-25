// Verifies native users can view and manage security factors.
// Owns the page boundary regression with isolated factor controls.
// Does not contact the API or exercise authentication providers.
import assert from "node:assert/strict";
import { before, mock, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
mock.module("../../../common/mobile/useMobileClient.ts", { namedExports: { useMobileClient: () => true } });
mock.module("../../../components/app/factors/AddFactor.tsx", { defaultExport: () => <button>Add factor</button> });
mock.module("./FactorsList.tsx", { defaultExport: () => <div>Existing factors</div> });
mock.module("./KeyCount.tsx", { defaultExport: () => <div>Key counts</div> });
mock.module("../../../components/debug/DevOnly.tsx", { defaultExport: () => null });
mock.module("../../../components/app/factors/FactorNotice.tsx", { defaultExport: () => null });
mock.module("../../../components/app/common/page/DesktopAndMobilePageHeader.tsx", {
  defaultExport: ({ title, children }: any) => <header>{title}{children}</header>,
});
let Factors: typeof import("./page").default;
before(async () => { Factors = (await import("./page")).default; });
test("the mobile page renders its title, existing factors and add action", () => {
  const html = renderToStaticMarkup(<Factors />);
  assert.match(html, /Security Factors/);
  assert.match(html, /Add factor/);
  assert.match(html, /Existing factors/);
  assert.doesNotMatch(html, /Please sign in on desktop/);
});
