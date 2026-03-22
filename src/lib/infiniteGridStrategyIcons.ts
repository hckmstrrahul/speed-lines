/** Pre-built strategy icons (public URLs). Order matches asset set. */
export const STRATEGY_ICON_PATHS = [
  "/strategy-icons/bear_call_spread.svg",
  "/strategy-icons/bear_put_spread.svg",
  "/strategy-icons/bull_call_spread.svg",
  "/strategy-icons/bull_put_spread.svg",
  "/strategy-icons/iron_butterfly.svg",
  "/strategy-icons/long_iron_condor.svg",
  "/strategy-icons/long_straddle.svg",
  "/strategy-icons/long_strangle.svg",
  "/strategy-icons/short_iron_condor.svg",
  "/strategy-icons/short_straddle.svg",
  "/strategy-icons/short_strangle.svg",
] as const;

export const STRATEGY_ICON_COUNT = STRATEGY_ICON_PATHS.length;

/** Deterministic icon index per cell from seed (same seed → same layout after resize). */
export const pickStrategyIconIndex = (seed: number, row: number, col: number): number => {
  const len = STRATEGY_ICON_PATHS.length;
  let h = (Math.floor(seed) + row * 374761393 + col * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 15), h | 1);
  h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
  return (h >>> 0) % len;
};

export const strategyIconSrc = (seed: number, row: number, col: number): string => {
  return STRATEGY_ICON_PATHS[pickStrategyIconIndex(seed, row, col)];
};
