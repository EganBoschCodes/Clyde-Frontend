'use client';

import { useState } from 'react';

import type { LightState, Pin } from '@/lib/clyde';
import { lightStatus } from '@/lib/lights/lightStatus';
import { useLightControl } from '@/lib/lights/useLightControl';
import { useLightLive, type LightLive } from '@/lib/lights/useLightLive';
import { useLightPin } from '@/lib/lights/useLightPin';
import { useTransientMessage } from '@/lib/ui/useTransientMessage';

import LightSheet from '../LightSheet';
import PowerButton from '../PowerButton';
import { glowStyle } from '../RoomCard/glowStyle';
import { ErrorText } from '../shared/Section';
import * as S from './styles';

interface LightRowProps {
  light: string;
  label: string;
  room: string | null;
  routineName: string | null;
  initialPin: Pin | null;
  initialState: LightState | null;
}

function seedLive(state: LightState | null, pin: Pin | null): LightLive | null {
  if (state) return { on: state.on, rgb: state.rgb_color, brightness: state.brightness };
  if (pin) return { on: pin.on, rgb: pin.rgb_color, brightness: pin.brightness };
  return null;
}

export default function LightRow({ light, label, room, routineName, initialPin, initialState }: LightRowProps) {
  const pin = useLightPin(light, initialPin);
  const { live, applyLocal } = useLightLive(light, seedLive(initialState, initialPin));
  const [error, showError] = useTransientMessage();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const control = useLightControl({ light, room, live, applyLocal, onError: showError });
  const { view } = control;
  const isOn = view.on === true;
  const status = lightStatus({ on: view.on, pin, routineName });

  const openSheet = () => setIsSheetOpen(true);
  const closeSheet = () => setIsSheetOpen(false);
  const handleToggle = () => control.setOn(!isOn);

  return (
    <S.Row $isOn={isOn} style={isOn ? glowStyle(view.rgb) : undefined}>
      <S.Open type="button" aria-haspopup="dialog" aria-label={`${label}, ${status}. Open controls`} onClick={openSheet}>
        <S.Swatch $isOn={isOn} aria-hidden="true" />
        <S.Titles>
          <S.Name>{label}</S.Name>
          <S.Status $isPinned={pin !== null}>{status}</S.Status>
        </S.Titles>
      </S.Open>
      <PowerButton isOn={isOn} isPending={false} label={`${label} light`} isDisabled={false} onToggle={handleToggle} />
      {error && !isSheetOpen ? <S.Error><ErrorText role="alert">{error}</ErrorText></S.Error> : null}
      {isSheetOpen ? (
        <LightSheet
          label={label}
          pin={pin}
          routineName={routineName}
          control={control}
          error={error}
          onClose={closeSheet}
        />
      ) : null}
    </S.Row>
  );
}
