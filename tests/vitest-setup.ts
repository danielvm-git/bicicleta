/**
 * Nuxt + Vitest uses Vue’s Suspense; Vue still logs that Suspense is experimental.
 * That line is noise for our suite — filter it so `npm test` output stays signal-only.
 */
const SUSPENSE_EXPERIMENTAL = "<Suspense> is an experimental feature";

const origLog = console.log.bind(console);
const origWarn = console.warn.bind(console);

function filterSuspenseNoise(
  args: unknown[],
  forward: (...a: unknown[]) => void
) {
  if (
    args.some((a) => typeof a === "string" && a.includes(SUSPENSE_EXPERIMENTAL))
  )
    return;
  forward(...args);
}

console.log = (...args: unknown[]) => filterSuspenseNoise(args, origLog);
console.warn = (...args: unknown[]) => filterSuspenseNoise(args, origWarn);
