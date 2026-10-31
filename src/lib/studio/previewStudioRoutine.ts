import { sendRoomRequest } from '@/lib/roomApi/sendRoomRequest';

import type { StudioSpec } from './types';

export function previewStudioRoutine(room: string, spec: StudioSpec): Promise<Error | null> {
  return sendRoomRequest('/api/clyde/studio/preview', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ room, spec }),
  });
}
