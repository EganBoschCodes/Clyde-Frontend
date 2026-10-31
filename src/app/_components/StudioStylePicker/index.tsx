import type { ChangeEvent } from 'react';

import { isStudioStyle, STYLE_IDS, STYLE_INFO, type StudioStyle } from '@/lib/studio/types';

import StudioSwatch from '../StudioSwatch';
import * as S from './styles';

interface StudioStylePickerProps {
  value: StudioStyle;
  colors: readonly string[];
  speed: number;
  onChange: (style: StudioStyle) => void;
}

export default function StudioStylePicker({ value, colors, speed, onChange }: StudioStylePickerProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isStudioStyle(e.target.value)) return;
    onChange(e.target.value);
  };

  const renderStyle = (style: StudioStyle) => (
    <S.Tile key={style}>
      <S.Radio type="radio" name="studio-style" value={style} checked={style === value} onChange={handleChange} />
      <S.Face>
        <S.Mini>
          <StudioSwatch colors={colors} style={style} speed={speed} />
        </S.Mini>
        <S.Name>{STYLE_INFO[style].label}</S.Name>
        <S.Blurb>{STYLE_INFO[style].blurb}</S.Blurb>
      </S.Face>
    </S.Tile>
  );

  return (
    <S.Grid role="radiogroup" aria-label="Style">
      {STYLE_IDS.map(renderStyle)}
    </S.Grid>
  );
}
