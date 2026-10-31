import { MAX_COLORS, MAX_NAME_LENGTH, type StudioSpec } from './types';

export interface SpecProblems {
  name: string | null;
  colors: string | null;
}

export function validateSpec(spec: StudioSpec): SpecProblems {
  const name = spec.name.trim();
  const problems: SpecProblems = { name: null, colors: null };

  if (name.length === 0) problems.name = 'Give your routine a name.';
  else if (name.length > MAX_NAME_LENGTH) problems.name = `Names can be at most ${MAX_NAME_LENGTH} characters.`;

  if (spec.colors.length < 1) problems.colors = 'Add at least one color.';
  else if (spec.colors.length > MAX_COLORS) problems.colors = `Use at most ${MAX_COLORS} colors.`;

  return problems;
}

export function hasProblems(problems: SpecProblems): boolean {
  return problems.name !== null || problems.colors !== null;
}
