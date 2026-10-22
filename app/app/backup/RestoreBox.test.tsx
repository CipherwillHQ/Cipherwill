// Tests restore retries and file selection after completion.
// Owns component state and rendered controls with mocked services.
// Does not open a browser or restore account data.

import assert from "node:assert/strict";
import { mock, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const state: any[] = [new File(["old"], "backup.zip"), "Not started", false];
let stateIndex = 0;
mock.module("react", { defaultExport: React, namedExports: { ...React,
  useState: () => { const index = stateIndex++; return [state[index], (value: unknown) => { state[index] = value; }]; },
} });
mock.module("@apollo/client/react", { namedExports: { useApolloClient: () => ({}) } });
mock.module("../../../contexts/SessionContext/index.tsx", { namedExports: { useSession: () => ({ session: null }) } });
const restore = mock.fn(async (_input: any) => {});
mock.module("./restore_backup.ts", { defaultExport: restore });
mock.module("../../../components/common/SimpleButton.tsx", { defaultExport: (props: any) => <button {...props} /> });

for (const status of ["Error while restoring backup", "Backup restored"]) {
  test(`another backup can start after ${status}`, async () => {
    const { default: RestoreBox } = await import("./RestoreBox");
    state[1] = status;
    state[2] = false;
    stateIndex = 0;
    let view = RestoreBox();
    const fileInput = React.Children.toArray(view.props.children).find((child: any) => child.type === "input") as React.ReactElement<any>;
    await fileInput.props.onChange({ target: { files: [new File(["new"], "next.zip")] } });
    stateIndex = 0;
    view = RestoreBox();
    assert.match(renderToStaticMarkup(view), /Start restore/);
  });
}

test("file selection is disabled while a restore is running", async () => {
  const { default: RestoreBox } = await import("./RestoreBox");
  state[1] = "Reading backup file";
  state[2] = true;
  stateIndex = 0;
  assert.match(renderToStaticMarkup(RestoreBox()), /<input[^>]*disabled/);
});

test("a failed restore can retry the same selected ZIP directly", async () => {
  const { default: RestoreBox } = await import("./RestoreBox");
  const selectedFile = new File(["same backup"], "backup.zip");
  state[0] = selectedFile;
  state[1] = "Error while restoring backup";
  state[2] = false;
  stateIndex = 0;
  restore.mock.resetCalls();
  const view = RestoreBox();
  const button = React.Children.toArray(view.props.children).find((child: any) => child.props?.children === "Retry restore") as React.ReactElement<any>;
  assert.ok(button, "Retry should be available without a file-change event");
  await button.props.onClick();
  assert.equal(restore.mock.calls[0].arguments[0].backupFile, selectedFile);
  assert.equal(state[2], false);
});
