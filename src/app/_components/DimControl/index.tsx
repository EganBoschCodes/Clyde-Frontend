'use client';

import { useRef } from 'react';

import * as S from './styles';

const DIM_MIN = 0.01;
const DIM_MAX = 1;
const DIM_PRECISION = 100;
const KEY_STEP = 0.05;
const KEY_PAGE_STEP = 0.1;
const DRAG_THRESHOLD_PX = 6;
const PRESETS = [0.05, 0.2, 0.5, 1] as const;

interface DimControlProps {
  value: number;
  label: string;
  isOn: boolean;
  onChange: (next: number, isFinal: boolean) => void;
  onCancel: (original: number) => void;
}

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  startValue: number;
  isDragging: boolean;
}

function clampDim(value: number): number {
  const rounded = Math.round(value * DIM_PRECISION) / DIM_PRECISION;
  return Math.min(DIM_MAX, Math.max(DIM_MIN, rounded));
}

function toPercent(value: number): number {
  return Math.round(value * 100);
}

function keyboardTarget(key: string, value: number): number | null {
  switch (key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      return clampDim(value - KEY_STEP);
    case 'ArrowRight':
    case 'ArrowUp':
      return clampDim(value + KEY_STEP);
    case 'PageDown':
      return clampDim(value - KEY_PAGE_STEP);
    case 'PageUp':
      return clampDim(value + KEY_PAGE_STEP);
    case 'Home':
      return DIM_MIN;
    case 'End':
      return DIM_MAX;
    default:
      return null;
  }
}

export default function DimControl({ value, label, isOn, onChange, onCancel }: DimControlProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const trackWidth = (): number => trackRef.current?.getBoundingClientRect().width ?? 0;

  const valueAtClientX = (clientX: number): number => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return value;
    return clampDim((clientX - rect.left) / rect.width);
  };

  const beginDrag = (e: React.PointerEvent<HTMLDivElement>, drag: DragState) => {
    drag.isDragging = true;
    drag.startX = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag: DragState = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startValue: value,
      isDragging: false,
    };
    dragRef.current = drag;
    if (e.pointerType === 'touch') return;

    // Mouse and pen are precise, so a press may set the value directly
    const target = valueAtClientX(e.clientX);
    drag.startValue = target;
    beginDrag(e, drag);
    onChange(target, false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    if (!drag.isDragging) {
      const dx = Math.abs(e.clientX - drag.startX);
      const dy = Math.abs(e.clientY - drag.startY);
      if (dx < DRAG_THRESHOLD_PX || dx <= dy) return;
      beginDrag(e, drag);
    }
    const width = trackWidth();
    if (width === 0) return;
    onChange(clampDim(drag.startValue + (e.clientX - drag.startX) / width), false);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    if (!drag.isDragging) return;
    const width = trackWidth();
    const final = width === 0 ? drag.startValue : clampDim(drag.startValue + (e.clientX - drag.startX) / width);
    onChange(final, true);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    if (drag.isDragging) onCancel(drag.startValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const next = keyboardTarget(e.key, value);
    if (next === null) return;
    e.preventDefault();
    onChange(next, true);
  };

  const percent = toPercent(value);

  const renderPreset = (target: number) => {
    const handleClick = () => onChange(target, true);
    return (
      <S.PresetButton
        key={target}
        type="button"
        $active={isOn && toPercent(target) === percent}
        onClick={handleClick}
        aria-label={`Set ${label} to ${toPercent(target)} percent`}
      >
        {toPercent(target)}%
      </S.PresetButton>
    );
  };

  const readoutValue = isOn ? `${percent}%` : 'Off';
  const clip = `inset(0 ${100 - percent}% 0 0)`;

  return (
    <S.Container>
      <S.Track
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={toPercent(DIM_MIN)}
        aria-valuemax={toPercent(DIM_MAX)}
        aria-valuenow={percent}
        aria-valuetext={isOn ? `${percent}%` : `Off, ${percent}% when on`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onKeyDown={handleKeyDown}
      >
        <S.Fill $isOn={isOn} style={{ width: `${percent}%` }} />
        <S.Readout $tone="base" aria-hidden="true">
          <S.ReadoutLabel>Brightness</S.ReadoutLabel>
          <S.ReadoutValue>{readoutValue}</S.ReadoutValue>
        </S.Readout>
        <S.Readout $tone="ink" $isOn={isOn} style={{ clipPath: clip }} aria-hidden="true">
          <S.ReadoutLabel>Brightness</S.ReadoutLabel>
          <S.ReadoutValue>{readoutValue}</S.ReadoutValue>
        </S.Readout>
      </S.Track>
      <S.Presets>{PRESETS.map(renderPreset)}</S.Presets>
    </S.Container>
  );
}
