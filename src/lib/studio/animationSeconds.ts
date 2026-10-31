import type { StudioStyle } from './types';

interface Range {
  slow: number;
  fast: number;
}

const RANGES: Record<StudioStyle, Range> = {
  drift: { slow: 18, fast: 2.5 },
  flicker: { slow: 2.2, fast: 0.4 },
  pulse: { slow: 7, fast: 1.2 },
  chase: { slow: 1.1, fast: 0.15 },
  static: { slow: 1, fast: 1 },
};

export function animationSeconds(style: StudioStyle, speed: number): number {
  const range = RANGES[style];
  const clamped = Math.min(1, Math.max(0, speed));
  return range.slow + (range.fast - range.slow) * clamped;
}
