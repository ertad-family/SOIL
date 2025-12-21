import { test, expect } from "@playwright/test";

/**
 * Mobile UI Audit Tests
 *
 * These tests capture screenshots of all main pages at different mobile viewports
 * to document UI issues and track mobile responsiveness.
 *
 * Run with: npx playwright test tests/mobile-audit.spec.ts
 * Run specific project: npx playwright test tests/mobile-audit.spec.ts --project=iphone-se
 *
 * @see https://github.com/ertad-family/soil/issues/95
 */

// Pages to audit - public pages that don't require authentication
const PUBLIC_PAGES = [
  { path: "/", name: "home" },
  { path: "/research", name: "research" },
  { path: "/community", name: "community" },
  { path: "/education", name: "education" },
  { path: "/clinic", name: "clinic" },
  { path: "/about", name: "about" },
  { path: "/login", name: "login" },
  { path: "/signup", name: "signup" },
  { path: "/privacy", name: "privacy" },
  { path: "/terms", name: "terms" },
];

test.describe("Mobile UI Audit - Public Pages", () => {
  for (const page of PUBLIC_PAGES) {
    test(`capture ${page.name} page screenshots`, async ({ page: browserPage }, testInfo) => {
      const projectName = testInfo.project.name;
      const screenshotDir = `tests/screenshots/${projectName}`;

      // Navigate to page
      await browserPage.goto(page.path);

      // Wait for page to be fully loaded
      await browserPage.waitForLoadState("networkidle");

      // Give 3D scenes and animations time to settle
      await browserPage.waitForTimeout(1000);

      // Capture viewport screenshot
      await browserPage.screenshot({
        path: `${screenshotDir}/${page.name}-viewport.png`,
        fullPage: false,
      });

      // Capture full page screenshot
      await browserPage.screenshot({
        path: `${screenshotDir}/${page.name}-fullpage.png`,
        fullPage: true,
      });

      // Basic visibility checks - ensure page has content
      const body = browserPage.locator("body");
      await expect(body).toBeVisible();
    });
  }
});

test.describe("Mobile UI Audit - Navigation", () => {
  test("menu opens and displays correctly on mobile", async ({ page }, testInfo) => {
    // Skip this test on desktop
    if (testInfo.project.name === "desktop") {
      test.skip();
      return;
    }

    const projectName = testInfo.project.name;
    const screenshotDir = `tests/screenshots/${projectName}`;

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Look for menu button (hamburger or menu icon)
    const menuButton = page.getByRole("button", { name: /menu/i });

    if (await menuButton.isVisible()) {
      // Capture before menu open
      await page.screenshot({
        path: `${screenshotDir}/navigation-closed.png`,
        fullPage: false,
      });

      // Click menu button
      await menuButton.click();
      await page.waitForTimeout(500);

      // Capture with menu open
      await page.screenshot({
        path: `${screenshotDir}/navigation-open.png`,
        fullPage: false,
      });
    }
  });
});

test.describe("Mobile UI Audit - 3D Scene", () => {
  test("3D scene loads and UI elements are visible", async ({ page }, testInfo) => {
    const projectName = testInfo.project.name;
    const screenshotDir = `tests/screenshots/${projectName}`;

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Wait for 3D canvas to appear
    const canvas = page.locator("canvas");
    await expect(canvas.first()).toBeVisible({ timeout: 10000 });

    // Wait for scene to render
    await page.waitForTimeout(2000);

    // Capture 3D scene area
    await page.screenshot({
      path: `${screenshotDir}/3d-scene.png`,
      fullPage: false,
    });

    // Check for navigation hint text - should be touch-friendly on mobile
    // Look specifically for the portal navigation hint
    const hintText = page.getByText("DOUBLE-CLICK PORTAL TO ENTER");
    if (await hintText.isVisible()) {
      // This hint is not mobile-friendly - document it
      console.log(
        `[${projectName}] ISSUE: Navigation hint uses "double-click" - not touch-friendly for mobile`
      );
    }
  });
});

test.describe("Mobile UI Audit - Theme Toggle", () => {
  test("theme toggle works on mobile", async ({ page }, testInfo) => {
    const projectName = testInfo.project.name;
    const screenshotDir = `tests/screenshots/${projectName}`;

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Find theme toggle button
    const themeButton = page.getByRole("button", {
      name: /light|dark|theme/i,
    });

    if (await themeButton.isVisible()) {
      // Capture light mode
      await page.screenshot({
        path: `${screenshotDir}/theme-light.png`,
        fullPage: false,
      });

      // Toggle theme
      await themeButton.click();
      await page.waitForTimeout(500);

      // Capture dark mode
      await page.screenshot({
        path: `${screenshotDir}/theme-dark.png`,
        fullPage: false,
      });
    }
  });
});
