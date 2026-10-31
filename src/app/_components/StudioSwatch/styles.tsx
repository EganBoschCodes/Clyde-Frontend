import styled, { css, keyframes } from 'styled-components';

import { theme } from '@/styles/theme';

const driftShift = keyframes`
  from { background-position: 0% 0; }
  to { background-position: 200% 0; }
`;

const flickerJitter = keyframes`
  0%, 100% { opacity: 0.95; }
  8% { opacity: 0.45; }
  14% { opacity: 1; }
  27% { opacity: 0.6; }
  35% { opacity: 0.9; }
  52% { opacity: 0.35; }
  58% { opacity: 0.85; }
  74% { opacity: 0.55; }
  86% { opacity: 1; }
`;

const pulseBreath = keyframes`
  0%, 100% { filter: brightness(0.35); }
  50% { filter: brightness(1.1); }
`;

const chaseSlide = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const reducedMotion = css`
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Frame = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 24px;
  overflow: hidden;
  border-radius: inherit;
  background: ${theme.colors.surfaceTrack};
  isolation: isolate;
`;

export const Fill = styled.div<{ $seconds: number; $isStyle: 'drift' | 'pulse' }>`
  position: absolute;
  inset: 0;
  background-repeat: repeat-x;
  background-size: 200% 100%;
  animation: ${driftShift} ${({ $seconds, $isStyle }) => ($isStyle === 'drift' ? $seconds : $seconds * 6)}s linear infinite;
  ${reducedMotion}
`;

export const PulseLayer = styled.div<{ $seconds: number }>`
  position: absolute;
  inset: 0;
  animation: ${pulseBreath} ${({ $seconds }) => $seconds}s ease-in-out infinite;
  ${reducedMotion}
`;

export const Cells = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
`;

export const FlickerCell = styled.div<{ $seconds: number; $delay: number }>`
  flex: 1;
  animation: ${flickerJitter} ${({ $seconds }) => $seconds}s steps(1, end) infinite;
  animation-delay: ${({ $delay }) => $delay}s;
  ${reducedMotion}
`;

export const StaticCell = styled.div`
  flex: 1;
`;

export const Track = styled.div<{ $width: number; $seconds: number; $steps: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: ${({ $width }) => $width}%;
  display: flex;
  animation: ${chaseSlide} ${({ $seconds, $steps }) => $seconds * $steps}s steps(${({ $steps }) => $steps}, end) infinite;
  ${reducedMotion}
`;

export const DotSlot = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Dot = styled.div`
  height: 62%;
  max-height: 44px;
  aspect-ratio: 1;
  border-radius: 50%;
`;
