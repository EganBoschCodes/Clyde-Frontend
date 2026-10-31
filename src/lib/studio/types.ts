export type StudioStyle = 'drift' | 'flicker' | 'pulse' | 'chase' | 'static';

export interface StudioSpec {
  name: string;
  colors: string[];
  style: StudioStyle;
  speed: number;
  brightness: number;
}

export interface StudioRoutine extends StudioSpec {
  key: string;
}

export interface StudioRoomOption {
  name: string;
  label: string;
}

export const MAX_NAME_LENGTH = 40;
export const MAX_COLORS = 8;
export const MIN_BRIGHTNESS = 1;
export const MAX_BRIGHTNESS = 255;
export const PREVIEW_DEBOUNCE_MS = 400;

export const STYLE_IDS: readonly StudioStyle[] = ['drift', 'flicker', 'pulse', 'chase', 'static'];

export const STYLE_INFO: Record<StudioStyle, { label: string; blurb: string }> = {
  drift: { label: 'Drift', blurb: 'Smooth crossfades between your colors' },
  flicker: { label: 'Flicker', blurb: 'Candle and fire-like jitter' },
  pulse: { label: 'Pulse', blurb: 'The room breathes while colors cycle' },
  chase: { label: 'Chase', blurb: 'Colors step light to light' },
  static: { label: 'Static', blurb: 'Each light holds one color' },
};

export function isStudioStyle(value: unknown): value is StudioStyle {
  return typeof value === 'string' && (STYLE_IDS as readonly string[]).includes(value);
}
