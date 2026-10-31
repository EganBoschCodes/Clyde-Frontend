import { titleCase } from '@/lib/text/titleCase';

interface LabelledRoom {
  name: string;
  display_name?: string;
}

export function roomLabel(room: LabelledRoom): string {
  return room.display_name ?? titleCase(room.name);
}
