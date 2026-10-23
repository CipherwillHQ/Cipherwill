// Verifies Skip is only offered beside Start in an objective introduction.
// Owns introductory, busy, active-question, and completion presentation checks.
// Does not open a browser or send objective choices to an API.
import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import type { GuidancePanelProps, GuidancePanelState } from "@/types/interfaces";
import GuidePanelBody from "./GuidePanelBody";
import { buildLocalStep } from "../core/stepResult";
import { createFlowState } from "../core/flowRules";
import { firstAssetFixture } from "../core/fixtures/firstAsset";

const current = buildLocalStep(firstAssetFixture(0), createFlowState(), {
  account: { firstName: null, lastName: null, birthDate: null, beneficiaryCount: 0 },
  answers: {}, effects: {}, context: {}, completion: null,
});
const props: GuidancePanelProps = { current, started: false, loading: false, error: null, postActionStatus: null,
  onClose: () => {}, onRetry: () => {}, onContinue: () => {}, onStart: () => {}, onDefer: () => {}, onSubmit: () => {} };
const state: GuidancePanelState = { current, viewState: "intro", contentStateKey: "intro", inputValue: "",
  setInputValue: () => {}, onStart: () => {}, submitWithCurrentValue: () => {}, skipCurrentStep: () => {},
  canSubmit: false, countdownSeconds: 0, loadingPhrase: "Loading", isTimedDisplayStep: false };

test("objective introduction offers adjacent Start and Skip buttons; busy operations disable both", () => {
  const html = renderToStaticMarkup(<GuidePanelBody props={props} state={state} />);
  assert.match(html, /<div class="pt-1 flex justify-center gap-3"><button[^>]*>Start<\/button><button[^>]*>Skip<\/button><\/div>/);
  assert.doesNotMatch(html, /suggest this again|More options|Do this later/);
  const busy = renderToStaticMarkup(<GuidePanelBody props={{ ...props, loading: true }} state={state} />);
  assert.equal((busy.match(/disabled=""/g) ?? []).length, 2);
});

test("active questions, optional fields, and completion displays never offer objective Skip", () => {
  const optional = { ...current, result: { ...current.result, input: { ...current.result.input!, skippable: true } } };
  const html = renderToStaticMarkup(<GuidePanelBody props={{ ...props, current: optional, started: true }}
    state={{ ...state, current: optional, viewState: "step" }} />);
  assert.doesNotMatch(html, />Skip<|>Start<|suggest this again/);
  assert.match(html, /Leave blank/);
  const completed = { ...current, result: { ...current.result, action: "complete" as const, input: null } };
  const done = renderToStaticMarkup(<GuidePanelBody props={{ ...props, current: completed }}
    state={{ ...state, current: completed, viewState: "timed" }} />);
  assert.doesNotMatch(done, />Skip<|>Start<|suggest this again/);
});
