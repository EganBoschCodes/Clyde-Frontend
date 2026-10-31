'use client';

import Link from 'next/link';
import { useState } from 'react';

import { setRoomRoutine } from '@/lib/roomApi/setRoomRoutine';
import type { StudioRoomOption } from '@/lib/studio/types';

import { Button } from '../shared/Control';
import { ErrorText } from '../shared/Section';
import StudioRoomPicker from '../StudioRoomPicker';
import * as S from '../StudioEditor/styles';

interface StudioSavedPanelProps {
  routineKey: string;
  name: string;
  rooms: readonly StudioRoomOption[];
  onPlay: (room: string) => void;
}

export default function StudioSavedPanel({ routineKey, name, rooms, onPlay }: StudioSavedPanelProps) {
  const [room, setRoom] = useState(rooms[0]?.name ?? '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playedRoom, setPlayedRoom] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const roomName = rooms.find(r => r.name === room)?.label ?? room;

  const handlePlay = async () => {
    setIsPlaying(true);
    setError(null);
    onPlay(room);
    const failure = await setRoomRoutine(room, routineKey);
    setIsPlaying(false);
    if (failure) {
      setError(failure.message);
      return;
    }
    setPlayedRoom(room);
  };

  const renderStatus = () => {
    if (error) return <ErrorText role="alert">Could not play: {error}</ErrorText>;
    if (!playedRoom) return null;
    const label = rooms.find(r => r.name === playedRoom)?.label ?? playedRoom;
    return <div role="status">Now playing in {label}.</div>;
  };

  return (
    <S.Saved>
      <S.SavedTitle role="status">Saved &ldquo;{name}&rdquo;</S.SavedTitle>
      <StudioRoomPicker name="studio-play-room" label="Play in room" rooms={rooms} value={room} onChange={setRoom} />
      <S.ButtonRow>
        <Button type="button" $tone="primary" onClick={handlePlay} disabled={isPlaying || rooms.length === 0}>
          {isPlaying ? 'Starting...' : `Play in ${roomName}`}
        </Button>
        <Button as={Link} href="/studio" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
          Done
        </Button>
      </S.ButtonRow>
      {renderStatus()}
    </S.Saved>
  );
}
