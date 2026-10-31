import type { StudioSpec } from './types';

export interface StudioTemplate {
  id: string;
  spec: StudioSpec;
  tagline: string;
}

export const TEMPLATES: readonly StudioTemplate[] = [
  {
    id: 'pumpkin-patch',
    tagline: 'Oranges and a purple dusk',
    spec: { name: 'Pumpkin Patch', colors: ['#ff6a00', '#ff9d2e', '#7a1fa2', '#ffb347'], style: 'drift', speed: 0.25, brightness: 180 },
  },
  {
    id: 'deep-sea',
    tagline: 'Slow blues and teal',
    spec: { name: 'Deep Sea', colors: ['#0a3d91', '#0e7c86', '#12b5b0', '#1b2f7a'], style: 'drift', speed: 0.2, brightness: 150 },
  },
  {
    id: 'campfire',
    tagline: 'Flickering embers',
    spec: { name: 'Campfire', colors: ['#ff5a00', '#ff8c1a', '#ffb04a', '#d63a00'], style: 'flicker', speed: 0.6, brightness: 200 },
  },
  {
    id: 'rave',
    tagline: 'Neon, going around',
    spec: { name: 'Rave', colors: ['#ff0080', '#00e5ff', '#7a00ff', '#00ff6a', '#ffee00'], style: 'chase', speed: 0.85, brightness: 255 },
  },
];

export function findTemplate(id: string): StudioTemplate | null {
  return TEMPLATES.find(template => template.id === id) ?? null;
}
