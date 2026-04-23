/**
 * Generates a deterministic array of price points using a seeded LCG + GBM.
 * Output: array of N prices (normalized to start near 100).
 */
export function generatePriceHistory(seed: string, steps: number = 30): number[] {
  let state = stringToSeed(seed);

  function nextRandom(): number {
    state = (state * 1664525 + 1013904223) & 0xffffffff;
    return (state >>> 0) / 0xffffffff;
  }

  // GBM parameters
  const mu = 0.0003;    // daily drift (~7.5% annual)
  const sigma = 0.015;  // daily volatility (~24% annual)
  const dt = 1;

  const prices: number[] = [100];
  for (let i = 1; i < steps; i++) {
    const z = gaussianRandom(nextRandom, nextRandom);
    const change = Math.exp((mu - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * z);
    prices.push(prices[i - 1] * change);
  }
  return prices;
}

function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash) || 1;
}

// Box-Muller transform
function gaussianRandom(r1: () => number, r2: () => number): number {
  const u1 = r1();
  const u2 = r2();
  return Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2);
}
