import { MAX_NAME_LENGTH } from './types';

const SUFFIX = ' copy';

export function copyName(name: string): string {
  const room = MAX_NAME_LENGTH - SUFFIX.length;
  return `${name.slice(0, room).trimEnd()}${SUFFIX}`;
}
