/**
 * Local placeholder screenshots served from /public/painting-wheel/01.png … 11.png
 */

export const PAINTING_WHEEL_PLACEHOLDER_PATHS: readonly string[] = Array.from(
  { length: 11 },
  (_, i) => `/painting-wheel/${String(i + 1).padStart(2, "0")}.png`
);

export const PAINTING_WHEEL_PLACEHOLDER_COUNT = PAINTING_WHEEL_PLACEHOLDER_PATHS.length;

const hash32 = (n: number): number => {
  let h = n | 0;
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489917);
  return (h ^ (h >>> 16)) >>> 0;
};

/** Deterministic PRNG (mulberry32) */
const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * Fisher–Yates shuffle of indices [0 .. count-1] using `seed`.
 */
const seededShuffleIndices = (seed: number, count: number): number[] => {
  const indices = Array.from({ length: count }, (_, i) => i);
  const rng = mulberry32(seed + 0x9e3779b9);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
};

/**
 * Builds one image URL per card:
 * - While unique images remain in the pool, each card gets a distinct file (order shuffled by `seed`).
 * - After all 11 placeholders are used once, further cards pick repeats using a seeded hash (only then).
 */
export const buildPaintingWheelCardImageSrcs = (seed: number, numCards: number): string[] => {
  const n = PAINTING_WHEEL_PLACEHOLDER_COUNT;
  const perm = seededShuffleIndices(seed, n);

  return Array.from({ length: numCards }, (_, cardIndex) => {
    if (cardIndex < n) {
      const fileIndex = perm[cardIndex];
      return PAINTING_WHEEL_PLACEHOLDER_PATHS[fileIndex];
    }
    const repeatPick = hash32(seed * 1009 + numCards * 9176 + cardIndex * 7919) % n;
    return PAINTING_WHEEL_PLACEHOLDER_PATHS[repeatPick];
  });
};
