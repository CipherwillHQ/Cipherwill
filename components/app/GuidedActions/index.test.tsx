// Verifies the guide opens on overview and pauses/resumes the same objective.
// Owns page controller transitions using the real in-memory engine.
// Does not open a browser or send account data to real services.
import test, { beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { pathToFileURL } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import type { GuidancePanelProps, GuidanceOverviewProps, GuidanceServices } from "@/types/interfaces";
import { BrowserGuidanceEngine } from "./core/browserEngine";
import { firstAssetFixture } from "./core/fixtures/firstAsset";
import { choiceServices } from "./core/fixtures/choices";

let engine: BrowserGuidanceEngine;
let slots: unknown[] = [];
let slotIndex = 0;
const effects: Array<() => void> = [];
const timers: Array<() => void> = [];
const capture = mock.fn();
const complete = mock.fn(async () => ({ status: "complete", beneficiaryPersonId: null }));
let panel: GuidancePanelProps;
let overview: Pick<GuidanceOverviewProps, "onStart" | "setupLoading" | "setupAvailable" | "setupError" | "deferred" | "onResume">;
let timerActive = false;

Object.defineProperty(globalThis, "window", { configurable: true,
  value: { setTimeout: (callback: () => void) => { timers.push(callback); return 1; }, clearTimeout: () => {} } });
mock.module("react", { defaultExport: React, namedExports: {
  ...React,
  useCallback: (callback: unknown) => callback,
  useEffect: (effect: () => void) => { effects.push(effect); },
  useRef: (initial: unknown) => {
    const index = slotIndex++;
    if (slots[index] === undefined) slots[index] = { current: initial };
    return slots[index];
  },
  useState: (initial: unknown) => {
    const index = slotIndex++;
    if (slots[index] === undefined) slots[index] = initial;
    return [slots[index], (value: unknown) => { slots[index] = value; }];
  },
} });
mock.module(pathToFileURL(require.resolve("posthog-js/react")), { namedExports: { usePostHog: () => ({ capture }) } });
mock.module("../../../contexts/AuthContext/index.tsx", { namedExports: { useAuth: () => ({ user: { id: "owner-1" } }) } });
mock.module("../../../contexts/SessionContext/index.tsx", { namedExports: { useSession: () => ({ session: null }) } });
mock.module("../Sidebar/MobileFloatingMenu.tsx", { defaultExport: () => <button>App menu</button> });
mock.module("./hooks/useObjectiveEngine.ts", { defaultExport: () => ({ ...engine.getSnapshot(), engine }) });
mock.module("./hooks/useGuidedTimedDisplay.ts", { defaultExport: (active: boolean) => { timerActive = active; } });
mock.module("./components/GuidePanel.tsx", { defaultExport: (props: GuidancePanelProps) => { panel = props; return <section>Objective slide</section>; } });
mock.module("./components/GuideOverviewSlide.tsx", { defaultExport: (props: typeof overview) => { overview = props; return <section>Account overview</section>; } });

beforeEach(async () => {
  slots = []; slotIndex = 0; effects.length = 0; timers.length = 0;
  capture.mock.resetCalls(); complete.mock.resetCalls();
  const definition = firstAssetFixture(0);
  definition.skippable = false;
  const services: GuidanceServices = {
    ...choiceServices,
    loadCatalog: async () => [definition],
    loadAccount: async () => ({ firstName: "Asha", lastName: "Shah", birthDate: "2000-01-01", beneficiaryCount: 1 }),
    loadContext: async () => ({ NOTE: 0 }), completeObjective: complete,
    runOperation: async (type, args) => type === "create_item_id" ? "guided_test_id" : { itemId: args.itemId },
  };
  engine = new BrowserGuidanceEngine(services);
  await engine.initialize();
});

async function renderPage() {
  const { default: Page } = await import("./index");
  slotIndex = 0; effects.length = 0;
  return renderToStaticMarkup(<Page />);
}

test("overview is first; Let's do this later returns there without completing or skipping a mandatory objective", async () => {
  const initial = await renderPage();
  assert.match(initial, /Account overview/);
  assert.match(initial, /App menu/);
  assert.doesNotMatch(initial, /<header|Leave setup/);
  assert.equal(timerActive, false);
  overview.onStart(); await new Promise(resolve => setImmediate(resolve));
  assert.match(await renderPage(), /Objective slide/);
  assert.equal(timerActive, true);
  assert.equal(panel.started, false);
  panel.onStart(); await renderPage();
  assert.equal(panel.started, true);
  await panel.onSubmit("Family note");
  await renderPage();
  assert.equal(panel.current?.result.step, "content");
  assert.equal(panel.started, true);
  panel.onClose();
  assert.match(await renderPage(), /Account overview/);
  assert.equal(timerActive, false);
  assert.equal(complete.mock.callCount(), 0);
  assert.equal(engine.getSnapshot().current?.objectiveId, "add_first_note");
  assert.equal(engine.getSnapshot().current?.result.state?.title, "Family note");
  overview.onStart(); await new Promise(resolve => setImmediate(resolve));
  assert.match(await renderPage(), /Objective slide/);
  assert.equal(panel.current?.result.step, "content");
  assert.doesNotMatch(JSON.stringify(capture.mock.calls.map(call => call.arguments)), /Family note/);
});

test("completion returns to overview after the final slide and offers the up-to-date state", async () => {
  await renderPage(); overview.onStart(); await new Promise(resolve => setImmediate(resolve)); await renderPage();
  await panel.onSubmit("Family note"); await renderPage();
  await panel.onSubmit("Private message"); await renderPage();
  await panel.onContinue(); await renderPage();
  assert.equal(panel.current?.result.action, "complete");
  for (const effect of effects) effect();
  assert.equal(capture.mock.calls.filter(call => call.arguments[0] === "objective_completed").length, 1);
  await panel.onContinue(); await renderPage();
  for (const effect of effects) effect();
  for (const timer of timers) timer();
  assert.match(await renderPage(), /Account overview/);
  assert.equal(overview.setupAvailable, false);
  assert.equal(complete.mock.callCount(), 1);
});

test("the /app/guide route renders the guide page", async () => {
  const { default: Route } = await import("../../../app/app/guide/page");
  assert.match(renderToStaticMarkup(<Route />), /Account overview/);
});

test("Skip from the objective introduction returns to overview with a resumable objective", async () => {
  await renderPage(); overview.onStart(); await new Promise(resolve => setImmediate(resolve)); await renderPage();
  const flow = firstAssetFixture(0);
  flow.skippable = true;
  engine = new BrowserGuidanceEngine({ loadCatalog: async () => [flow],
    loadAccount: async () => ({ firstName: null, lastName: null, birthDate: null, beneficiaryCount: 0 }),
    loadContext: async () => ({ NOTE: 0 }), runOperation: async () => null,
    completeObjective: complete, ...choiceServices,
  });
  await engine.initialize(); await renderPage();
  await panel.onDefer();
  await renderPage();
  for (const effect of effects) effect();
  for (const timer of timers) timer();
  assert.match(await renderPage(), /Account overview/);
  assert.equal(complete.mock.callCount(), 0);
  assert.equal(overview.deferred[0].objectiveId, flow.id);
  await overview.onResume(flow.id);
  assert.match(await renderPage(), /Objective slide/);
  assert.equal(panel.current?.objectiveId, flow.id);
  assert.deepEqual(engine.getSnapshot().deferred, []);
});
