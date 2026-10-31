'use client';

import { useRunningEvents, type RunningEvent } from '@/lib/realtime/useRunningEvents';
import { useCancelRoomEvents } from '@/lib/rooms/useCancelRoomEvents';
import { titleCase } from '@/lib/text/titleCase';

import * as S from './styles';

export default function EventBanner() {
  const running = useRunningEvents();
  const { pendingRooms, error, cancelRooms } = useCancelRoomEvents();

  if (running.length === 0) return null;

  const handleCancelAll = () => {
    void cancelRooms(running.map(r => r.room));
  };

  const renderEvent = (item: RunningEvent) => {
    const handleCancel = () => {
      void cancelRooms([item.room]);
    };
    const isPending = pendingRooms.has(item.room);
    return (
      <S.Item key={item.room}>
        <S.ItemText>
          <S.Strong>{titleCase(item.event)}</S.Strong> in {item.roomLabel}
        </S.ItemText>
        <S.CancelButton type="button" onClick={handleCancel} disabled={isPending}>
          {isPending ? 'Cancelling…' : 'Cancel'}
        </S.CancelButton>
      </S.Item>
    );
  };

  return (
    <S.Banner role="region" aria-label="Running events">
      <S.Items>{running.map(renderEvent)}</S.Items>
      {running.length > 1 ? (
        <S.CancelAll type="button" onClick={handleCancelAll}>
          Cancel all
        </S.CancelAll>
      ) : null}
      {error ? <S.Error role="alert">{error}</S.Error> : null}
    </S.Banner>
  );
}
