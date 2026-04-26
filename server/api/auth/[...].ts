import {
  getRequestURL,
  getMethod,
  getRequestHeader,
  readRawBody,
  setResponseStatus,
  appendResponseHeader,
} from "h3";
import { joinURL } from "ufo";

/**
 * Proxies /api/auth/* to Neon Auth (Better Auth) so session cookies are same-origin.
 * Configure NEON_AUTH_BASE_URL from the Neon console (Auth).
 */
export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  if (method === "OPTIONS") {
    setResponseStatus(event, 204);
    return "";
  }
  const config = useRuntimeConfig();
  const base = (config as { neonAuthBaseUrl?: string }).neonAuthBaseUrl || "";
  const url = getRequestURL(event);
  const pathNoQuery = url.pathname.replace(/\/$/, "") || "/";
  const isGetSession = method === "GET" && pathNoQuery.endsWith("/get-session");
  if (!base) {
    if (isGetSession) {
      return {
        data: { user: null, session: null },
      };
    }
    throw createError({
      statusCode: 503,
      statusMessage: "NEON_AUTH_BASE_URL is not configured",
    });
  }
  const rel = url.pathname.replace(/^\/api\/auth\/?/, "");
  const targetBase = base.replace(/\/$/, "");
  const pathPart = rel ? `/${rel}` : "";
  const target = joinURL(targetBase, pathPart) + (url.search || "");
  const headers: Record<string, string> = {
    cookie: getRequestHeader(event, "cookie") || "",
  };
  const ct = getRequestHeader(event, "content-type");
  if (ct) {
    headers["content-type"] = ct;
  }
  const xff = getRequestHeader(event, "x-forwarded-for");
  if (xff) {
    headers["x-forwarded-for"] = xff;
  }
  const body =
    method !== "GET" && method !== "HEAD"
      ? await readRawBody(event)
      : undefined;
  const res = await fetch(target, {
    method,
    headers,
    body: body as BodyInit | undefined,
    redirect: "manual",
  });
  setResponseStatus(event, res.status);
  const hopByHop = new Set([
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailers",
    "transfer-encoding",
    "upgrade",
    "content-encoding",
  ]);
  res.headers.forEach((value, key) => {
    if (hopByHop.has(key.toLowerCase())) {
      return;
    }
    appendResponseHeader(event, key, value);
  });
  return new Uint8Array(await res.arrayBuffer());
});
