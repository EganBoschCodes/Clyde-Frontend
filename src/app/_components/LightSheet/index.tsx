'use client';

import type { Pin } from '@/lib/clyde';
import type { LightControl } from '@/lib/lights/useLightControl';
import { lightStatus } from '@/lib/lights/lightStatus';

import { glowStyle } from '../RoomCard/glowStyle';
import DimControl from '../DimControl';
import LightColorPicker from '../LightColorPicker';
import PowerButton from '../PowerButton';
import { Button } from '../shared/Control';
import Sheet from '../shared/Sheet';
import { ErrorText } from '../shared/Section';
import * as S from './styles';

const FULL_BRIGHTNESS = 255;

interface LightSheetProps {
  label: string;
  pin: Pin | null;
  routineName: string | null;
  control: LightControl;
  error: string | null;
  onClose: () => void;
}

function helperText(pin: Pin | null, routineName: string | null): string {
  if (pin && routineName) return `Pinned. ${routineName} keeps running on the other lights.`;
  if (pin) return 'Pinned. This light holds its own setting.';
  if (routineName) return `Changing this light takes it out of ${routineName}. The other lights keep going.`;
  return 'Changing this light pins it so it holds this setting.';
}

export default function LightSheet({ label, pin, routineName, control, error, onClose }: LightSheetProps) {
  const { view } = control;
  const isOn = view.on === true;
  const fraction = (view.brightness ?? FULL_BRIGHTNESS) / FULL_BRIGHTNESS;
  const status = lightStatus({ on: view.on, pin, routineName });
  const releaseLabel = routineName ? `Rejoin ${routineName}` : 'Unpin';

  const handleToggle = () => control.setOn(!isOn);

  return (
    <Sheet title={label} onClose={onClose}>
      <S.Content style={glowStyle(view.rgb)}>
        <S.PowerRow>
          <S.PowerText>
            <S.PowerTitle>{isOn ? 'On' : 'Off'}</S.PowerTitle>
            <S.PowerStatus>{status}</S.PowerStatus>
          </S.PowerText>
          <PowerButton
            isOn={isOn}
            isPending={false}
            label={`${label} light`}
            isDisabled={false}
            onToggle={handleToggle}
          />
        </S.PowerRow>
        <DimControl
          value={fraction}
          label={`${label} brightness`}
          isOn={isOn}
          onChange={control.changeBrightness}
          onCancel={control.cancelBrightness}
        />
        <LightColorPicker rgb={view.rgb} label={`${label} color`} onChange={control.changeColor} />
        <S.PinBox>
          <S.PinText>{helperText(pin, routineName)}</S.PinText>
          {pin ? (
            <Button type="button" onClick={control.release} disabled={control.isReleasing}>
              {control.isReleasing ? 'Releasing…' : releaseLabel}
            </Button>
          ) : null}
        </S.PinBox>
        {error ? <ErrorText role="alert">{error}</ErrorText> : null}
      </S.Content>
    </Sheet>
  );
}
