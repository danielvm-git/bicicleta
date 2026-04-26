/**
 * Single **Bike** price aggregate over **Component** rows (client + server).
 * Keeps total price rules in one place (locality).
 */
export function sumComponentPrices(
  components: { price: string | null | undefined }[]
): number {
  return components.reduce((sum, c) => {
    const p = parseFloat(String(c.price ?? "0"));
    const n = Number.isFinite(p) && p >= 0 ? p : 0;
    return sum + n;
  }, 0);
}
