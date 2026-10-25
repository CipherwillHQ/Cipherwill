// Verifies native file-transfer bytes, cancellation and browser fallback.
// Owns the real web bridge contract without browser or native UI automation.
// Does not contact Firebase or use vault credentials.
import assert from "node:assert/strict";
import { afterEach, test, mock } from "node:test";
import crypto from "node:crypto";
import { saveFile } from "./saveFile";
import { saveDecryptedFile } from "@/common/data/saveDecryptedFile";
import { copyText } from "./copyText";
import type { MobileDeviceWindow } from "@/types/interfaces";

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
afterEach(() => {
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
  if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument);
  else Reflect.deleteProperty(globalThis, "document");
  mock.restoreAll();
});

function installBridge(complete = true, failChunk = false) {
  const messages: Record<string, any>[] = [];
  const target = { CipherwillAuth: { postMessage() {} }, CipherwillDevice: { postMessage(text: string) {
    const request = JSON.parse(text);
    messages.push(request);
    target.CipherwillDeviceResponse?.(request.id, {
      value: request.type === "download-finish" ? complete : null,
      error: failChunk && request.type === "download-chunk" ? "Disk unavailable" : null,
    });
  } } } as unknown as MobileDeviceWindow;
  Object.defineProperty(globalThis, "window", { configurable: true, value: target });
  return messages;
}

test("native downloads transmit complete binary data in bounded acknowledged chunks", async () => {
  const messages = installBridge();
  const bytes = Uint8Array.from({ length: 150000 }, (_, index) => index % 256);
  assert.equal(await saveFile(new Blob([bytes]), "document.bin"), true);
  assert.equal(messages[0].name, "document.bin");
  assert.equal(messages[0].size, bytes.length);
  const chunks = messages.filter((request) => request.type === "download-chunk");
  assert.ok(chunks.every((request) => request.data.length <= 65536));
  assert.deepEqual(Buffer.concat(chunks.map((request) => Buffer.from(request.data, "base64"))), Buffer.from(bytes));
  assert.equal(messages.at(-1)?.type, "download-finish");
});

test("cancellation returns false and transfer failures abort native temporary files", async () => {
  installBridge(false);
  assert.equal(await saveFile(new Blob(["data"]), "document.txt"), false);
  const messages = installBridge(true, true);
  await assert.rejects(saveFile(new Blob(["data"]), "document.txt"), /Disk unavailable/);
  assert.equal(messages.at(-1)?.type, "download-cancel");
});

test("existing encrypted files decrypt before export and never send keys to native", async () => {
  const messages = installBridge();
  const secret = "0123456789abcdef0123456789abcdef0123456789abcdef";
  const plaintext = Buffer.from("original encrypted file contents\u0000\u00ff");
  const cipher = crypto.createCipheriv("aes-256-cbc", secret.slice(16), secret.slice(0, 16));
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  await saveDecryptedFile(encrypted.toString("base64"), secret, { title: "document", type: "text/plain", file_ext: "txt" });
  assert.equal(messages[0].name, "document.txt");
  assert.deepEqual(Buffer.from(messages[1].data, "base64"), plaintext);
  assert.ok(!JSON.stringify(messages).includes(secret));
});

test("ordinary browser downloads keep the anchor download behavior", async () => {
  Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
  const click = mock.fn();
  const remove = mock.fn();
  const link = { click, remove, href: "", download: "" };
  Object.defineProperty(globalThis, "document", { configurable: true, value: {
    createElement: () => link, body: { appendChild: mock.fn() },
  } });
  mock.method(URL, "createObjectURL", () => "blob:download-test");
  const revoke = mock.method(URL, "revokeObjectURL", () => {});
  assert.equal(await saveFile(new Blob(["data"]), "document.txt"), true);
  assert.equal(link.download, "document.txt");
  assert.equal(click.mock.callCount(), 1);
  assert.equal(remove.mock.callCount(), 1);
  assert.equal(revoke.mock.callCount(), 1);
});

test("native clipboard requests complete through the device bridge", async () => {
  const messages = installBridge();
  await copyText("copy this text");
  assert.equal(messages[0].type, "clipboard");
  assert.equal(messages[0].text, "copy this text");
});
