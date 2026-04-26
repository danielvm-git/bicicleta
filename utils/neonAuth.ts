import type { NeonAuthUser, NeonGetSessionResult } from "~/types/neon-auth";

/**
 * Single seam for "who is the user?" from a Neon / Better Auth session DTO.
 * Keeps `data.user` vs `user` shape handling in one place (client + server).
 */
export function getNeonAuthUserFromSession(
  session: NeonGetSessionResult
): NeonAuthUser | null {
  const u = session?.data?.user ?? session?.user;
  if (!u?.id) {
    return null;
  }
  return u;
}

/**
 * Resolves a stable user id for `bikes.userId` and ownership checks.
 */
export function getNeonUserId(
  session: NeonGetSessionResult
): string | undefined {
  const u = getNeonAuthUserFromSession(session);
  return u ? String(u.id) : undefined;
}

/**
 * @deprecated use getNeonAuthUserFromSession; kept for incremental refactors
 */
export function getSessionUser(session: NeonGetSessionResult) {
  return getNeonAuthUserFromSession(session);
}
