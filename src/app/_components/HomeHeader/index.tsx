'use client';

import { useContext, useState } from 'react';

import { RealtimeContext } from '@/lib/realtime/RealtimeProvider';
import { turnRoomLightsOff } from '@/lib/roomApi/turnRoomLightsOff';
import { useTransientMessage } from '@/lib/ui/useTransientMessage';

import * as S from './styles';

interface HomeHeaderProps {
  rooms: string[];
}

export default function HomeHeader({ rooms }: HomeHeaderProps) {
  const { patchRoomLive } = useContext(RealtimeContext);
  const [isPending, setIsPending] = useState(false);
  const [error, showError] = useTransientMessage();

  const handleAllOff = async () => {
    setIsPending(true);
    showError(null);
    const results = await Promise.all(
      rooms.map(async room => {
        const err = await turnRoomLightsOff(room);
        if (!err) patchRoomLive(room, { activeRoutine: null });
        return err;
      }),
    );
    setIsPending(false);
    const failed = results.filter((err): err is Error => err !== null);
    if (failed.length > 0) showError(`${failed.length} room${failed.length === 1 ? '' : 's'} failed: ${failed[0]?.message}`);
  };

  const onAllOffClick = () => {
    void handleAllOff();
  };

  return (
    <S.Bar>
      <S.TitleRow>
        <S.Title>Home</S.Title>
        <S.AllOffButton type="button" onClick={onAllOffClick} disabled={isPending}>
          {isPending ? 'Turning off…' : 'All off'}
        </S.AllOffButton>
      </S.TitleRow>
      {error ? <S.Error role="alert">{error}</S.Error> : null}
    </S.Bar>
  );
}
