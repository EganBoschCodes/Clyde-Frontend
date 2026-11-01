import type { Result } from '@/lib/clyde';

import { sendLightRequest } from './sendLightRequest';

export async function releaseLightPin(light: string): Promise<Result<boolean>> {
  const [res, err] = await sendLightRequest(`/api/clyde/lights/${encodeURIComponent(light)}/pin`, { method: 'DELETE' });
  if (err) return [null, err];
  const released = typeof res === 'object' && res !== null && 'released' in res ? res.released === true : true;
  return [released, null];
}
