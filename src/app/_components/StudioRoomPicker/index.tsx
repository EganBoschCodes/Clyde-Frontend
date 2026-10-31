import type { ChangeEvent } from 'react';

import type { StudioRoomOption } from '@/lib/studio/types';

import * as S from './styles';

interface StudioRoomPickerProps {
  name: string;
  label: string;
  rooms: readonly StudioRoomOption[];
  value: string;
  onChange: (room: string) => void;
}

export default function StudioRoomPicker({ name, label, rooms, value, onChange }: StudioRoomPickerProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const renderRoom = (room: StudioRoomOption) => (
    <S.Option key={room.name}>
      <S.Radio type="radio" name={name} value={room.name} checked={room.name === value} onChange={handleChange} />
      <S.Face>{room.label}</S.Face>
    </S.Option>
  );

  return (
    <S.Group role="radiogroup" aria-label={label}>
      {rooms.map(renderRoom)}
    </S.Group>
  );
}
