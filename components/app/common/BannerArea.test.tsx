// Verifies the shared banner area supports multiple independent notices.
// Owns banner order and empty-area regression coverage.
// Does not choose production banners or execute account actions.
import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import BannerArea from "./BannerArea";

test("multiple banners retain their order and the empty area collapses", () => {
  const html = renderToStaticMarkup(<BannerArea>
    <section>First notice</section>
    <section>Second notice</section>
  </BannerArea>);
  assert.match(html, /aria-label="Account notices"/);
  assert.match(html, /First notice[\s\S]*Second notice/);
  assert.equal(renderToStaticMarkup(<BannerArea>{false}{null}</BannerArea>), "");
});
