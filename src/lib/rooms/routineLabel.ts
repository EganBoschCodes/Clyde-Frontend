import { titleCase } from '@/lib/text/titleCase';

interface LabelledRoutine {
  name: string;
  display_name?: string;
}

export function routineLabel(routine: LabelledRoutine): string {
  return routine.display_name ?? titleCase(routine.name);
}
