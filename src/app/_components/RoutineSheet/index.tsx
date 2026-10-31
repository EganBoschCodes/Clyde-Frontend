'use client';

import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

import type { RoutineInfo } from '@/lib/clyde';
import { groupRoutines, type RoutineGroup } from '@/lib/rooms/groupRoutines';
import { routineLabel } from '@/lib/rooms/routineLabel';

import * as S from './styles';

const FOCUSABLE = 'button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])';

interface RoutineSheetProps {
  roomLabel: string;
  routines: readonly RoutineInfo[];
  current: string | null;
  onSelect: (routine: string) => void;
  onClose: () => void;
}

export default function RoutineSheet({ roomLabel, routines, current, onSelect, onClose }: RoutineSheetProps) {
  const titleId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const sheet = sheetRef.current;
    const checked = sheet?.querySelector<HTMLElement>('[aria-checked="true"]');
    const first = sheet?.querySelector<HTMLElement>(FOCUSABLE);
    (checked ?? first)?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !sheet) return;
      const items = [...sheet.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const head = items[0];
      const tail = items[items.length - 1];
      if (!head || !tail) return;
      if (e.shiftKey && document.activeElement === head) {
        e.preventDefault();
        tail.focus();
        return;
      }
      if (!e.shiftKey && document.activeElement === tail) {
        e.preventDefault();
        head.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  const handleGroupKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const forward = e.key === 'ArrowDown' || e.key === 'ArrowRight';
    const backward = e.key === 'ArrowUp' || e.key === 'ArrowLeft';
    if (!forward && !backward) return;
    const radios = [...(sheetRef.current?.querySelectorAll<HTMLElement>('[role="radio"]') ?? [])];
    const index = radios.indexOf(document.activeElement as HTMLElement);
    if (index === -1) return;
    e.preventDefault();
    const nextIndex = (index + (forward ? 1 : -1) + radios.length) % radios.length;
    radios[nextIndex]?.focus();
  };

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
        <S.Options role="radiogroup" aria-labelledby={headingId} onKeyDown={handleGroupKeyDown}>
          {group.routines.map(renderRoutine)}
        </S.Options>
      </S.Group>
    );
  };

  return createPortal(
    <S.Backdrop onClick={onClose}>
      <S.Sheet
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={event => event.stopPropagation()}
      >
        <S.Handle aria-hidden="true" />
        <S.Header>
          <S.Title id={titleId}>{roomLabel} routine</S.Title>
          <S.CloseButton type="button" onClick={onClose}>
            Close
          </S.CloseButton>
        </S.Header>
        <S.Body>{groupRoutines(routines).map(renderGroup)}</S.Body>
      </S.Sheet>
    </S.Backdrop>,
    document.body,
  );
}
