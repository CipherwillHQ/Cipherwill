// Verifies YouTube URL parsing into embeddable iframe URLs.
// Owns unit assertions for standard watch, short, shorts, embed, and invalid URLs.
// Does not render React components or make network requests.
import assert from "node:assert/strict";
import { test } from "node:test";
import getYoutubeEmbedUrl from "./getYoutubeEmbedUrl";

test("converts standard YouTube URLs to autoplay embed URLs", () => {
  assert.equal(
    getYoutubeEmbedUrl("https://www.youtube.com/watch?v=Fv0UYRvb6U0"),
    "https://www.youtube.com/embed/Fv0UYRvb6U0?autoplay=1&rel=0",
  );
  assert.equal(
    getYoutubeEmbedUrl("https://youtu.be/Fv0UYRvb6U0"),
    "https://www.youtube.com/embed/Fv0UYRvb6U0?autoplay=1&rel=0",
  );
  assert.equal(
    getYoutubeEmbedUrl("https://www.youtube.com/shorts/Fv0UYRvb6U0"),
    "https://www.youtube.com/embed/Fv0UYRvb6U0?autoplay=1&rel=0",
  );
  assert.equal(
    getYoutubeEmbedUrl("https://www.youtube.com/embed/Fv0UYRvb6U0"),
    "https://www.youtube.com/embed/Fv0UYRvb6U0?autoplay=1&rel=0",
  );
});

test("returns null for non-YouTube or malformed URLs", () => {
  assert.equal(getYoutubeEmbedUrl("https://example.com/watch?v=Fv0UYRvb6U0"), null);
  assert.equal(getYoutubeEmbedUrl("https://www.youtube.com/watch"), null);
  assert.equal(getYoutubeEmbedUrl("not-a-url"), null);
});
