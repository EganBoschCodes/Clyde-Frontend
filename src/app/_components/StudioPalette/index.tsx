'use client';

import { useState, type ChangeEvent } from 'react';

import { QUICK_COLORS, type QuickColor } from '@/lib/studio/quickColors';
import { MAX_COLORS } from '@/lib/studio/types';

import * as S from './styles';

interface StudioPaletteProps {
  colors: readonly string[];
  onChange: (colors: string[]) => void;
}

function swap(colors: readonly string[], a: number, b: number): string[] {
  const next = [...colors];
  const first = next[a];
  const second = next[b];
  if (first === undefined || second === undefined) return next;
  next[a] = second;
  next[b] = first;
  return next;
}

function nextUnusedColor(colors: readonly string[]): string {
  const unused = QUICK_COLORS.find(quick => !colors.includes(quick.hex));
  return (unused ?? QUICK_COLORS[0])?.hex ?? '#ffffff';
}

export default function StudioPalette({ colors, onChange }: StudioPaletteProps) {
  const [selected, setSelected] = useState(0);
  const index = Math.min(selected, Math.max(colors.length - 1, 0));
  const current = colors[index];
  const canAdd = colors.length < MAX_COLORS;

  const setCurrent = (hex: string) => {
    onChange(colors.map((color, i) => (i === index ? hex : color)));
  };

  const handlePick = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrent(e.target.value.toLowerCase());
  };

  const handleAdd = () => {
    onChange([...colors, nextUnusedColor(colors)]);
    setSelected(colors.length);
  };

  const handleRemove = () => {
    onChange(colors.filter((_, i) => i !== index));
    setSelected(Math.max(index - 1, 0));
  };

  const handleMoveLeft = () => {
    if (index === 0) return;
    onChange(swap(colors, index, index - 1));
    setSelected(index - 1);
  };

  const handleMoveRight = () => {
    if (index >= colors.length - 1) return;
    onChange(swap(colors, index, index + 1));
    setSelected(index + 1);
  };

  const renderTile = (color: string, i: number) => (
    <S.Tile
      key={`${i}-${color}`}
      type="button"
      $isSelected={i === index}
      style={{ background: color }}
      aria-pressed={i === index}
      aria-label={`Color ${i + 1} of ${colors.length}, ${color}`}
      onClick={() => setSelected(i)}
    />
  );

  const renderQuick = (quick: QuickColor) => (
    <S.QuickDot
      key={quick.hex}
      type="button"
      style={{ background: quick.hex }}
      aria-label={`Set color ${index + 1} to ${quick.name}`}
      title={quick.name}
      disabled={current === undefined}
      onClick={() => setCurrent(quick.hex)}
    />
  );

  const renderToolbar = (hex: string) => (
    <S.Toolbar>
      <S.PickerLabel>
        <S.PickerInput type="color" value={hex} onChange={handlePick} aria-label={`Custom color ${index + 1}`} />
      </S.PickerLabel>
      <S.Hex>
        {hex}
        <S.HexHint>Color {index + 1} · tap the swatch for any color</S.HexHint>
      </S.Hex>
      <S.IconButton type="button" onClick={handleMoveLeft} disabled={index === 0} aria-label="Move color left">&larr;</S.IconButton>
      <S.IconButton type="button" onClick={handleMoveRight} disabled={index >= colors.length - 1} aria-label="Move color right">&rarr;</S.IconButton>
      <S.DangerIconButton type="button" onClick={handleRemove} disabled={colors.length <= 1} aria-label="Remove color">&times;</S.DangerIconButton>
    </S.Toolbar>
  );

  return (
    <S.Wrap>
      <S.Grid>
        {colors.map(renderTile)}
        {canAdd ? <S.AddTile type="button" onClick={handleAdd} aria-label="Add a color">+</S.AddTile> : null}
      </S.Grid>
      {current ? renderToolbar(current) : null}
      <S.QuickLabel>Quick picks</S.QuickLabel>
      <S.QuickRow>{QUICK_COLORS.map(renderQuick)}</S.QuickRow>
    </S.Wrap>
  );
}
