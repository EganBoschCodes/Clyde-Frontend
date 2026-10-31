import { sendRoomRequest } from '@/lib/roomApi/sendRoomRequest';

export function deleteStudioRoutine(key: string): Promise<Error | null> {
  return sendRoomRequest(`/api/clyde/studio/routines/${encodeURIComponent(key)}`, { method: 'DELETE' });
}
