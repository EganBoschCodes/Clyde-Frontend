import { useId, type ChangeEvent, type CSSProperties } from 'react';

import * as S from './styles';

interface StudioSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  readout: string;
  lowLabel: string;
  highLabel: string;
  onChange: (value: number) => void;
}

export default function StudioSlider({ label, value, min, max, step, readout, lowLabel, highLabel, onChange }: StudioSliderProps) {
  const id = useId();
  const percent = ((value - min) / (max - min)) * 100;
  const fill = { '--pct': `${percent}%` } as CSSProperties;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <S.Wrap>
      <S.Top>
        <S.Label htmlFor={id}>{label}</S.Label>
        <S.Readout htmlFor={id}>{readout}</S.Readout>
      </S.Top>
      <S.Range id={id} type="range" min={min} max={max} step={step} value={value} onChange={handleChange} style={fill} />
      <S.Ends aria-hidden="true">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </S.Ends>
    </S.Wrap>
  );
}
