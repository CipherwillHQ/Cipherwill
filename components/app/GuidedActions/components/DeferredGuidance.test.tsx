// Verifies the Do later pill opens a scrollable popup and preserves resume actions.
// Owns local visibility, long-list rendering, and busy-state regressions.
// Does not open a browser or persist objective choices.
import test, { beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { DeferredGuidanceItem } from "@/types/interfaces";

let open = false;
mock.module("react", { defaultExport: React, namedExports: { ...React,
  useState: () => [open, (value: boolean) => { open = value; }],
} });
mock.module("reactjs-popup", { defaultExport: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
  open ? <div role="dialog">{children}</div> : null });
beforeEach(() => { open = false; });
const deferred: DeferredGuidanceItem[] = Array.from({ length: 100 }, (_, i) => ({
  objectiveId: `objective_${i}`, title: `Deferred objective ${i}`, resumeAfter: "1900000000000",
}));

test("Do later pill opens the list and closing restores its collapsed state", async () => {
  const { default: Deferred } = await import("./DeferredGuidance");
  const props = { deferred, onResume: () => {}, loading: false };
  const initial = Deferred(props)!;
  assert.match(renderToStaticMarkup(initial), /aria-label="Do later \(100\)"/);
  assert.doesNotMatch(renderToStaticMarkup(initial), /role="dialog"|Deferred objective 0/);
  const button = initial.props.children[0];
  button.props.onClick();
  const opened = Deferred(props)!;
  assert.match(renderToStaticMarkup(opened), /aria-expanded="true"/);
  assert.match(renderToStaticMarkup(opened), /role="dialog"/);
  opened.props.children[1].props.onClose();
  assert.doesNotMatch(renderToStaticMarkup(Deferred(props)), /role="dialog"/);
  assert.equal(Deferred({ ...props, deferred: [] }), null);
});

test("popup renders a bounded 100-item list and Resume targets the selected objective", async () => {
  const { default: List } = await import("./DeferredGuidancePopup");
  const resumed: string[] = [];
  const tree = List({ open: true, loading: false, deferred, onClose: () => {}, onResume: id => { resumed.push(id); } });
  assert.equal(tree.props.modal, true);
  assert.equal(tree.props.closeOnEscape, true);
  assert.equal(tree.props.closeOnDocumentClick, true);
  assert.equal(tree.props.lockScroll, true);
  const html = renderToStaticMarkup(tree);
  assert.match(html, /max-h-\[80dvh\]/);
  assert.match(html, /min-h-0[^"]*overflow-y-auto overscroll-contain/);
  assert.match(html, /90 days/);
  assert.match(html, /cw-private-guidance ph-no-capture sentry-block/);
  assert.equal((html.match(/<li /g) ?? []).length, 100);
  const rows = tree.props.children.props.children[2].props.children;
  rows[42].props.children[1].props.onClick();
  assert.deepEqual(resumed, ["objective_42"]);
  const busy = renderToStaticMarkup(List({ open: true, loading: true, deferred, onClose: () => {}, onResume: () => {} }));
  assert.equal((busy.match(/disabled=""/g) ?? []).length, 100);
});
