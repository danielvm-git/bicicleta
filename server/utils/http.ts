function isH3OrHttpError(
  e: unknown
): e is { statusCode: number; statusMessage?: string } {
  if (e === null || typeof e !== "object" || !("statusCode" in e)) {
    return false;
  }
  const c = (e as { statusCode: number }).statusCode;
  return Number.isInteger(c) && c >= 400 && c < 600;
}

/** Re-throw H3/HTTP errors from `createError` so 4xx/5xx are not wrapped again. */
export function rethrowH3Error(error: unknown, logContext?: string): never {
  if (isH3OrHttpError(error)) {
    throw error;
  }
  if (logContext) {
    console.error(`[${logContext}]`, error);
  } else {
    console.error(error);
  }
  throw createError({
    statusCode: 500,
    statusMessage: "Internal Server Error",
  });
}
