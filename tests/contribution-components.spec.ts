import { test, expect } from "@playwright/test";

test.describe("Contribution Components", () => {
  test("LiquidContributionFab renders and opens on hover", async ({ page }) => {
    await page.goto("/");

    // The FAB should be visible (heart icon button)
    const fab = page.locator("[data-liquid-fab]");
    await expect(fab).toBeVisible({ timeout: 10000 });

    // Hover over the FAB to open the menu
    await fab.hover();
    await page.waitForTimeout(500);

    // Menu items should appear
    const menuItems = page.locator('[data-liquid-fab] button:has-text("Invest")');
    await expect(menuItems.first()).toBeVisible({ timeout: 5000 });
  });

  test("ContributionWidget renders on community page", async ({ page }) => {
    await page.goto("/community");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // The contribution widget with tabs should be visible
    const tabs = page.locator('button[role="tab"]:has-text("Invest")');
    await expect(tabs.first()).toBeVisible({ timeout: 10000 });

    // Click on a tab and verify cards appear
    await tabs.first().click();

    // Cards should have the "Spread the Word" text
    const spreadCard = page.locator("text=Spread the Word");
    await expect(spreadCard.first()).toBeVisible({ timeout: 5000 });
  });
});
