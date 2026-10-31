export type Rgb = [number, number, number];

const INK_SWITCH_LUMINANCE = 0.18;

function channel(value: number): number {
  const c = Math.min(255, Math.max(0, value)) / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function luminance(rgb: Rgb): number {
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
}

export function isLightColor(rgb: Rgb): boolean {
  return luminance(rgb) > INK_SWITCH_LUMINANCE;
}

export function blendColors(colors: readonly Rgb[]): Rgb | null {
  if (colors.length === 0) return null;
  const sum = colors.reduce<Rgb>((acc, c) => [acc[0] + c[0], acc[1] + c[1], acc[2] + c[2]], [0, 0, 0]);
  return [sum[0] / colors.length, sum[1] / colors.length, sum[2] / colors.length];
}
