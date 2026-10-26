// Verifies compact overview rendering, including loading and failed account states.
// Owns metric navigation links and setup controls without extra page chrome.
// Does not open a browser or run guided save commands.
import test, { beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import type { AccessDetails, GuidanceOverviewProps } from "@/types/interfaces";
import { buildGuidanceOverview } from "../core/accountOverview";
mock.module("./DataRecordsBreakdown.module.css", { defaultExport: { panel: "panel" } });
let shared: AccessDetails[] = [], granted: AccessDetails[] = [];
mock.module("../hooks/useGuidanceAccess.ts", { defaultExport: () => ({
  shared: { data: { getAllBeneficiaryAccess: shared }, loading: false },
  granted: { data: { getAllGrantedBeneficiaries: granted }, loading: false },
  onRevoke: async () => {}, revokingId: null, revokeError: null,
}) });
beforeEach(() => { shared = []; granted = []; });

const props: GuidanceOverviewProps = {
  overview: buildGuidanceOverview({ getUserScore: '{"base":300,"firstName":100}',
    me: { first_name: "asha <script>", email_verified: true },
    getMetamodelTypeCounts: [{ type: "NOTE", count: 3 }], getSmartWillBeneficiaries: [{ id: "person-1" }],
    getFactors: [{ id: "factor-1" }, { id: "factor-2" }],
    getAllKeyCount: [{ publicKey: "null", count: 0 }, { publicKey: "factor-1", count: 3 }, { publicKey: "factor-2", count: 3 }], }),
  loading: false, error: false, onRetry: () => {}, onStart: () => {},
  onVerifyEmail: () => {},
  setupLoading: false, setupAvailable: true, setupError: false,
  deferred: [], onResume: () => {},
};

test("opening slide links three metrics and opens data records through a menu button", async () => {
  const { default: Overview } = await import("./GuideOverview");
  const html = renderToStaticMarkup(<Overview {...props} />);
  assert.match(html, />400<\/span>/);
  assert.match(html, /\/ 950/);
  assert.match(html, /Score/);
  assert.match(html, /Data records/);
  assert.match(html, /Beneficiaries/);
  assert.match(html, /Security factors/);
  assert.match(html, /In sync/);
  for (const [href, label] of [["/app/score", "Score"],
    ["/app/beneficiaries", "Beneficiaries"], ["/app/factors", "Security factors"]]) {
    assert.match(html, new RegExp(`<a[^>]*href="${href}"[^>]*><span[^>]*>${label}</span>`));
  }
  assert.match(html, /<h1[^>]*>Your Cipherwill<\/h1>/);
  assert.doesNotMatch(html, /Data categor|Your Cipherwill overview|Storage used|2.0 KB|Profile details/);
  assert.equal((html.match(/<a /g) ?? []).length, 3);
  assert.match(html, /<button[^>]*aria-label="Data records \(3\)"[^>]*aria-controls="[^"]+"[^>]*aria-expanded="false"/);
  assert.doesNotMatch(html, /Data breakdown|See all segments/);
  assert.equal((html.match(/rounded-full/g) ?? []).length, 4);
  assert.match(html, /flex max-w-2xl flex-wrap justify-center gap-2/);
  assert.match(html, /text-3xl md:text-5xl font-semibold leading-tight/);
  assert.match(html, /items-center justify-center text-center/);
  assert.match(html, /Continue Cipherwill Setup/);
  assert.match(html, /Asha &lt;script&gt;/);
  assert.doesNotMatch(html, /<script>|<header|<footer|rounded-2xl|rounded-3xl|text-2xl|grid-cols|Go at your own pace/);
});

test("available access controls come before the regular status metrics", async () => {
  const { default: Overview } = await import("./GuideOverview");
  const access: AccessDetails = { id: "access-1", user: "person-1", beneficiary_id: "relation-1",
    created_at: "1", expire_at: String(Date.UTC(2099, 0, 1)) };
  for (const permissions of [[[access], [access]], [[access], []], [[], [access]]]) {
    [shared, granted] = permissions;
    const html = renderToStaticMarkup(<Overview {...props} />);
    const nav = html.match(/<nav[^>]*aria-label="Account status"[^>]*>[\s\S]*?<\/nav>/)?.[0];
    assert.ok(nav);
    for (const label of [shared.length ? "Shared wills" : "", granted.length ? "Granted access" : ""].filter(Boolean)) {
      assert.ok(nav.indexOf(label) < nav.indexOf("Score"));
    }
    if (shared.length && granted.length) assert.ok(nav.indexOf("Shared wills") < nav.indexOf("Granted access"));
    assert.match(nav, /Score[\s\S]*Data records[\s\S]*Beneficiaries[\s\S]*Security factors/);
  }
});

test("factor sync status remains a link to the existing factors page in both states", async () => {
  const { default: Overview } = await import("./GuideOverview");
  for (const factorsInSync of [true, false]) {
    const html = renderToStaticMarkup(<Overview {...props} overview={{ ...props.overview!, factorsInSync }} />);
    const factorLink = html.match(/<a[^>]*href="\/app\/factors"[^>]*>[\s\S]*?<\/a>/)?.[0];
    assert.ok(factorLink);
    assert.match(factorLink, /Security factors/);
    assert.match(factorLink, factorsInSync ? /In sync/ : /Needs sync/);
    assert.doesNotMatch(factorLink, /<button|aria-expanded|aria-haspopup/);
  }
});

test("zero security factors keep the count and link without a sync status", async () => {
  const { default: Overview } = await import("./GuideOverview");
  for (const factorsInSync of [true, false]) {
    const html = renderToStaticMarkup(<Overview {...props} overview={{ ...props.overview!, factorCount: 0, factorsInSync }} />);
    const factorLink = html.match(/<a[^>]*href="\/app\/factors"[^>]*>[\s\S]*?<\/a>/)?.[0];
    assert.ok(factorLink);
    assert.match(factorLink, /Security factors[\s\S]*>0<\/span>/);
    assert.doesNotMatch(factorLink, /In sync|Needs sync|<svg/);
  }
});

test("unverified accounts show a verification banner above independent setup controls", async () => {
  const { default: Overview } = await import("./GuideOverview");
  for (const setupLoading of [false, true]) {
    const html = renderToStaticMarkup(<Overview {...props} overview={{ ...props.overview!, emailVerified: false }}
      setupLoading={setupLoading} setupAvailable setupError={false} />);
    assert.match(html, />Verify your email<\/span>/);
    assert.match(html, /<aside aria-label="Account notices"[\s\S]*Email verification needed[\s\S]*<\/aside>[\s\S]*(Continue Cipherwill Setup|Preparing setup)/);
    assert.match(html, setupLoading ? /disabled=""[^>]*>Preparing setup/ : /Continue Cipherwill Setup/);
    assert.doesNotMatch(html, /Continue to retry/);
    assert.match(html, /Data records/);
  }
});

test("verified accounts collapse the banner area while retaining setup", async () => {
  const { default: Overview } = await import("./GuideOverview");
  const html = renderToStaticMarkup(<Overview {...props} />);
  assert.doesNotMatch(html, /Account notices|Email verification needed|Verify your email/);
  assert.match(html, /Continue Cipherwill Setup/);
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
