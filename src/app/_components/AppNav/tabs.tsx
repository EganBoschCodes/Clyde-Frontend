import type { ReactNode } from 'react';

export interface Tab {
  href: string;
  label: string;
  icon: ReactNode;
}

const ICON_PROPS = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

const HOME_ICON = (
  <svg {...ICON_PROPS}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 10v9.5h13V10" />
    <path d="M10 19.5v-5h4v5" />
  </svg>
);

const STUDIO_ICON = (
  <svg {...ICON_PROPS}>
    <path d="M4 20l1.2-4.2L15.8 5.2a2.1 2.1 0 0 1 3 3L8.2 18.8z" />
    <path d="M14 7l3 3" />
    <path d="M12.5 20h7.5" />
  </svg>
);

const SCHEDULES_ICON = (
  <svg {...ICON_PROPS}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

const PARTY_ICON = (
  <svg {...ICON_PROPS}>
    <path d="M12 3.5l1.9 4.6 4.6 1.9-4.6 1.9L12 16.5l-1.9-4.6L5.5 10l4.6-1.9z" />
    <path d="M18.5 15.5l.8 1.9 1.7.8-1.7.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z" />
  </svg>
);

export const TABS: readonly Tab[] = [
  { href: '/', label: 'Home', icon: HOME_ICON },
  { href: '/studio', label: 'Studio', icon: STUDIO_ICON },
  { href: '/schedules', label: 'Schedules', icon: SCHEDULES_ICON },
  { href: '/friends', label: 'Party', icon: PARTY_ICON },
];
