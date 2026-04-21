export const theme = {
  colors: {
    background: '#000000',
    surface: '#09090b',
    surfaceHover: '#18181b',
    border: '#3f3f46',
    divider: '#27272a',
    text: '#fafafa',
    textMuted: '#a1a1aa',
    textFaint: '#71717a',
    accent: '#c026d3',
    accentHover: '#d946ef',
    danger: '#ef4444',
    dangerText: '#f87171',
    dangerBorder: 'rgba(239, 68, 68, 0.4)',
    dangerBg: 'rgba(239, 68, 68, 0.05)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '40px',
    xxxl: '64px',
  },
  radius: {
    sm: '4px',
    md: '6px',
    full: '9999px',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xxl: '30px',
    hero: '36px',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
  },
  maxWidth: {
    main: '768px',
  },
} as const;

export type Theme = typeof theme;
