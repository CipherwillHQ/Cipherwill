// Verifies compact overview rendering, including loading and failed account states.
// Owns metric navigation links and setup controls without extra page chrome.
// Does not open a browser or run guided save commands.
import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import type { GuidanceOverviewProps } from "@/types/interfaces";
import { buildGuidanceOverview } from "../core/accountOverview";

const props: GuidanceOverviewProps = {
  overview: buildGuidanceOverview({ getUserScore: '{"base":300,"firstName":100}',
    me: { first_name: "Asha <script>"},
    getMetamodelTypeCounts: [{ type: "NOTE", count: 3 }], getSmartWillBeneficiaries: [{ id: "person-1" }],
    getFactors: [{ id: "factor-1" }, { id: "factor-2" }], }),
  loading: false, error: false, onRetry: () => {}, onStart: () => {},
  setupLoading: false, setupAvailable: true, setupError: false,
  deferred: [], onResume: () => {},
};

test("opening slide links four metric pills to their pages and omits data categories", async () => {
  const { default: Overview } = await import("./GuideOverview");
  const html = renderToStaticMarkup(<Overview {...props} />);
  assert.match(html, />400<\/span>/);
  assert.match(html, /\/ 950/);
  assert.match(html, /Score/);
  assert.match(html, /Data records/);
  assert.match(html, /Beneficiaries/);
  assert.match(html, /Security factors/);
  for (const [href, label] of [["/app/score", "Score"], ["/app/segments", "Data records"],
    ["/app/beneficiaries", "Beneficiaries"], ["/app/factors", "Security factors"]]) {
    assert.match(html, new RegExp(`<a[^>]*href="${href}"[^>]*><span[^>]*>${label}</span>`));
  }
  assert.match(html, /Your Cipherwill Status/);
  assert.doesNotMatch(html, /Data categor|Your Cipherwill overview|Storage used|2.0 KB|Profile details/);
  assert.equal((html.match(/<a /g) ?? []).length, 4);
  assert.equal((html.match(/rounded-full/g) ?? []).length, 4);
  assert.match(html, /flex max-w-2xl flex-wrap justify-center gap-2/);
  assert.match(html, /text-3xl md:text-5xl font-semibold leading-tight/);
  assert.match(html, /items-center justify-center text-center/);
  assert.match(html, /Continue Cipherwill Setup/);
  assert.match(html, /Asha &lt;script&gt;/);
  assert.doesNotMatch(html, /<script>|<svg|<header|<footer|rounded-2xl|rounded-3xl|text-2xl|grid-cols|Go at your own pace/);
});

test("paused objectives remain resumable when no other setup steps are available", async () => {
  const { default: Overview } = await import("./GuideOverview");
  const html = renderToStaticMarkup(<Overview {...props} setupAvailable={false}
    deferred={[{ objectiveId: "enable_bank", title: "Bank accounts", resumeAfter: "1900000000000" }]} />);
  assert.match(html, /Do later \(1\)/);
  assert.match(html, /aria-haspopup="dialog" aria-expanded="false"/);
  assert.match(html, /<nav[^>]*>[\s\S]*Do later[\s\S]*<\/nav>/);
  assert.doesNotMatch(html, /<details|Resume Bank accounts/);
  assert.match(html, /You have tasks in Do later\. Resume them whenever you/);
  assert.doesNotMatch(html, /No other steps are ready|up to date|Continue Cipherwill Setup/);
});

test("loading and errors stay explicit while completed setup stays minimal", async () => {
  const { default: Overview } = await import("./GuideOverview");
  const loading = renderToStaticMarkup(<Overview {...props} loading overview={null} />);
  assert.match(loading, /role="status"/);
  assert.doesNotMatch(loading, /Data records/);
  const failed = renderToStaticMarkup(<Overview {...props} error overview={null} />);
  assert.match(failed, /couldn&#x27;t load your account overview|couldn&#39;t load your account overview/);
  assert.match(failed, />Retry<\/button>/);
  const done = renderToStaticMarkup(<Overview {...props} setupAvailable={false} />);
  assert.doesNotMatch(done, /Continue Cipherwill Setup|up to date|role="status"|<footer/);
  const setupFailed = renderToStaticMarkup(<Overview {...props} setupError setupAvailable={false} />);
  assert.match(setupFailed, /Continue to retry/);
  assert.doesNotMatch(setupFailed, /disabled=""|<footer/);
});
