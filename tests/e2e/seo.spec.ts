// Checks the canonical URLs delivered in server-rendered public pages.
// Owns coverage for route inheritance, article URLs, and blog pagination.
// Does not change published content or configure the blog storage host.
import { expect, test } from "@playwright/test";

const siteUrl = "https://www.cipherwill.com";

test.use({ userAgent: "Googlebot" });

for (const path of ["/", "/pricing", "/dead-mans-switch", "/blog", "/i/editorial-team"]) {
  test(`canonical for ${path} excludes tracking parameters`, async ({ request }) => {
    const response = await request.get(`${path}?utm_source=canonical-test`);
    expect(response.ok()).toBeTruthy();

    const html = await response.text();
    const canonical = path === "/" ? siteUrl : `${siteUrl}${path}`;
    expect(html.match(/<link rel="canonical"[^>]*>/g)).toEqual([
      `<link rel="canonical" href="${canonical}"/>`,
    ]);
  });
}

test("blog pagination keeps its cursor in the canonical URL", async ({ request }) => {
  const listing = await request.get("/blog");
  expect(listing.ok()).toBeTruthy();

  const listingHtml = await listing.text();
  const nextPagePath = listingHtml.match(/href="(\/blog\?cursor=[^"]+)"/)?.[1];
  expect(nextPagePath).toBeDefined();

  const response = await request.get(`${nextPagePath!}&utm_source=canonical-test`);
  expect(response.ok()).toBeTruthy();

  const html = await response.text();
  expect(html.match(/<link rel="canonical"[^>]*>/g)).toEqual([
    `<link rel="canonical" href="${siteUrl}${nextPagePath}"/>`,
  ]);
});

test("a published article canonicalizes to its own public URL", async ({ request }) => {
  const listing = await request.get("/blog");
  expect(listing.ok()).toBeTruthy();

  const listingHtml = await listing.text();
  const articlePath = listingHtml.match(/href="(\/blog\/[^"?#]+)"/)?.[1];
  expect(articlePath).toBeDefined();

  const response = await request.get(`${articlePath!}?utm_source=canonical-test`);
  expect(response.ok()).toBeTruthy();

  const html = await response.text();
  expect(html.match(/<link rel="canonical"[^>]*>/g)).toEqual([
    `<link rel="canonical" href="${siteUrl}${articlePath}"/>`,
  ]);
});
