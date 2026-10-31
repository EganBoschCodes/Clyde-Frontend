import { sendRoomRequest } from './sendRoomRequest';

export function setRoomDim(room: string, factor: number): Promise<Error | null> {
  return sendRoomRequest(`/api/clyde/rooms/${encodeURIComponent(room)}/dim`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ room, factor }),
  });
}
