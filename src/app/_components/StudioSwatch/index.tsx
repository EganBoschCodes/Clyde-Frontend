import { animationSeconds } from '@/lib/studio/animationSeconds';
import type { StudioStyle } from '@/lib/studio/types';

import * as S from './styles';

interface StudioSwatchProps {
  colors: readonly string[];
  style: StudioStyle;
  speed: number;
  brightness?: number;
}

const CHASE_VISIBLE_DOTS = 6;
const MAX_BRIGHTNESS = 255;
const MIN_VISIBLE = 0.35;

function gradientFor(colors: readonly string[]): string {
  const first = colors[0] ?? '#000000';
  return `linear-gradient(90deg, ${[...colors, first].join(', ')})`;
}

function renderCell(color: string, index: number) {
  return <S.StaticCell key={`${index}-${color}`} style={{ background: color }} />;
}

function renderDot(color: string, index: number) {
  return (
    <S.DotSlot key={`${index}-${color}`}>
      <S.Dot style={{ background: color, boxShadow: `0 0 14px ${color}` }} />
    </S.DotSlot>
  );
}

function renderDrift(colors: readonly string[], seconds: number) {
  return <S.Fill $seconds={seconds} $isStyle="drift" style={{ backgroundImage: gradientFor(colors) }} />;
}

function renderPulse(colors: readonly string[], seconds: number) {
  return (
    <S.PulseLayer $seconds={seconds}>
      <S.Fill $seconds={seconds} $isStyle="pulse" style={{ backgroundImage: gradientFor(colors) }} />
    </S.PulseLayer>
  );
}

function renderFlicker(colors: readonly string[], seconds: number) {
  const renderFlickerCell = (color: string, index: number) => (
    <S.FlickerCell
      key={`${index}-${color}`}
      $seconds={seconds * (1 + (index % 3) * 0.37)}
      $delay={-index * 0.41}
      style={{ background: color }}
    />
  );
  return <S.Cells>{colors.map(renderFlickerCell)}</S.Cells>;
}

function renderChase(colors: readonly string[], seconds: number) {
  const period = colors.length * Math.ceil(CHASE_VISIBLE_DOTS / colors.length);
  const dots = Array.from({ length: period * 2 }, (_, i) => colors[i % colors.length] ?? '#000000');
  const widthPercent = (dots.length / CHASE_VISIBLE_DOTS) * 100;
  return (
    <S.Track $width={widthPercent} $seconds={seconds} $steps={period}>
      {dots.map(renderDot)}
    </S.Track>
  );
}

function renderStyle(style: StudioStyle, colors: readonly string[], seconds: number) {
  switch (style) {
    case 'drift': return renderDrift(colors, seconds);
    case 'flicker': return renderFlicker(colors, seconds);
    case 'pulse': return renderPulse(colors, seconds);
    case 'chase': return renderChase(colors, seconds);
    case 'static': return <S.Cells>{colors.map(renderCell)}</S.Cells>;
    default: {
      const _exhaustive: never = style;
      throw new Error(`Unknown style: ${_exhaustive}`);
    }
  }
}

export default function StudioSwatch({ colors, style, speed, brightness = MAX_BRIGHTNESS }: StudioSwatchProps) {
  if (colors.length === 0) return <S.Frame aria-hidden="true" />;

  const seconds = animationSeconds(style, speed);
  const level = MIN_VISIBLE + (1 - MIN_VISIBLE) * (brightness / MAX_BRIGHTNESS);

  return (
    <S.Frame aria-hidden="true" style={{ filter: `brightness(${level})` }}>
      {renderStyle(style, colors, seconds)}
    </S.Frame>
  );
}
