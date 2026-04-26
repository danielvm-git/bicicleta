/** Resolved base URL for API calls or Playwright (must match playwright.config baseURL). */
export function getBaseUrl(): string {
  return process.env.BASE_URL ?? "http://localhost:3000";
}

export function getApiUrl(): string {
  return process.env.API_URL ?? new URL("/api", getBaseUrl()).toString();
}
