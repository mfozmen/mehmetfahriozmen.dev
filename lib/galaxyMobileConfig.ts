/**
 * Mobile-specific rendering configuration.
 * Pure functions that return adjusted values based on scale factor.
 */

export function mobileLabelSize(baseSize: number, sf: number, minSize: number): number {
  return Math.max(minSize, Math.round(baseSize * sf));
}

export function mobileLabelAlpha(
  importance: "primary" | "secondary" | "minor",
  sf: number,
): number {
  if (sf < 0.7) {
    if (importance === "primary") return 0.9;
    if (importance === "secondary") return 0.65;
    return 0.4;
  }
  if (importance === "primary") return 0.8;
  if (importance === "secondary") return 0.55;
  return 0.3;
}

