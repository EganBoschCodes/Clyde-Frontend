'use client';

import { useId, type ChangeEvent } from 'react';

import type { Rgb } from '@/lib/realtime/glowColor';
import { hexToRgb, rgbToHex } from '@/lib/lights/colorHex';
import { COLORS, WHITES, type LightColor } from '@/lib/lights/quickLightColors';
import { moveRadioFocus } from '@/lib/ui/moveRadioFocus';

import * as S from './styles';

const PICKER_FALLBACK: Rgb = [255, 255, 255];

interface LightColorPickerProps {
  rgb: Rgb | null;
  label: string;
  onChange: (rgb: Rgb, isFinal: boolean) => void;
}

function isSameColor(a: Rgb | null, b: Rgb): boolean {
  if (!a) return false;
  return Math.round(a[0]) === b[0] && Math.round(a[1]) === b[1] && Math.round(a[2]) === b[2];
}

export default function LightColorPicker({ rgb, label, onChange }: LightColorPickerProps) {
  const id = useId();

  const handleCustom = (e: ChangeEvent<HTMLInputElement>) => {
    const next = hexToRgb(e.target.value);
    if (next) onChange(next, false);
  };

  const renderDot = (color: LightColor) => {
    const isSelected = isSameColor(rgb, color.rgb);
    const handleClick = () => onChange(color.rgb, true);
    return (
      <S.Dot
        key={color.name}
        type="button"
        role="radio"
        aria-checked={isSelected}
        aria-label={`${label}: ${color.name}`}
        title={color.name}
        $isSelected={isSelected}
        style={{ background: rgbToHex(color.rgb) }}
        onClick={handleClick}
      />
    );
  };

  return (
    <S.Wrap>
      <S.GroupTitle id={`${id}-whites`}>Whites</S.GroupTitle>
      <S.Dots role="radiogroup" aria-labelledby={`${id}-whites`} onKeyDown={moveRadioFocus}>
        {WHITES.map(renderDot)}
      </S.Dots>
      <S.GroupTitle id={`${id}-colors`}>Colors</S.GroupTitle>
      <S.Dots role="radiogroup" aria-labelledby={`${id}-colors`} onKeyDown={moveRadioFocus}>
        {COLORS.map(renderDot)}
        <S.CustomLabel>
          <S.CustomInput
            type="color"
            value={rgbToHex(rgb ?? PICKER_FALLBACK)}
            onChange={handleCustom}
            aria-label={`${label}: custom color`}
          />
        </S.CustomLabel>
      </S.Dots>
      <S.Hint>Tap the rainbow circle for any color.</S.Hint>
    </S.Wrap>
  );
}
