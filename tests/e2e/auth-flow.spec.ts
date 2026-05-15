import { expect, test } from "@playwright/test";

function createUniqueCredentials() {
  const uniquePart = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  return {
    email: `playwright-e2e-${uniquePart}@example.com`,
    password: `Cipherwill!${uniquePart}`,
  };
}

test("signup, logout, login, and logout from profile flow", async ({ page }) => {
  test.setTimeout(180_000);

  const { email, password } = createUniqueCredentials();
  const emailInput = page.locator('input[name="email"]');
  const passwordInput = page.locator('input[name="password"]');
  const profileLogoutButton = page
    .locator("button")
    .filter({ hasText: /^Logout$/ })
    .first();

  await page.goto("/");
  await page.getByRole("link", { name: "Login/Signup" }).first().click();
  await page.waitForURL(/\/auth/, { timeout: 45_000 });

  await emailInput.fill(email);
  await passwordInput.fill(password);
  await page.getByRole("button", { name: "Sign Up" }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/auth"), {
    timeout: 45_000,
  });

  await page.goto("/app/settings?tab=profile");
  await expect(page).toHaveURL(/\/app\/settings\?tab=profile/);

  await profileLogoutButton.click();
  await page.waitForURL(/\/auth/, { timeout: 45_000 });

  await emailInput.fill(email);
  await passwordInput.fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/auth"), {
    timeout: 45_000,
  });

  await page.goto("/app");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  await page.goto("/app/settings?tab=profile");
  await expect(page).toHaveURL(/\/app\/settings\?tab=profile/);
  await profileLogoutButton.click();
  await page.waitForURL(/\/auth/, { timeout: 45_000 });

  await expect(emailInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
});
