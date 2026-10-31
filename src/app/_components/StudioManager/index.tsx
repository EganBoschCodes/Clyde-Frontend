'use client';

import { useState } from 'react';

import type { StudioRoomOption, StudioRoutine } from '@/lib/studio/types';

import StudioEmptyState from '../StudioEmptyState';
import StudioRoutineCard from '../StudioRoutineCard';
import * as S from './styles';

interface StudioManagerProps {
  initialRoutines: StudioRoutine[];
  rooms: StudioRoomOption[];
}

export default function StudioManager({ initialRoutines, rooms }: StudioManagerProps) {
  const [routines, setRoutines] = useState(initialRoutines);

  const handleDeleted = (key: string) => {
    setRoutines(current => current.filter(routine => routine.key !== key));
  };

  const renderRoutine = (routine: StudioRoutine) => (
    <StudioRoutineCard key={routine.key} routine={routine} rooms={rooms} onDeleted={handleDeleted} />
  );

  return (
    <S.Wrap>
      <S.NewLink href="/studio/new">New routine</S.NewLink>
      {routines.length === 0 ? <StudioEmptyState /> : <S.Grid>{routines.map(renderRoutine)}</S.Grid>}
    </S.Wrap>
  );
}
