'use client';

import { useRef } from 'react';

import * as S from './styles';

const DIM_MIN = 0;
const DIM_MAX = 1;
const DIM_PRECISION = 100;
const KEY_STEP = 0.05;
const KEY_PAGE_STEP = 0.1;
const NUDGE_STEP = 0.1;
const DRAG_THRESHOLD_PX = 6;
const PRESETS = [0.25, 0.5, 0.75, 1] as const;

interface DimControlProps {
  value: number;
  label: string;
  onChange: (next: number) => void;
  onActiveChange: (isActive: boolean) => void;
}

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  isDragging: boolean;
}

function clampDim(value: number): number {
  const rounded = Math.round(value * DIM_PRECISION) / DIM_PRECISION;
  return Math.min(DIM_MAX, Math.max(DIM_MIN, rounded));
}

function toPercent(value: number): number {
  return Math.round(value * 100);
}

export default function DimControl({ value, label, onChange, onActiveChange }: DimControlProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const valueFromClientX = (clientX: number): number => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return value;
    return clampDim((clientX - rect.left) / rect.width);
  };

  const beginDrag = (e: React.PointerEvent<HTMLDivElement>, drag: DragState) => {
    drag.isDragging = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    onActiveChange(true);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag: DragState = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      isDragging: false,
    };
    dragRef.current = drag;
    if (e.pointerType !== 'touch') {
      beginDrag(e, drag);
      onChange(valueFromClientX(e.clientX));
    }
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
    onChange(valueFromClientX(e.clientX));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    if (!drag.isDragging) onChange(valueFromClientX(e.clientX));
    onActiveChange(false);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    if (drag.isDragging) onActiveChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const next = keyboardTarget(e.key, value);
    if (next === null) return;
    e.preventDefault();
    onChange(next);
  };

  const nudge = (delta: number) => () => onChange(clampDim(value + delta));
  const preset = (target: number) => () => onChange(target);

  const percent = toPercent(value);

  const renderPreset = (target: number) => (
    <S.StepButton
      key={target}
      type="button"
      $active={toPercent(target) === percent}
      onClick={preset(target)}
      aria-label={`Set ${label} to ${toPercent(target)} percent`}
    >
      {toPercent(target)}
    </S.StepButton>
  );

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
        aria-valuetext={`${percent}%`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onKeyDown={handleKeyDown}
      >
        <S.Fill style={{ width: `${percent}%` }} />
        <S.Readout>
          <S.ReadoutLabel>Brightness</S.ReadoutLabel>
          <S.ReadoutValue>{percent}%</S.ReadoutValue>
        </S.Readout>
      </S.Track>
      <S.Buttons>
        <S.StepButton
          type="button"
          onClick={nudge(-NUDGE_STEP)}
          disabled={value <= DIM_MIN}
          aria-label={`Decrease ${label}`}
        >
          −
        </S.StepButton>
        {PRESETS.map(renderPreset)}
        <S.StepButton
          type="button"
          onClick={nudge(NUDGE_STEP)}
          disabled={value >= DIM_MAX}
          aria-label={`Increase ${label}`}
        >
          +
        </S.StepButton>
      </S.Buttons>
    </S.Container>
  );
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
