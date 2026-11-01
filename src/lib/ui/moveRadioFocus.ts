import type { KeyboardEvent } from 'react';

export function moveRadioFocus(e: KeyboardEvent<HTMLElement>): void {
  const forward = e.key === 'ArrowDown' || e.key === 'ArrowRight';
  const backward = e.key === 'ArrowUp' || e.key === 'ArrowLeft';
  if (!forward && !backward) return;
  const radios = [...e.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')];
  const index = radios.indexOf(document.activeElement as HTMLElement);
  if (index === -1) return;
  e.preventDefault();
  const nextIndex = (index + (forward ? 1 : -1) + radios.length) % radios.length;
  radios[nextIndex]?.focus();
}
