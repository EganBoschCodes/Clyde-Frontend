import type { RoutineInfo } from '@/lib/clyde';

const SEASONAL_ROUTINES = ['halloween'];

export interface RoutineGroup {
  id: 'custom' | 'seasonal' | 'builtin';
  title: string;
  routines: RoutineInfo[];
}

export function groupRoutines(routines: readonly RoutineInfo[]): RoutineGroup[] {
  const custom = routines.filter(r => r.custom === true);
  const seasonal = routines.filter(r => r.custom !== true && SEASONAL_ROUTINES.includes(r.name));
  const builtin = routines.filter(r => r.custom !== true && !SEASONAL_ROUTINES.includes(r.name));
  const groups: RoutineGroup[] = [
    { id: 'custom', title: 'Custom', routines: custom },
    { id: 'seasonal', title: 'Seasonal', routines: seasonal },
    { id: 'builtin', title: 'Built-in', routines: builtin },
  ];
  return groups.filter(g => g.routines.length > 0);
}
