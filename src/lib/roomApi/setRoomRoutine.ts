import { sendRoomRequest } from './sendRoomRequest';

export function setRoomRoutine(room: string, routine: string): Promise<Error | null> {
  return sendRoomRequest(`/api/clyde/rooms/${encodeURIComponent(room)}/routine`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ routine }),
  });
}
