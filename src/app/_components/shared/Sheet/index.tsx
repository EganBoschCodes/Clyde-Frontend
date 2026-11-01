'use client';

import { useEffect, useId, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import * as S from './styles';

const FOCUSABLE = 'button:not(:disabled), input:not(:disabled), [href], [tabindex]:not([tabindex="-1"])';
const INITIAL_FOCUS = '[data-autofocus], [aria-checked="true"]';
const CLOSE_DISTANCE_RATIO = 0.3;
const FLICK_MIN_DISTANCE_PX = 30;
const FLICK_VELOCITY_PX_PER_MS = 0.6;
const MIN_BACKDROP_OPACITY = 0.3;
const SETTLE_MS = 180;
const DISMISS_MS = 160;

interface DragState {
  pointerId: number;
  startY: number;
  startedAt: number;
  distance: number;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface SheetProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Sheet({ title, onClose, children }: SheetProps) {
  const titleId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const sheet = sheetRef.current;
    const preferred = sheet?.querySelector<HTMLElement>(INITIAL_FOCUS);
    const first = sheet?.querySelector<HTMLElement>(FOCUSABLE);
    (preferred ?? first)?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !sheet) return;
      const items = [...sheet.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const head = items[0];
      const tail = items[items.length - 1];
      if (!head || !tail) return;
      if (e.shiftKey && document.activeElement === head) {
        e.preventDefault();
        tail.focus();
        return;
      }
      if (!e.shiftKey && document.activeElement === tail) {
        e.preventDefault();
        head.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, []);

  const showDrag = (distance: number, transition: string) => {
    const sheet = sheetRef.current;
    const backdrop = backdropRef.current;
    if (!sheet || !backdrop) return;
    const progress = Math.min(distance / Math.max(sheet.offsetHeight, 1), 1);
    sheet.style.transition = transition;
    sheet.style.transform = distance > 0 ? `translateY(${distance}px)` : '';
    backdrop.style.transition = transition === 'none' ? 'none' : `opacity ${SETTLE_MS}ms ease`;
    backdrop.style.opacity = String(1 - progress * (1 - MIN_BACKDROP_OPACITY));
  };

  const settle = () => {
    if (prefersReducedMotion()) {
      showDrag(0, 'none');
      return;
    }
    showDrag(0, `transform ${SETTLE_MS}ms ease-out`);
  };

  const dismiss = () => {
    const sheet = sheetRef.current;
    if (!sheet || prefersReducedMotion()) {
      onCloseRef.current();
      return;
    }
    showDrag(sheet.offsetHeight, `transform ${DISMISS_MS}ms ease-in`);
    if (backdropRef.current) backdropRef.current.style.opacity = '0';
    dismissTimer.current = setTimeout(() => onCloseRef.current(), DISMISS_MS);
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragRef.current = { pointerId: e.pointerId, startY: e.clientY, startedAt: performance.now(), distance: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    drag.distance = Math.max(0, e.clientY - drag.startY);
    showDrag(drag.distance, 'none');
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    const height = sheetRef.current?.offsetHeight ?? 0;
    const elapsed = Math.max(performance.now() - drag.startedAt, 1);
    const isFarEnough = drag.distance > height * CLOSE_DISTANCE_RATIO;
    const isFlick = drag.distance > FLICK_MIN_DISTANCE_PX && drag.distance / elapsed > FLICK_VELOCITY_PX_PER_MS;
    if (isFarEnough || isFlick) {
      dismiss();
      return;
    }
    settle();
  };

  const handlePointerCancel = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    settle();
  };

  return createPortal(
    <S.Backdrop ref={backdropRef} onClick={onClose}>
      <S.Sheet
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={event => event.stopPropagation()}
      >
        <S.DragZone
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <S.Handle aria-hidden="true" />
          <S.Header>
            <S.Title id={titleId}>{title}</S.Title>
          </S.Header>
        </S.DragZone>
        <S.Body>{children}</S.Body>
        <S.HiddenClose type="button" onClick={onClose}>
          Close
        </S.HiddenClose>
      </S.Sheet>
    </S.Backdrop>,
    document.body,
  );
}
