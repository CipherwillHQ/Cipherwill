// Verifies mobile unsaved-edit guards and background-save delivery.
// Owns hook subscriptions with controlled events and native responses.
// Does not launch a browser or save real account content.
import assert from "node:assert/strict";
import { afterEach, before, mock, test } from "node:test";
import React from "react";
const effects: (() => (() => void) | void)[] = [];
mock.module("react", { defaultExport: React, namedExports: { ...React, useEffect: (effect: () => void) => effects.push(effect) } });
const messages: any[] = [];
mock.module("./deviceBridge.ts", { namedExports: { requestDevice: async (_type: string, payload: unknown) => { messages.push(payload); } } });
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
let useMobileUnsavedChanges: typeof import("./useMobileUnsavedChanges").useMobileUnsavedChanges;
let useMobileNoteBackgroundSave: typeof import("./useMobileNoteBackgroundSave").useMobileNoteBackgroundSave;
before(async () => {
  ({ useMobileUnsavedChanges } = await import("./useMobileUnsavedChanges"));
  ({ useMobileNoteBackgroundSave } = await import("./useMobileNoteBackgroundSave"));
});
afterEach(() => {
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
  if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument);
  else Reflect.deleteProperty(globalThis, "document");
  effects.length = 0;
  messages.length = 0;
});
test("declining the mobile leave warning cancels link navigation and reports dirty state", () => {
  let guard: any;
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    CipherwillAuth: {}, location: { href: "https://cipherwill.com/app/data/notes/1" }, confirm: () => false,
  } });
  Object.defineProperty(globalThis, "document", { configurable: true, value: {
    addEventListener: (_name: string, callback: any) => { guard = callback; }, removeEventListener() {},
  } });
  useMobileUnsavedChanges(true);
  const cleanup = effects[0]();
  const event = { target: { closest: () => ({ href: "https://cipherwill.com/app" }) },
    preventDefault: mock.fn(), stopPropagation: mock.fn(), defaultPrevented: false };
  guard(event);
  assert.equal(event.preventDefault.mock.callCount(), 1);
  assert.deepEqual(messages[0], { dirty: true });
  cleanup?.();
  assert.deepEqual(messages.at(-1), { dirty: false });
});
test("backgrounding the mobile app flushes the current pending note", () => {
  const target = Object.assign(new EventTarget(), { CipherwillAuth: {} });
  Object.defineProperty(globalThis, "window", { configurable: true, value: target });
  const save = mock.fn(async (_content: string) => {});
  useMobileNoteBackgroundSave("new content", "saved content", save);
  const cleanup = effects[0]();
  target.dispatchEvent(new Event("cipherwill:background"));
  assert.equal(save.mock.calls[0].arguments[0], "new content");
  cleanup?.();
  target.dispatchEvent(new Event("cipherwill:background"));
  assert.equal(save.mock.callCount(), 1);
});
test("ordinary browsers do not install native navigation subscriptions", () => {
  Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
  useMobileUnsavedChanges(true);
  assert.equal(effects[0](), undefined);
  assert.equal(messages.length, 0);
});
