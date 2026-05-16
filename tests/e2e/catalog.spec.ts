import { test, expect } from "@playwright/test";

test.describe("Component catalog", () => {
  test("landing page shows hero and catalog link", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /UNCOMPROMISING|PERFORMANCE/,
      })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Explore Catalog" })
    ).toBeVisible();
  });

  test("filters are present", async ({ page }) => {
    await page.goto("/components");
    await expect(page.getByText("Category").first()).toBeVisible();
    await expect(page.getByText("Brand").first()).toBeVisible();
  });
});
