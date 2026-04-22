import { expect, test } from "@playwright/test";

test("home page loads successfully", async ({ page }) => {
  const response = await page.goto("/");

  expect(response).not.toBeNull();
  expect(response?.ok()).toBeTruthy();
});
