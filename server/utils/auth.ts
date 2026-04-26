import type { H3Event } from "h3";
import { getNeonSession, getSessionUser } from "~/server/utils/neonSession";

/**
 * Requires a valid Neon / Better Auth session and `user.role === "admin"`.
 * Grant the role in the Neon console (Auth) or via Neon Auth / Better Auth admin APIs.
 */
export async function requireAdminSession(event: H3Event) {
  const session = await getNeonSession(event);
  const user = getSessionUser(session);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }
  if (user.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Admin access required",
    });
  }
}
