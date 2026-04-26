import type { H3Event } from "h3";

/**
 * GitHub user IDs in runtimeConfig.adminGithubIds (comma-separated).
 * If unset or empty, admin routes return 403 for everyone (fail closed).
 */
export async function requireAdminSession(event: H3Event) {
  const config = useRuntimeConfig(event);
  const allowed = (config.adminGithubIds as string)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (allowed.length === 0) {
    throw createError({
      statusCode: 403,
      statusMessage: "Admin access is not configured",
    });
  }
  const session = await getUserSession(event);
  const id = session.user?.githubId;
  if (id === undefined || id === null) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }
  const idStr = String(id);
  if (!allowed.includes(idStr)) {
    throw createError({
      statusCode: 403,
      statusMessage: "Admin access required",
    });
  }
}
