import { test, expect } from "@playwright/test";

test("capture design system screenshots", async ({ page }) => {
  // Set viewport to a larger size
  await page.setViewportSize({ width: 1440, height: 900 });

  // Navigate to the homepage (uses baseURL from playwright.config.ts)
  await page.goto("/");

  // Wait for the page to fully load
  await page.waitForLoadState("networkidle");

  // Verify we're in light mode - button should say "Light (Cenotaphery)" (now uppercase due to font-ui styling)
  const themeButton = page.getByRole("button", { name: /Light.*Cenotaphery/i });
  await expect(themeButton).toBeVisible({ timeout: 10000 });

  // Capture viewport screenshot - light mode (default)
  await page.screenshot({
    path: "tests/screenshots/design-system-light-viewport.png",
    fullPage: false,
  });

  // Capture full page screenshot - light mode
  await page.screenshot({
    path: "tests/screenshots/design-system-light.png",
    fullPage: true,
  });

  // Click the theme toggle button
  await themeButton.click();

  // Wait for theme to change - give more time for transition
  await page.waitForTimeout(500);

  // Wait for the button text to change to dark mode indicator
  const darkButton = page.getByRole("button", { name: /Dark.*Scientific/i });
  await expect(darkButton).toBeVisible({ timeout: 10000 });

  // Capture viewport screenshot - dark mode
  await page.screenshot({
    path: "tests/screenshots/design-system-dark-viewport.png",
    fullPage: false,
  });

  // Capture full page screenshot - dark mode
  await page.screenshot({
    path: "tests/screenshots/design-system-dark.png",
    fullPage: true,
  });

  // Test toast notifications - scroll to toast section first
  await page.getByText("Spinners & Toast").scrollIntoViewIfNeeded();

  // Click the default toast button
  const toastButton = page.getByRole("button", { name: /Show Default Toast/i });
  await toastButton.click();

  // Wait for toast to appear
  await page.waitForTimeout(500);

  // Capture screenshot with toast visible
  await page.screenshot({
    path: "tests/screenshots/design-system-toast.png",
    fullPage: false,
  });
});
