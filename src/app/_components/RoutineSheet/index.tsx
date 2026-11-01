'use client';

import { useId } from 'react';

import type { RoutineInfo } from '@/lib/clyde';
import { groupRoutines, type RoutineGroup } from '@/lib/rooms/groupRoutines';
import { routineLabel } from '@/lib/rooms/routineLabel';
import { moveRadioFocus } from '@/lib/ui/moveRadioFocus';

import Sheet from '../shared/Sheet';
import * as S from './styles';

interface RoutineSheetProps {
  roomLabel: string;
  routines: readonly RoutineInfo[];
  current: string | null;
  onSelect: (routine: string) => void;
  onClose: () => void;
}

export default function RoutineSheet({ roomLabel, routines, current, onSelect, onClose }: RoutineSheetProps) {
  const titleId = useId();

  const renderRoutine = (routine: RoutineInfo) => {
    const isCurrent = routine.name === current;
    const handleClick = () => onSelect(routine.name);
    return (
      <S.Option
        key={routine.name}
        type="button"
        role="radio"
        aria-checked={isCurrent}
        $isCurrent={isCurrent}
        onClick={handleClick}
      >
        <span>{routineLabel(routine)}</span>
        {isCurrent ? <S.Check aria-hidden="true">✓</S.Check> : null}
      </S.Option>
    );
  };

  const renderGroup = (group: RoutineGroup) => {
    const headingId = `${titleId}-${group.id}`;
    return (
      <S.Group key={group.id}>
        <S.GroupTitle id={headingId}>{group.title}</S.GroupTitle>
        <S.Options role="radiogroup" aria-labelledby={headingId} onKeyDown={moveRadioFocus}>
          {group.routines.map(renderRoutine)}
        </S.Options>
      </S.Group>
    );
  };

  return (
    <Sheet title={`${roomLabel} routine`} onClose={onClose}>
      {groupRoutines(routines).map(renderGroup)}
    </Sheet>
  );
}
