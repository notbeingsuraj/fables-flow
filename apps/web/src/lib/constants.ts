/** Application-wide constants. */

export const APP_NAME = 'Fables Flow';
export const APP_DESCRIPTION =
  'AI-Native Order-to-Collection Operating System for Indian Distributors & Wholesalers';

/** Sidebar widths (must match CSS variables). */
export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_COLLAPSED_WIDTH = 72;

/** Top navigation height (must match CSS variable). */
export const TOPNAV_HEIGHT = 64;

/** Animation durations in ms. */
export const ANIMATION = {
  fast: 150,
  normal: 200,
  medium: 250,
  slow: 300,
} as const;

/** Breakpoint pixel values. */
export const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1400,
} as const;

/** Status options for various entities. */
export const STATUS_OPTIONS = [
  { label: 'Active', value: 'active', color: 'success' as const },
  { label: 'Inactive', value: 'inactive', color: 'secondary' as const },
  { label: 'Pending', value: 'pending', color: 'warning' as const },
  { label: 'Suspended', value: 'suspended', color: 'destructive' as const },
] as const;

/** Page size options for tables. */
export const PAGE_SIZES = [10, 25, 50, 100] as const;

/** Default page size. */
export const DEFAULT_PAGE_SIZE = 25;

/** Chart color palette - minimal and refined. */
export const CHART_COLORS = {
  primary: 'hsl(217, 91%, 60%)',
  success: 'hsl(160, 84%, 39%)',
  warning: 'hsl(38, 92%, 50%)',
  destructive: 'hsl(350, 89%, 60%)',
  muted: 'hsl(0, 0%, 65%)',
  info: 'hsl(199, 89%, 48%)',
} as const;

/** Keyboard shortcut definitions. */
export const SHORTCUTS = {
  commandPalette: { key: 'k', modifier: 'mod' },
  search: { key: 'k', modifier: 'mod' },
  escape: { key: 'Escape' },
  save: { key: 's', modifier: 'mod' },
  delete: { key: 'Delete' },
  selectAll: { key: 'a', modifier: 'mod' },
} as const;

/** Date format patterns. */
export const DATE_FORMATS = {
  short: 'dd/MM/yyyy',
  long: 'dd MMMM yyyy',
  withTime: 'dd/MM/yyyy HH:mm',
  iso: 'yyyy-MM-dd',
} as const;
