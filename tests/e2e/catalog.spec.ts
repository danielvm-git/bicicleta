import { test, expect } from "@playwright/test";

test.describe("Component catalog", () => {
  test("redirects from / to /components and shows heading", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForURL(/\/components\/?$/);
    await expect(
      page.getByRole("heading", { name: "Componentes" })
    ).toBeVisible();
  });

  test("filters are present", async ({ page }) => {
    await page.goto("/components");
    await expect(page.getByText("Categoria").first()).toBeVisible();
    await expect(page.getByText("Marca").first()).toBeVisible();
  });
});
