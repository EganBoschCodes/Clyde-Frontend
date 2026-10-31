'use client';

import { useState } from 'react';

import { setRoomRoutine } from '@/lib/roomApi/setRoomRoutine';
import { deleteStudioRoutine } from '@/lib/studio/deleteStudioRoutine';
import { STYLE_INFO, type StudioRoomOption, type StudioRoutine } from '@/lib/studio/types';

import { Button } from '../shared/Control';
import { ErrorText } from '../shared/Section';
import StudioSwatch from '../StudioSwatch';
import * as S from './styles';

type Mode = 'idle' | 'play' | 'confirmDelete';

interface StudioRoutineCardProps {
  routine: StudioRoutine;
  rooms: readonly StudioRoomOption[];
  onDeleted: (key: string) => void;
}

export default function StudioRoutineCard({ routine, rooms, onDeleted }: StudioRoutineCardProps) {
  const [mode, setMode] = useState<Mode>('idle');
  const [isBusy, setIsBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const editHref = `/studio/${encodeURIComponent(routine.key)}`;
  const copyHref = `/studio/new?from=${encodeURIComponent(routine.key)}`;

  const handleTogglePlay = () => {
    setMode(mode === 'play' ? 'idle' : 'play');
    setNotice(null);
    setError(null);
  };

  const handleAskDelete = () => {
    setMode('confirmDelete');
    setNotice(null);
    setError(null);
  };

  const handleCancel = () => setMode('idle');

  const handlePlayIn = async (room: StudioRoomOption) => {
    setIsBusy(true);
    setError(null);
    const failure = await setRoomRoutine(room.name, routine.key);
    setIsBusy(false);
    if (failure) {
      setError(`Could not play in ${room.label}: ${failure.message}`);
      return;
    }
    setNotice(`Playing in ${room.label}`);
    setMode('idle');
  };

  const handleDelete = async () => {
    setIsBusy(true);
    setError(null);
    const failure = await deleteStudioRoutine(routine.key);
    setIsBusy(false);
    if (failure) {
      setError(`Could not delete: ${failure.message}`);
      return;
    }
    onDeleted(routine.key);
  };

  const renderRoom = (room: StudioRoomOption) => (
    <Button key={room.name} type="button" disabled={isBusy} onClick={() => handlePlayIn(room)}>
      {room.label}
    </Button>
  );

  const renderActions = () => {
    if (mode === 'play') {
      return (
        <>
          <S.Prompt id={`play-${routine.key}`}>Play in which room?</S.Prompt>
          <S.Rooms aria-labelledby={`play-${routine.key}`}>
            {rooms.map(renderRoom)}
            <Button type="button" onClick={handleCancel}>Cancel</Button>
          </S.Rooms>
        </>
      );
    }
    if (mode === 'confirmDelete') {
      return (
        <>
          <S.Prompt role="alertdialog" aria-label={`Delete ${routine.name}`}>
            Delete &ldquo;{routine.name}&rdquo;? It will stop wherever it is playing.
          </S.Prompt>
          <S.Rooms>
            <Button type="button" onClick={handleCancel} disabled={isBusy}>Keep it</Button>
            <Button type="button" $tone="danger" onClick={handleDelete} disabled={isBusy}>
              {isBusy ? 'Deleting...' : 'Delete'}
            </Button>
          </S.Rooms>
        </>
      );
    }
    return (
      <>
        <S.Full>
          <Button type="button" $tone="primary" onClick={handleTogglePlay} disabled={rooms.length === 0}>Play in room</Button>
        </S.Full>
        <S.Row>
          <S.LinkButton href={editHref}>Edit</S.LinkButton>
          <S.LinkButton href={copyHref}>Duplicate</S.LinkButton>
          <Button type="button" $tone="danger" onClick={handleAskDelete}>Delete</Button>
        </S.Row>
      </>
    );
  };

  return (
    <S.Card>
      <S.Preview>
        <StudioSwatch colors={routine.colors} style={routine.style} speed={routine.speed} brightness={routine.brightness} />
      </S.Preview>
      <S.Head>
        <S.Name>{routine.name}</S.Name>
        <S.Meta>{STYLE_INFO[routine.style].label}</S.Meta>
      </S.Head>
      {renderActions()}
      {notice ? <S.Prompt role="status">{notice}</S.Prompt> : null}
      {error ? <ErrorText role="alert">{error}</ErrorText> : null}
    </S.Card>
  );
}
