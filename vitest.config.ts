import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    globals: true,
    // Playwright E2E lives in tests/e2e/*.spec.ts — exclude from Vitest
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/e2e/**", "node_modules/**"],
  },
});
