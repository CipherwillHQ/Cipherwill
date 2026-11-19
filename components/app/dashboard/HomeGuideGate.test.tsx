// What it does: Verifies HomeGuideGate switches between Classic Home, Guide, and loading states.
// What it owns: Experiment gating behavior across resolved and unresolved flag states.
// What it does NOT do: Contact PostHog or render real dashboard widgets.
import assert from "node:assert/strict";
import test, { mock } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

let state = { variant: "control" as string | boolean | undefined, ready: true, isGuideHome: false };

mock.module("../../../common/analytics/useHomeGuideExperiment.ts", {
  namedExports: { useHomeGuideExperiment: () => state },
});
mock.module("../GuidedActions/index.tsx", {
  defaultExport: () => <main>Guided home</main>,
});

test("HomeGuideGate renders classic home for control, GuidedActions for guide, and null before ready", async () => {
  const { default: HomeGuideGate } = await import("./HomeGuideGate");

  state = { variant: undefined, ready: false, isGuideHome: false };
  assert.equal(renderToStaticMarkup(<HomeGuideGate><div>Classic home</div></HomeGuideGate>), "");

  state = { variant: "control", ready: true, isGuideHome: false };
  assert.match(renderToStaticMarkup(<HomeGuideGate><div>Classic home</div></HomeGuideGate>), /Classic home/);

  state = { variant: "guide", ready: true, isGuideHome: true };
  assert.match(renderToStaticMarkup(<HomeGuideGate><div>Classic home</div></HomeGuideGate>), /Guided home/);
});
