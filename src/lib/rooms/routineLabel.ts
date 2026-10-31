import { titleCase } from '@/lib/text/titleCase';

interface LabelledRoutine {
  name: string;
  display_name?: string;
  custom?: boolean;
}

// Built-in routines report display_name === name (a raw key like "halloween"),
// so only trust display_name for custom Studio routines.
export function routineLabel(routine: LabelledRoutine): string {
  if (routine.custom && routine.display_name) return routine.display_name;
  return titleCase(routine.name);
}
