import type { H3Event } from "h3";
import { getRequestHeader, getRequestURL } from "h3";
import { joinURL } from "ufo";
import type { NeonGetSessionResult } from "~/types/neon-auth";

/**
 * Resolves the current session via the same-origin auth proxy (cookies match the browser).
 */
export async function getNeonSession(
  event: H3Event
): Promise<NeonGetSessionResult> {
  const config = useRuntimeConfig(event) as { neonAuthBaseUrl?: string };
  if (!config.neonAuthBaseUrl) {
    return null;
  }
  const url = joinURL(getRequestURL(event).origin, "/api/auth/get-session");
  try {
    const cookie = getRequestHeader(event, "cookie") || "";
    const res = await fetch(url, {
      method: "GET",
      headers: { cookie },
    });
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as NeonGetSessionResult;
  } catch (e) {
    console.error("[getNeonSession]", e);
    return null;
  }
}

/**
 * Resolves a stable user id for `bikes.userId` and ownership checks.
 */
export function getNeonUserId(
  session: NeonGetSessionResult
): string | undefined {
  const u = session?.data?.user ?? session?.user;
  if (!u?.id) {
    return undefined;
  }
  return String(u.id);
}

/**
 * @deprecated use getNeonUserId; kept for incremental refactors
 */
export function getSessionUser(session: NeonGetSessionResult) {
  return session?.data?.user ?? session?.user ?? null;
}
