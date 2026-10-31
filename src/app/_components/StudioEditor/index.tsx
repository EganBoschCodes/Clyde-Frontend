'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';

import { findNameCollision } from '@/lib/studio/findNameCollision';
import { saveStudioRoutine } from '@/lib/studio/saveStudioRoutine';
import {
  MAX_BRIGHTNESS,
  MAX_NAME_LENGTH,
  MIN_BRIGHTNESS,
  type StudioRoomOption,
  type StudioRoutine,
  type StudioSpec,
  type StudioStyle,
} from '@/lib/studio/types';
import { useStudioPreview } from '@/lib/studio/useStudioPreview';
import { hasProblems, validateSpec } from '@/lib/studio/validateSpec';

import { Button } from '../shared/Control';
import { ErrorText, Section, SectionHeading } from '../shared/Section';
import StudioPalette from '../StudioPalette';
import StudioPreviewPanel from '../StudioPreviewPanel';
import StudioSavedPanel from '../StudioSavedPanel';
import StudioSlider from '../StudioSlider';
import StudioStylePicker from '../StudioStylePicker';
import StudioSwatch from '../StudioSwatch';
import * as S from './styles';

interface StudioEditorProps {
  initial: StudioSpec;
  editingKey: string | null;
  existing: StudioRoutine[];
  rooms: StudioRoomOption[];
}

function speedWord(speed: number): string {
  if (speed < 0.25) return 'Chill';
  if (speed < 0.5) return 'Easy';
  if (speed < 0.75) return 'Lively';
  return 'Frantic';
}

function normalize(spec: StudioSpec): StudioSpec {
  return { ...spec, name: spec.name.trim() };
}

export default function StudioEditor({ initial, editingKey, existing, rooms }: StudioEditorProps) {
  const [spec, setSpec] = useState<StudioSpec>(initial);
  const [savedKey, setSavedKey] = useState<string | null>(editingKey);
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showProblems, setShowProblems] = useState(false);

  const problems = validateSpec(spec);
  const isValid = !hasProblems(problems);
  const preview = useStudioPreview(spec, isValid, rooms[0]?.name ?? '');
  const collision = findNameCollision(spec.name, savedKey, existing);
  const isJustSaved = savedKey !== null && savedSnapshot === JSON.stringify(normalize(spec));

  const update = (patch: Partial<StudioSpec>) => {
    setSpec(current => ({ ...current, ...patch }));
  };

  const handleName = (e: ChangeEvent<HTMLInputElement>) => update({ name: e.target.value });
  const handleColors = (colors: string[]) => update({ colors });
  const handleStyle = (style: StudioStyle) => update({ style });
  const handleSpeed = (speed: number) => update({ speed });
  const handleBrightness = (brightness: number) => update({ brightness });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setShowProblems(true);
    if (!isValid) return;

    setIsSaving(true);
    setSaveError(null);
    const clean = normalize(spec);
    const [saved, error] = await saveStudioRoutine(clean, savedKey);
    setIsSaving(false);
    if (error) {
      setSaveError(error.message);
      return;
    }
    setSavedKey(saved.key);
    setSavedSnapshot(JSON.stringify(clean));
  };

  const handlePlay = (room: string) => {
    if (!preview.isOn) return;
    if (room === preview.room) preview.detach();
    else preview.stop();
  };

  const saveLabel = (): string => {
    if (isSaving) return 'Saving...';
    if (collision) return `Replace "${collision.name}"`;
    return savedKey ? 'Save changes' : 'Save routine';
  };

  const renderSaved = () => {
    if (!isJustSaved || !savedKey) return null;
    return <StudioSavedPanel key={savedSnapshot} routineKey={savedKey} name={spec.name.trim()} rooms={rooms} onPlay={handlePlay} />;
  };

  return (
    <S.Form onSubmit={handleSubmit} noValidate>
      <S.StripWrap>
        <S.Strip>
          <StudioSwatch colors={spec.colors} style={spec.style} speed={spec.speed} brightness={spec.brightness} />
        </S.Strip>
      </S.StripWrap>

      <Section>
        <S.FieldHead>
          <SectionHeading as="label" htmlFor="studio-name">Name</SectionHeading>
          <S.Count>{spec.name.trim().length}/{MAX_NAME_LENGTH}</S.Count>
        </S.FieldHead>
        <S.NameInput
          id="studio-name"
          type="text"
          value={spec.name}
          onChange={handleName}
          placeholder="Movie night"
          autoComplete="off"
          enterKeyHint="done"
          aria-invalid={showProblems && problems.name !== null}
          $hasError={showProblems && problems.name !== null}
        />
        {showProblems && problems.name ? <ErrorText role="alert">{problems.name}</ErrorText> : null}
        {collision ? <S.Warning role="status">You already have a routine named &ldquo;{collision.name}&rdquo;. Saving will replace it.</S.Warning> : null}
      </Section>

      <Section>
        <SectionHeading>Colors</SectionHeading>
        <StudioPalette colors={spec.colors} onChange={handleColors} />
        {showProblems && problems.colors ? <ErrorText role="alert">{problems.colors}</ErrorText> : null}
      </Section>

      <Section>
        <SectionHeading>Style</SectionHeading>
        <StudioStylePicker value={spec.style} colors={spec.colors} speed={spec.speed} onChange={handleStyle} />
      </Section>

      <Section>
        <StudioSlider
          label="Speed"
          value={spec.speed}
          min={0}
          max={1}
          step={0.01}
          readout={speedWord(spec.speed)}
          lowLabel="Chill"
          highLabel="Frantic"
          onChange={handleSpeed}
        />
        <StudioSlider
          label="Brightness"
          value={spec.brightness}
          min={MIN_BRIGHTNESS}
          max={MAX_BRIGHTNESS}
          step={1}
          readout={`${Math.round((spec.brightness / MAX_BRIGHTNESS) * 100)}%`}
          lowLabel="Dim"
          highLabel="Full"
          onChange={handleBrightness}
        />
      </Section>

      <StudioPreviewPanel
        rooms={rooms}
        room={preview.room}
        isOn={preview.isOn}
        isValid={isValid}
        error={preview.error}
        onRoomChange={preview.setRoom}
        onStart={preview.start}
        onStop={preview.stop}
      />

      <S.Actions>
        {saveError ? <ErrorText role="alert">Could not save: {saveError}</ErrorText> : null}
        <Button type="submit" $tone="primary" disabled={isSaving}>{saveLabel()}</Button>
        {renderSaved()}
      </S.Actions>
    </S.Form>
  );
}
