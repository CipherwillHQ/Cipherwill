// Exercises the record pill's inline expansion without leaving the overview.
// Owns size, dismissal, count labels, empty-state and segments-link checks.
// Does not open a browser or read real account records.
import test, { beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { pathToFileURL } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import type { OverviewExpandedMetric } from "@/types/interfaces";

let expanded: OverviewExpandedMetric = null;
mock.module("react", { defaultExport: React, namedExports: { ...React,
  useEffect: () => {}, useCallback: (callback: unknown) => callback,
  useRef: () => ({ current: null }), useId: () => "record-breakdown",
} });
mock.module(pathToFileURL(require.resolve("framer-motion")), { namedExports: {
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: { div: ({ children, layout, initial, animate, exit, transition, ...props }: Record<string, unknown>) =>
    <div {...props}>{children as React.ReactNode}</div>,
    button: ({ children, layout, ...props }: Record<string, unknown>) => <button {...props}>{children as React.ReactNode}</button>,
  },
} });
mock.module("./DataRecordsBreakdown.module.css", { defaultExport: { panel: "panel" } });
beforeEach(() => { expanded = null; });
const props = { count: 5, typeCounts: [{ type: "NOTE", count: 2 }, { type: "PASSWORD", count: 3 }, { type: "FILE", count: 0 }] };
async function renderMetric() {
  const { default: Metric } = await import("./DataRecordsMetric");
  const { default: Expandable } = await import("./ExpandableOverviewMetric");
  return Expandable(Metric({ ...props, expanded, onExpand: metric => { expanded = metric; } }).props);
}

test("click expands the pill inline and clicking it again collapses it", async () => {
  const initial = await renderMetric();
  assert.doesNotMatch(renderToStaticMarkup(initial), /Data breakdown|See all segments/);
  initial.props.children[1].props.onClick();
  const opened = await renderMetric();
  assert.equal(opened.props.layout, true);
  assert.equal(opened.props.style.width, 256);
  assert.match(renderToStaticMarkup(opened), /data-expanded="true"[\s\S]*Data breakdown/);
  assert.match(renderToStaticMarkup(opened), /aria-controls="record-breakdown" aria-expanded="true"/);
  assert.doesNotMatch(renderToStaticMarkup(opened), /role="dialog"|position:fixed|visibility:hidden/);
  opened.props.children[1].props.onClick();
  assert.doesNotMatch(renderToStaticMarkup(await renderMetric()), /Data breakdown/);
});

test("opening another overview pill collapses the record breakdown", async () => {
  const record = await renderMetric();
  record.props.children[1].props.onClick();
  assert.match(renderToStaticMarkup(await renderMetric()), /Data breakdown/);
  const { default: Expandable } = await import("./ExpandableOverviewMetric");
  const shared = Expandable({ metric: "shared", label: "Shared wills", count: 1, width: 320,
    expanded, onExpand: metric => { expanded = metric; }, children: <p>Shared will details</p> });
  shared.props.children[1].props.onClick();
  assert.equal(expanded, "shared");
  assert.doesNotMatch(renderToStaticMarkup(await renderMetric()), /Data breakdown/);
});

test("breakdown preserves counts, omits empty types, and links to all segments", async () => {
  const { default: Breakdown } = await import("./DataRecordsBreakdown");
  const closed = mock.fn();
  const tree = Breakdown({ ...props, onClose: closed });
  const html = renderToStaticMarkup(tree);
  assert.doesNotMatch(html, /<h2|saved records/);
  assert.match(html, />Notes<\/dt>[\s\S]*>2<\/dd>/);
  assert.match(html, />Passwords<\/dt>[\s\S]*>3<\/dd>/);
  assert.doesNotMatch(html, /File Storage/);
  assert.match(html, /cw-private-guidance ph-no-capture sentry-block/);
  assert.match(html, /overflow-y-auto overscroll-contain/);
  const link = tree.props.children[1];
  assert.equal(link.props.href, "/app/segments");
  link.props.onClick();
  assert.equal(closed.mock.callCount(), 1);
});

test("empty accounts and unregistered types remain readable", async () => {
  const { default: Breakdown } = await import("./DataRecordsBreakdown");
  assert.match(renderToStaticMarkup(Breakdown({ count: 0, typeCounts: [], onClose: () => {} })), /No data records yet/);
  assert.match(renderToStaticMarkup(Breakdown({ count: 1, typeCounts: [{ type: "CUSTOM_TYPE", count: 1 }], onClose: () => {} })), /CUSTOM TYPE/);
});

test("the three-row viewport retains all types for scrolling", async () => {
  const { default: Breakdown } = await import("./DataRecordsBreakdown");
  const typeCounts = Array.from({ length: 6 }, (_, index) => ({ type: `TYPE_${index}`, count: 1 }));
  const tree = Breakdown({ count: 6, typeCounts, onClose: () => {} });
  const html = renderToStaticMarkup(tree);
  assert.equal((html.match(/<dt /g) ?? []).length, 6);
  assert.match(html, /aria-label="Records by type" tabindex="0"/);
  assert.match(html, /max-h-24[^"]*overflow-y-auto/);
  assert.match(html, /TYPE 5/);
  assert.match(html, /See all segments/);
});
