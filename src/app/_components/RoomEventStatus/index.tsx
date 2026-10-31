'use client';

import { titleCase } from '@/lib/text/titleCase';
import { useCancelRoomEvents } from '@/lib/rooms/useCancelRoomEvents';

import * as S from './styles';

interface RoomEventStatusProps {
  room: string;
  event: string;
}

export default function RoomEventStatus({ room, event }: RoomEventStatusProps) {
  const { pendingRooms, error, cancelRooms } = useCancelRoomEvents();
  const isPending = pendingRooms.has(room);

  const handleCancel = () => {
    void cancelRooms([room]);
  };

  return (
    <S.Wrap>
      <S.Row>
        <S.Text role="status">
          <S.Name>{titleCase(event)}</S.Name> running
        </S.Text>
        <S.CancelButton type="button" onClick={handleCancel} disabled={isPending}>
          {isPending ? 'Cancelling…' : 'Cancel'}
        </S.CancelButton>
      </S.Row>
      {error ? <S.Error role="alert">{error}</S.Error> : null}
    </S.Wrap>
  );
}
