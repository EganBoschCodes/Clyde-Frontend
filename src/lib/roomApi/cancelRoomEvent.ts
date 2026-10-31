import { sendRoomRequest } from './sendRoomRequest';

export function cancelRoomEvent(room: string): Promise<Error | null> {
  return sendRoomRequest(`/api/clyde/rooms/${encodeURIComponent(room)}/event`, { method: 'DELETE' });
}
