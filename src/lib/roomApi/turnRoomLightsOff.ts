import { sendRoomRequest } from './sendRoomRequest';

export function turnRoomLightsOff(room: string): Promise<Error | null> {
  return sendRoomRequest(`/api/clyde/rooms/${encodeURIComponent(room)}/lights`, { method: 'DELETE' });
}
