// Checks navigation throughout the executor workspace.
// Owns overview availability, category destinations, and nested active states.
// Does not open a browser or fetch donor information.

import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

let pathname = "/executor";
mock.module("next/navigation", { namedExports: { usePathname: () => pathname } });
mock.module("../../app/Sidebar/SidebarLogo.tsx", { defaultExport: () => null });
mock.module("../../app/Sidebar/SwitchThemeButton.tsx", { defaultExport: () => null });
mock.module("../../public/logo/SymbolicLogo.tsx", { defaultExport: () => null });
mock.module("./DonorName.tsx", { defaultExport: () => "Asha Patel" });

test("shared wills remains available on the dashboard landing page", async () => {
  const { default: ExecutorSidebar } = await import("./index");
  pathname = "/executor";
  const markup = renderToStaticMarkup(<ExecutorSidebar />);
  assert.match(markup, /<a(?=[^>]*href="\/executor")(?=[^>]*aria-current="page")[^>]*>/);
  assert.match(markup, /href="\/app"/);
  assert.doesNotMatch(markup, /undefined/);
});

test("individual will overview has an active navigation item", async () => {
  const { default: ExecutorSidebar } = await import("./index");
  pathname = "/executor/will";
  const markup = renderToStaticMarkup(<ExecutorSidebar />);
  assert.match(markup, /<a(?=[^>]*href="\/executor\/will")(?=[^>]*aria-current="page")[^>]*>/);
  assert.match(markup, /Asha Patel/);
  for (const slug of ["notes", "email-accounts", "device-locks", "passwords", "seed-phrases", "defi-staking", "bank-accounts", "payment-cards", "storage"]) {
    assert.match(markup, new RegExp('href="/executor/will/' + slug + '"'));
  }
  assert.doesNotMatch(markup, /\/undefined/);
});

test("nested detail and storage pages keep their category active", async () => {
  const { default: ExecutorSidebar } = await import("./index");
  for (const route of ["passwords/item", "notes/item", "storage/folder/family", "storage/object/file"]) {
    pathname = "/executor/will/" + route;
    const markup = renderToStaticMarkup(<ExecutorSidebar />);
    const category = route.split("/")[0];
    assert.match(markup, new RegExp('<a(?=[^>]*href="/executor/will/' + category + '")(?=[^>]*aria-current="page")[^>]*>'));
    assert.equal(Array.from(markup.matchAll(/aria-current="page"/g)).length, 1);
  }
});
