import type { Pin, Result } from '@/lib/clyde';
import type { Rgb } from '@/lib/realtime/glowColor';

import { isPin } from './isPin';
import { sendLightRequest } from './sendLightRequest';

export interface LightPutBody {
  on: boolean;
  rgb_color?: Rgb;
  brightness?: number;
}

export async function putLight(light: string, body: LightPutBody): Promise<Result<Pin>> {
  const [res, err] = await sendLightRequest(`/api/clyde/lights/${encodeURIComponent(light)}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (err) return [null, err];
  const pin = typeof res === 'object' && res !== null && 'pin' in res ? res.pin : null;
  if (!isPin(pin)) return [null, new Error('Malformed light response')];
  return [pin, null];
}
