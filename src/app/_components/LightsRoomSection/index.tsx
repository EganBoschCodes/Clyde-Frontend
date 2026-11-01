'use client';

import type { LightState, Pin, RoutineInfo } from '@/lib/clyde';
import { useRoomLive } from '@/lib/realtime/useRoomLive';
import { routineLabel } from '@/lib/rooms/routineLabel';
import { titleCase } from '@/lib/text/titleCase';

import LightRow from '../LightRow';
import { Section, SectionHeading } from '../shared/Section';
import * as S from './styles';

export interface RoomLight {
  name: string;
  pin: Pin | null;
  state: LightState | null;
}

interface LightsRoomSectionProps {
  room: string | null;
  label: string;
  lights: RoomLight[];
  routines: readonly RoutineInfo[];
  activeRoutine: string | null;
}

export default function LightsRoomSection({ room, label, lights, routines, activeRoutine }: LightsRoomSectionProps) {
  const live = useRoomLive(room ?? '');
  const routineKey = room !== null && live.activeRoutine !== undefined ? live.activeRoutine : activeRoutine;
  const info = routines.find(r => r.name === routineKey);
  const routineName = routineKey ? (info ? routineLabel(info) : titleCase(routineKey)) : null;

  const renderLight = (light: RoomLight) => (
    <LightRow
      key={light.name}
      light={light.name}
      label={titleCase(light.name)}
      room={room}
      routineName={routineName}
      initialPin={light.pin}
      initialState={light.state}
    />
  );

  return (
    <Section>
      <SectionHeading>{label}</SectionHeading>
      <S.Grid>{lights.map(renderLight)}</S.Grid>
    </Section>
  );
}
