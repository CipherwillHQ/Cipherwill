// Checks the footer only offers the whole-guide pause control.
// Owns busy-state presentation without objective skip or dismissal controls.
// Does not open a browser or persist choice records.
import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import GuideExitControls from "./GuideExitControls";

test("footer keeps pause available with no objective skip or permanent dismissal", () => {
  const props = { loading: false, onClose: () => {} };
  const html = renderToStaticMarkup(<GuideExitControls {...props} />);
  assert.match(html, /do this later/);
  assert.doesNotMatch(html, /Skip|Do this later|suggest this again|More options/);
  assert.doesNotMatch(html, /disabled=""/);
  const busy = renderToStaticMarkup(<GuideExitControls {...props} loading />);
  assert.equal((busy.match(/disabled=""/g) ?? []).length, 1);
});
