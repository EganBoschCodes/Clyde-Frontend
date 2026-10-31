const ROOM_ORDER = ['living_room', 'office', 'bedroom'] as const;

interface NamedRoom {
  name: string;
}

function orderIndex(name: string): number {
  const index = (ROOM_ORDER as readonly string[]).indexOf(name);
  return index === -1 ? ROOM_ORDER.length : index;
}

export function sortRooms<T extends NamedRoom>(rooms: readonly T[]): T[] {
  return rooms
    .map((room, position) => ({ room, position }))
    .sort((a, b) => orderIndex(a.room.name) - orderIndex(b.room.name) || a.position - b.position)
    .map(entry => entry.room);
}
