import { test, expect } from "@playwright/test";

/**
 * GSD R002 — navegação e filtros de componentes.
 * Uses role-based selectors; add data-testid when stabilizing critical flows.
 */
test.describe("Component catalog", () => {
  test("redirects from / to /components and shows heading", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/components\/?$/);
    await expect(
      page.getByRole("heading", { name: "Componentes" })
    ).toBeVisible();
  });

  test("components page lists filter form groups", async ({ page }) => {
    await page.goto("/components");
    // Scope to form labels — table also repeats "Categoria" as a column header
    await expect(page.getByLabel("Categoria")).toBeVisible();
    await expect(page.getByLabel("Marca")).toBeVisible();
  });
});
