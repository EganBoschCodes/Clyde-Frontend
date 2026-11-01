import type { Pin } from '@/lib/clyde';

interface StatusInput {
  on: boolean | null;
  pin: Pin | null;
  routineName: string | null;
}

export function lightStatus({ on, pin, routineName }: StatusInput): string {
  if (pin) return on === false ? 'Off · Pinned' : 'Pinned';
  if (on === null) return 'Checking…';
  if (!on) return 'Off';
  return routineName ? `Following ${routineName}` : 'On';
}
