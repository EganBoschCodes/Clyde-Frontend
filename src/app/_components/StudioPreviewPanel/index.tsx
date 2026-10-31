import type { StudioRoomOption } from '@/lib/studio/types';

import { Button } from '../shared/Control';
import { ErrorText, SectionHeading } from '../shared/Section';
import StudioRoomPicker from '../StudioRoomPicker';
import * as S from './styles';

interface StudioPreviewPanelProps {
  rooms: readonly StudioRoomOption[];
  room: string;
  isOn: boolean;
  isValid: boolean;
  error: string | null;
  onRoomChange: (room: string) => void;
  onStart: () => void;
  onStop: () => void;
}

export default function StudioPreviewPanel({ rooms, room, isOn, isValid, error, onRoomChange, onStart, onStop }: StudioPreviewPanelProps) {
  const roomName = rooms.find(r => r.name === room)?.label ?? room;

  const renderAction = () => {
    if (isOn) {
      return (
        <S.Status role="status">
          <S.Live>
            <S.LiveDot />
            Previewing in {roomName}
          </S.Live>
          <Button type="button" $tone="danger" onClick={onStop}>Stop</Button>
        </S.Status>
      );
    }
    return (
      <Button type="button" onClick={onStart} disabled={!isValid || rooms.length === 0}>
        Preview in {roomName || 'room'}
      </Button>
    );
  };

  return (
    <S.Panel>
      <SectionHeading>Try it on the lights</SectionHeading>
      <StudioRoomPicker name="studio-preview-room" label="Preview room" rooms={rooms} value={room} onChange={onRoomChange} />
      {renderAction()}
      {isOn ? <S.Hint>Changes update the room live. Nothing is saved until you hit Save.</S.Hint> : null}
      {error ? <ErrorText role="alert">Preview failed: {error}</ErrorText> : null}
    </S.Panel>
  );
}
