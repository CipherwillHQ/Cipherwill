// What it does: Reproduces onboarding losing the requested app destination.
// What it owns: Completion, skipping, cached completion, and failed submission regressions.
// What it does NOT do: Open a browser, render a full app, or call GraphQL services.

import assert from "node:assert/strict";
import { beforeEach, mock, test } from "node:test";
import { pathToFileURL } from "node:url";
import React, { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const option = { id: "google", label: "Google", requires_custom_text: false };
const effects: Array<() => void> = [];
let state: unknown[] = [];
let stateIndex = 0;
let currentUrl = "/app/billing?plan=annual";
let completed = false;
let submissionError: Error | undefined;
let actions: Parameters<typeof import("./OnboardingActions").default>[0];
const replace = mock.fn((url: string) => { currentUrl = url; });
const toastError = mock.fn();
const mutate = mock.fn<(options: unknown) => Promise<object>>(async () => {
  if (submissionError) throw submissionError;
  return {};
});
const refetch = mock.fn(async () => { completed = true; return {}; });

mock.module("react", { defaultExport: React, namedExports: {
  ...React,
  useEffect: (effect: () => void) => effects.push(effect),
  useState: (initial: unknown) => {
    const index = stateIndex++;
    if (state[index] === undefined) state[index] = initial;
    return [state[index], (value: unknown) => { state[index] = value; }];
  },
} });
mock.module("next/navigation", { namedExports: { useRouter: () => ({ replace }) } });
mock.module("@apollo/client/react", { namedExports: {
  useQuery: () => ({
    data: { getMyOnboarding: {
      is_completed: completed,
      heard_from_options_catalog: [option], expectation_options_catalog: [option],
    } }, loading: false, refetch,
  }),
  useMutation: () => [mutate, { loading: false }],
} });
mock.module(pathToFileURL(require.resolve("framer-motion")), { namedExports: { AnimatePresence: ({ children }: { children: ReactNode }) => children } });
mock.module(pathToFileURL(require.resolve("react-hot-toast")), { defaultExport: { success: mock.fn(), error: toastError } });
mock.module("../../common/SimpleButton.tsx", { defaultExport: () => null });
mock.module("../../loaders/FullscreenLoader.tsx", { defaultExport: () => null });
mock.module("../../public/logo/SymbolicLogo.tsx", { defaultExport: () => null });
mock.module("../../../graphql/ops/auth/queries/GET_MY_ONBOARDING.ts", { defaultExport: "GET_MY_ONBOARDING" });
mock.module("../../../graphql/ops/auth/mutations/COMPLETE_MY_ONBOARDING.ts", { defaultExport: "COMPLETE_MY_ONBOARDING" });
mock.module("./StepHeardFrom.tsx", { defaultExport: () => null });
mock.module("./StepExpectations.tsx", { defaultExport: () => null });
mock.module("./OnboardingBrandPanel.tsx", { defaultExport: () => null });
mock.module("./OnboardingActions.tsx", { defaultExport: (props: typeof actions) => { actions = props; return null; } });

beforeEach(() => {
  state = [2, option.id, "", [option.id], "", [option], [option]];
  stateIndex = 0;
  effects.length = 0;
  completed = false;
  submissionError = undefined;
  currentUrl = "/app/billing?plan=annual";
  replace.mock.resetCalls();
  mutate.mock.resetCalls();
  refetch.mock.resetCalls();
  toastError.mock.resetCalls();
});

for (const destination of ["/app/billing?plan=annual#checkout", "/app", "/app/settings?tab=profile"]) {
  test(`completed onboarding reveals the requested page ${destination}`, async () => {
    const { default: OnboardingFlow } = await import("./OnboardingFlow");
    const { default: OnboardingGuard } = await import("./OnboardingGuard");
    currentUrl = destination;
    renderToStaticMarkup(OnboardingFlow());
    for (const effect of effects) effect();
    await actions.onSubmit();
    assert.equal(completed, true);
    assert.equal(currentUrl, destination);
    assert.equal(replace.mock.callCount(), 0);
    const requestedPage = createElement("div", null, destination);
    assert.equal(OnboardingGuard({ children: requestedPage }).props.children, requestedPage);
  });
}

test("skipping both question steps reveals billing with its query string", async () => {
  const { default: OnboardingFlow } = await import("./OnboardingFlow");
  state = [1, "", "", [], "", [option], [option]];
  renderToStaticMarkup(OnboardingFlow());
  await actions.onSkip();
  assert.equal(mutate.mock.callCount(), 0);
  stateIndex = 0;
  renderToStaticMarkup(OnboardingFlow());
  await actions.onSkip();
  assert.equal(completed, true);
  assert.equal(currentUrl, "/app/billing?plan=annual");
  assert.equal(replace.mock.callCount(), 0);
  assert.equal(mutate.mock.callCount(), 1);
  assert.deepEqual(mutate.mock.calls[0].arguments[0], { variables: { data: { skip_questions: true } } });
});

test("skipping expectations preserves the discovery answer and the destination", async () => {
  const { default: OnboardingFlow } = await import("./OnboardingFlow");
  state[3] = [];
  renderToStaticMarkup(OnboardingFlow());
  await actions.onSkip();
  assert.equal(completed, true);
  assert.equal(currentUrl, "/app/billing?plan=annual");
  assert.deepEqual(mutate.mock.calls[0].arguments[0], { variables: { data: {
    heard_from_option_id: option.id, heard_from_custom: null,
    expectations_selected_ids: null, expectations_custom: null,
  } } });
});

test("cached onboarding completion never replaces the requested page", async () => {
  const { default: OnboardingFlow } = await import("./OnboardingFlow");
  completed = true;
  renderToStaticMarkup(OnboardingFlow());
  for (const effect of effects) effect();
  assert.equal(currentUrl, "/app/billing?plan=annual");
  assert.equal(replace.mock.callCount(), 0);
});

test("a failed submission keeps onboarding open on the intended route", async () => {
  const { default: OnboardingFlow } = await import("./OnboardingFlow");
  submissionError = new Error("Unable to save answers");
  renderToStaticMarkup(OnboardingFlow());
  await actions.onSubmit();
  assert.equal(completed, false);
  assert.equal(refetch.mock.callCount(), 0);
  assert.equal(currentUrl, "/app/billing?plan=annual");
  assert.equal(toastError.mock.calls[0].arguments[0], submissionError.message);
});
