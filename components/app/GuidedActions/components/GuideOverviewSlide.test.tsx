// Exercises verification transitions from the actual overview controller.
// Owns retry, busy-action and return-to-setup regression coverage.
// Does not open a browser or send email to real accounts.
import test, { beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { pathToFileURL } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import type { GuidanceOverviewProps, EmailVerificationProps } from "@/types/interfaces";

let slots: unknown[] = [], slotIndex = 0;
let overviewProps: GuidanceOverviewProps, verificationProps: EmailVerificationProps;
let sent = false, verified = false;
let failure: Error | null = null;
let delivery: Promise<void> | null = null;
const sends = mock.fn(async () => { if (failure) throw failure; await delivery; sent = true; });
const checks = mock.fn(async () => { if (failure) throw failure; return verified; });
const refresh = mock.fn(() => {});
const starts = mock.fn(() => {});

mock.module("react", { defaultExport: React, namedExports: { ...React,
  useCallback: (callback: unknown) => callback,
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
mock.module(pathToFileURL(require.resolve("@apollo/client/react")), { namedExports: { useApolloClient: () => ({}) } });
mock.module(pathToFileURL(require.resolve("framer-motion")), { namedExports: {
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: { div: ({ children }: { children: React.ReactNode }) => <div>{children}</div> },
} });
mock.module("../../../../contexts/AuthContext/index.tsx", { namedExports: { useAuth: () => ({ user: {} }) } });
mock.module("../../../../common/auth/emailVerification.ts", { namedExports: { sendVerificationEmail: sends, checkEmailVerification: checks } });
mock.module("../hooks/useGuidanceOverview.ts", { defaultExport: () => ({ loading: false, error: false, onRetry: refresh,
  overview: { firstName: "Asha", emailVerified: verified, score: 300, itemCount: 0, typeCounts: [], beneficiaryCount: 0, factorCount: 0, factorsInSync: false } }) });
mock.module("./GuideOverview.tsx", { defaultExport: (props: GuidanceOverviewProps) => {
  overviewProps = props; return <section>Continue Cipherwill Setup{!props.overview?.emailVerified && "Verify your email"}</section>;
} });
mock.module("./EmailVerificationSlide.tsx", { defaultExport: (props: EmailVerificationProps) => {
  verificationProps = props; return <section>{props.sent ? "I've verified it" : "Send verification email"}</section>;
} });

beforeEach(() => {
  slots = []; slotIndex = 0; sent = false; verified = false; failure = null; delivery = null;
  sends.mock.resetCalls(); checks.mock.resetCalls(); refresh.mock.resetCalls();
  starts.mock.resetCalls();
});

async function renderSlide() {
  const { default: Slide } = await import("./GuideOverviewSlide");
  slotIndex = 0;
  return renderToStaticMarkup(<Slide onStart={starts} setupLoading={false} setupAvailable setupError={false}
    deferred={[]} onResume={() => {}} />);
}

test("verification sends, checks actual status, and refreshes the overview before setup", async () => {
  assert.match(await renderSlide(), /Verify your email/);
  overviewProps.onVerifyEmail();
  assert.match(await renderSlide(), /Send verification email/);
  await verificationProps.onSend();
  assert.equal(sent, true);
  assert.match(await renderSlide(), /I&#x27;ve verified it/);
  await verificationProps.onCheck(); await renderSlide();
  assert.match(verificationProps.error!, /isn't verified yet/);
  assert.equal(refresh.mock.callCount(), 0);
  verified = true;
  await verificationProps.onCheck();
  assert.match(await renderSlide(), /Continue Cipherwill Setup/);
  assert.equal(refresh.mock.callCount(), 1);
});

test("Continue Setup starts objectives independently of the verification banner", async () => {
  await renderSlide();
  overviewProps.onStart();
  assert.equal(starts.mock.callCount(), 1);
  assert.match(await renderSlide(), /Continue Cipherwill Setup/);
  assert.doesNotMatch(await renderSlide(), /Send verification email/);
  overviewProps.onVerifyEmail();
  assert.match(await renderSlide(), /Send verification email/);
  assert.equal(starts.mock.callCount(), 1);
});

test("failed delivery stays on the send slide and permits retry", async () => {
  await renderSlide(); overviewProps.onVerifyEmail(); await renderSlide();
  failure = new Error("Email delivery unavailable");
  await verificationProps.onSend();
  assert.match(await renderSlide(), /Send verification email/);
  assert.equal(verificationProps.busy, false);
  assert.match(verificationProps.error!, /delivery unavailable/);
  failure = null;
  await verificationProps.onSend();
  assert.match(await renderSlide(), /I&#x27;ve verified it/);
});

test("pending delivery cannot send twice, and pausing preserves the confirmation slide", async () => {
  await renderSlide(); overviewProps.onVerifyEmail(); await renderSlide();
  let accept!: () => void;
  delivery = new Promise(resolve => { accept = resolve; });
  const sending = verificationProps.onSend();
  await renderSlide();
  assert.equal(verificationProps.busy, true);
  await verificationProps.onSend();
  assert.equal(sends.mock.callCount(), 1);
  accept(); await sending; await renderSlide();
  verificationProps.onClose(); await renderSlide();
  overviewProps.onVerifyEmail();
  assert.match(await renderSlide(), /I&#x27;ve verified it/);
});

test("failed status checks keep confirmation retryable", async () => {
  await renderSlide(); overviewProps.onVerifyEmail(); await renderSlide();
  await verificationProps.onSend(); await renderSlide();
  failure = new Error("Offline");
  await verificationProps.onCheck(); await renderSlide();
  assert.equal(verificationProps.busy, false);
  assert.equal(verificationProps.error, "Offline");
  assert.equal(refresh.mock.callCount(), 0);
});
