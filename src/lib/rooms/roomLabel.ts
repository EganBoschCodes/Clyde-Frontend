interface LabelledRoom {
  name: string;
  display_name?: string;
}

function prettifyKey(key: string): string {
  return key
    .split('_')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function roomLabel(room: LabelledRoom): string {
  return room.display_name ?? prettifyKey(room.name);
}
