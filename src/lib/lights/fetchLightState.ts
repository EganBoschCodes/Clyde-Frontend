import type { LightStateResponse } from '@/lib/clyde';

export async function fetchLightState(light: string, signal: AbortSignal): Promise<LightStateResponse | null> {
  let res: Response;
  try {
    res = await fetch(`/api/clyde/lights/${encodeURIComponent(light)}/state`, { signal, cache: 'no-store' });
  } catch {
    return null;
  }
  if (!res.ok) return null;
  return (await res.json().catch(() => null)) as LightStateResponse | null;
}
