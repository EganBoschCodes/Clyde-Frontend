import { sendRoomRequest } from '@/lib/roomApi/sendRoomRequest';

export function stopRoomRoutine(room: string): Promise<Error | null> {
  return sendRoomRequest(`/api/clyde/rooms/${encodeURIComponent(room)}/routine`, { method: 'DELETE', keepalive: true });
}
