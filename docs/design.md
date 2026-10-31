# Design System and UI Conventions

How this app looks and behaves, derived from the code. Read this before UI changes so new work stays consistent. `src/styles/theme.ts` is the source of truth for every token below; if a value here disagrees with the file, the file wins.

Where the code is inconsistent, this doc states the dominant pattern and flags the gap under **Known inconsistencies**.

## Contents

- [Principles](#principles)
- [Theme tokens](#theme-tokens)
- [Layout](#layout)
- [Component inventory](#component-inventory)
- [State communication](#state-communication)
- [Realtime and optimistic updates](#realtime-and-optimistic-updates)
- [Accessibility](#accessibility)
- [Motion](#motion)
- [Copy and labels](#copy-and-labels)
- [Known gotchas](#known-gotchas)
- [Adding a new page or tab](#adding-a-new-page-or-tab)
- [Known inconsistencies](#known-inconsistencies)

---

## Principles

1. **Phone-first.** Design at 390px wide, and make everything work at 360px minimum. Desktop is a widened phone layout, not a separate design.
2. **Thumb reach.** Primary navigation is a bottom tab bar on phones. Frequent controls (power, brightness) sit in the card, not behind menus. Rarely used controls (routine choice, light detail) open a bottom sheet.
3. **Most frequent action first.** In every card the order is: name, power, brightness, then secondary actions (routines, events). Do not add a control above power.
4. **Color means light.** Saturated color appears only where it is real light output: the room glow, the dim fill, the power button when on, light swatches. All other chrome (tabs, buttons, focus rings, selected states) is neutral grayscale. The accent is a neutral off-white, not a hue.
5. **Dark theme only.** The app declares `color-scheme: dark`; there is no light theme. Surfaces step up in lightness for elevation.
6. **Honest state.** UI shows what the lights are actually doing (live glow from real output), not what was last requested. Pending and error states are always visible.
7. **Never use `window.confirm`.** Destructive actions confirm inline.

---

## Theme tokens

Import `theme` from `@/styles/theme` and use tokens in styled-components. Do not hardcode colors, spacing, or radii in components.

### Colors

| Token | Use |
|-------|-----|
| `background` | Page and status-bar backdrop |
| `surface` | Cards, list rows, sheets |
| `surfaceRaised` | Controls sitting on a surface (buttons, selects, pills, presets) |
| `surfaceHover` | Pressed or hover feedback on raised controls |
| `surfaceTrack` | Slider tracks and Studio swatch frames |
| `border` | Sheet outline |
| `borderSubtle` | Default card or control hairline (white at 8%); decorative only |
| `borderStrong` | Boundary of interactive controls that must be visible (slider track, pills, off power button); meets 3:1 |
| `divider` | Reserved for rules between sections |
| `text` | Primary text |
| `textMuted` | Secondary text, labels |
| `textFaint` | Tertiary text and inactive tab labels; still at least 4.5:1 on `background` |
| `accent`, `accentHover` | Neutral primary button fill |
| `accentSoft` | Selected or active tint (10% white) |
| `accentText` | Active tab, focus ring color |
| `onAccent` | Text on `accent` fills |
| `lightDefault` | Fallback glow when real color is unknown |
| `lightInkDark`, `lightInkLight` | Text on top of a glow fill, chosen by luminance |
| `offFill` | Off-state fill inside tracks |
| `danger`, `dangerText`, `dangerBorder`, `dangerBg` | Errors and destructive actions |
| `scrim` | Translucent bars (tab bar, sticky strips) over blur |
| `sheetScrim` | Backdrop behind bottom sheets |

### Spacing, radii, type

| Group | Tokens |
|-------|--------|
| `spacing` | xs 4, sm 8, md 12, lg 16, xl 24, xxl 40, xxxl 64 |
| `radius` | sm 4, md 10 (controls), lg 16 (list rows, tiles), xl 24 (cards, sheets), full (pills, circles) |
| `fontSize` | xs 12, sm 14, base 16, lg 18, xl 22 (card titles, readouts), xxl 30 (page title on app screens), stat 28, hero 34 (PageHeader title) |
| `fontWeight` | regular 400, medium 500, semibold 600, bold 700 |

Section headings are `xs`, uppercase, `letter-spacing: 0.1em`, `textMuted`, semibold (`SectionHeading`). Page titles use bold with `letter-spacing: -0.03em`.

### Shadows

- `shadow.card`: inset top highlight plus a deep soft drop. On every card and list row.
- `shadow.glow`: faint white bloom; reserved for hero emphasis.
- Lit elements (power button on) use `0 0 28px -4px var(--room-glow)` so the bloom matches the light color.

### Sizes and touch targets

| Token | px | Use |
|-------|----|-----|
| `size.touch` | 48 | Buttons, selects, inputs, day toggles, sheet options |
| `size.touchSm` | 44 | Minimum for secondary controls: pills, presets, close buttons, quick-color dots |
| `size.dimTrack` | 52 | Brightness slider height |
| `size.power` | 56 | Power button diameter |
| `size.tabBar` / `size.topBar` | 64 | Bottom tab bar / desktop top bar |

Nothing interactive is smaller than 44x44. Visual size may be smaller only if the hit area is padded to 44.

### Breakpoints and widths

| Token | Value | Behavior |
|-------|-------|----------|
| `breakpoint.tablet` | 768px | Bottom tabs become a sticky top bar; gutters grow 16 to 24; sheets center instead of docking |
| `breakpoint.desktop` | 1100px | Home room grid becomes multi-column |
| `maxWidth.main` | 768px | Default page column |
| `maxWidth.wide` | 1080px | Wide pages (Home) via `<PageShell isWide>` and the nav inner width |

Z-index layers: `banner` 9, `nav` 10, `statusBar` 20, `sheet` 30.

---

## Layout

### AppShell (`src/app/_components/AppShell`)

Rendered once in the root layout inside `RealtimeProvider`. It mounts, in order: a fixed `StatusBarBackdrop` (height = top safe-area inset, so content never shows under the iOS status bar), `AppNav`, the page, then the global `EventBanner` and `ConnectionPill`.

### Navigation (`AppNav`, tabs defined in `AppNav/tabs.tsx`)

- Phones: fixed bottom tab bar, equal-width tabs (icon over 12px label), 64px tall plus the bottom safe-area inset. Translucent `scrim` with backdrop blur.
- At 768px and up: sticky top bar (64px) with the brand on the left and pill-shaped tabs on the right; the active tab gets an `accentSoft` pill.
- Active tab: `accentText` color and `aria-current="page"`. Inactive: `textFaint`.
- Icons are 24px, 1.8 stroke, round caps, `currentColor`, `aria-hidden`; labels are short single words.
- Tab count must fit 360px: each tab gets `flex: 1`, so five tabs are about 72px each. Keep labels to one short word.

### PageShell (`shared/PageShell`)

Wraps every page. It provides:

- Side gutters of 16px (24px at 768+). Never add your own horizontal page padding.
- Top padding `max(16px, env(safe-area-inset-top))`.
- Bottom padding `tabBar + env(safe-area-inset-bottom) + 24px`, so the last item clears the tab bar. On 768+ the bottom padding is 40px.
- A column flex layout with `gap: 24px` between top-level blocks.
- `isWide` switches the max width from 768 to 1080.

### Page header pattern

`PageHeader` (title + optional one-sentence lede) is the default. Home uses `HomeHeader` instead because it carries the "All off" action beside the title. Always one `h1` per page.

### Card pattern

- Radius `xl`, `surface` background, `borderSubtle` border, `shadow.card`.
- Padding 12/16/16 on phones, 16/24/24 at 768+; internal gap 12.
- Lit state: border and a top-right radial wash tinted by `--room-glow-*` CSS variables (set from `glowStyle`). Transition 400ms.
- List rows (`shared/List`) use the same recipe with radius `lg`.

### Home grid

Single column up to 1099px (`minmax(0, 1fr)`); from 1100px, `repeat(auto-fill, minmax(320px, 1fr))` with 16px gap. Always use `minmax(0, 1fr)` rather than bare `1fr` so content cannot force a column wider than the card.

---

## Component inventory

Folder convention: `Component/index.tsx` plus `Component/styles.tsx` imported as `S`. One component per folder; hooks and helpers live in `src/lib/**`, one per file.

### Surfaces and containers

| Component | When to use |
|-----------|-------------|
| `RoomCard` | Per-room control: name, routine pill, power, brightness. The model for any per-thing control card. |
| `shared/List` (`List`, `ListRow`, `RowBody`, `RowTitle`, `RowMeta`) | Simple record rows (schedules). `RowMeta` separates parts with a dim `·`. |
| `shared/Section` (`Section`, `SectionHeading`, `MutedText`, `FaintText`, `ErrorBanner`, `ErrorText`) | Titled groups and message text. `FaintText` is the standard empty state. |
| `shared/Skeleton` | Loading placeholder blocks (pulse animation) |

### Controls

| Component | When to use |
|-----------|-------------|
| `shared/Control` (`Button`, `Select`, `Input`, `TimeInput`) | Standard form controls; `TimeInput` for `type="time"`. 48px, 16px font, `radius.md`. `$tone` is `default`, `primary` (neutral accent fill), or `danger` (outlined red). One `primary` per form. |
| `PowerButton` | Circular on/off switch (`role="switch"`). Off: raised surface with strong border. On: filled with the live glow color. 56px. |
| `DimControl` | Brightness slider plus four presets (5, 20, 50, 100%). See gesture rules below. |
| Pills (`RoutinePill`, `AllOffButton`) | 44px high, fully rounded, `borderStrong`. Used for secondary actions that open or fire something. |
| Segmented / toggle groups (`DayToggle`, Studio style picker) | Choose one or several from a small fixed set. Active: `accentSoft` background and bright border. Multi-select uses `aria-pressed`; single-select uses `role="radiogroup"` with `role="radio"` and arrow-key navigation. |
| Chips / quick-color dots | Round 44px swatches with a hairline outline for color shortcuts. |
| Native color input | Wrapped in a 48px label with the input oversized inside an `overflow: hidden` box (Studio palette). |

### DimControl gesture rules

The slider fixes a classic phone problem: a horizontal drag must not hijack vertical page scroll, and a stray tap must not change brightness.

- **Relative drag.** Touch input never jumps to the finger position. The value at pointer-down is the start value; the drag applies `delta / trackWidth` to it.
- **Intent threshold.** A touch must travel 6px horizontally and more horizontally than vertically before the drag begins (then the pointer is captured). Until then the browser may scroll (`touch-action: pan-y`).
- **Mouse and pen** are precise, so a press sets the value directly.
- **Cancel.** `pointercancel` (for example the browser takes over for scroll) reverts to the start value, and restores it on the server if any intermediate value was already sent.
- **Keyboard.** Arrows step 5%, Page keys 10%, Home and End jump to the extremes. Each is a final commit.
- Range is 1 to 100%; the slider never sends 0 (off is the power button).
- The readout is drawn twice, with the second copy clipped to the fill and colored for contrast against the glow (`--room-glow-ink`).
- Dragging while the room is off starts the default routine first (`onBeforeCommit`).

### Routine bottom sheet (`RoutineSheet`)

The reference pattern for every modal sheet:

- Rendered through `createPortal` into `document.body`; backdrop click closes.
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` the title.
- On open: lock body scroll, move focus to the checked option (or first focusable). On close: restore scroll and return focus to the opener.
- Escape closes; Tab and Shift+Tab are trapped inside the sheet.
- Options are a `radiogroup` per section with arrow-key roving focus; 48px rows; the current one shows a check and `accentSoft` fill.
- Bottom-docked with a grab handle on phones, centered at 768+; `max-height: 85dvh`, body scrolls with `overscroll-behavior: contain`; bottom padding includes the safe-area inset.
- Always includes a visible Close button.

### Inline confirm (no `window.confirm`)

Destructive actions swap the button for a prompt in place:

- Schedules: Remove becomes "Remove? Yes / No" (`role="group"`).
- Studio routine card: delete shows a `role="alertdialog"` prompt inside the card.
- Keep the confirm in the same spot so the thumb does not move. Disable other destructive buttons while one is pending.

### Banners and pills

- `EventBanner`: global, `role="region"`, fixed above the tab bar on phones (below the top bar on desktop). One row per running room event with Cancel; "Cancel all" when more than one.
- `RoomEventStatus`: the same event inside the owning room card, so the card still explains why lights are changing.
- `ConnectionPill`: `role="status"`, centered at the top, "Reconnecting…", shown only while the socket is down; it ignores pointer events.
- `ErrorBanner`: boxed error for page-level failures; `ErrorText`: plain red line for inline errors.

### Studio controls

- `StudioSwatch`: renders a routine's palette as the animation it will produce (drift, pulse, flicker, chase). It must honor `prefers-reduced-motion`.
- `StudioSlider`: native `input[type=range]` styled with a 48px hit height and a `--pct` fill; label on the left, readout on the right, `touch-action: pan-y`.
- `StudioPalette`: color tiles (4 columns phone, 8 at 768+), a native color picker, move and remove buttons, and a row of curated quick picks (`lib/studio/quickColors.ts`). Reuse `QUICK_COLORS` for any new color picker.
- The Studio editor pins a live preview strip (`StripWrap`, sticky below the top bar on desktop).

---

## State communication

| State | How it looks |
|-------|--------------|
| **On** | Card border and wash take the live glow color; power button filled with glow; dim fill glows; the routine pill names the routine. |
| **Off** | Neutral card; power button raised with strong border; dim fill uses `offFill` and the readout says "Off"; pill reads "Last: <Routine>" so one tap restores it. |
| **Event running** | `RoomEventStatus` row in the card plus the global `EventBanner`, both with Cancel. |
| **Pending** | The acting control is disabled and dimmed to 0.6 opacity with `aria-busy`; the routine pill text becomes "Applying…". The UI flips optimistically at the same time. |
| **Error** | Red line under the control (`role="alert"`) that clears itself after 5 seconds (`useTransientMessage`). The optimistic state reverts. |
| **Loading** | `loading.tsx` renders skeleton blocks shaped like the final layout inside `LoadingShell`. |
| **Empty** | One `FaintText` sentence ("No schedules yet.", "No rooms configured."). Never a blank area. |
| **Load failure** | Page header stays; an `ErrorBanner` explains; `error.tsx` uses `RouteError` with a Try again button. |

Never rely on color alone: state also changes label text, `aria-checked`, or shape.

---

## Realtime and optimistic updates

The root `RealtimeProvider` owns one WebSocket (`NEXT_PUBLIC_CLYDE_WS_URL`) and exposes it through `RealtimeContext`.

**Events handled:** `room_state`, `room_dim`, `room_event`, and per-light `light_on`. Room-level events go into maps; `light_on` fans out to subscribers (`subscribeLightOn`) so only interested hooks re-render.

**Rules for any live-updating control:**

1. **Seed, then stream.** Seed from props or an HTTP snapshot, then layer live events on top (`useRoomLive`, `useRoomGlow`).
2. **Optimistic UI.** Flip local state immediately; call the API; on error revert and show a transient message; on success call `patchRoomLive` so other views agree without waiting for the echo.
3. **Seq-numbered commits** (`useRoomDimControl`): each send increments a sequence number. A response whose number is not the latest is ignored, so a slow older request cannot overwrite a newer value.
4. **Throttle drags** to one request per 150ms with a trailing send; the final value of a gesture is always sent immediately.
5. **Ignore stale echoes.** While a local change is in flight the control is "dirty" and refuses server values. After a successful send it keeps ignoring echoes for a 400ms grace window, then accepts the server again.
6. **Do not let a snapshot clobber fresher live data.** `lastMessageAt` per room; a resync skips rooms that got a live message after the fetch began. `useRoomGlow` likewise ignores a `/state` seed older than a live light event.
7. **Resync on wake.** On reconnect and whenever the tab becomes visible, refetch `/api/clyde/rooms` and bump `resyncCount`; hooks that seeded from HTTP re-seed when it changes. Reconnects use exponential backoff (1s up to 30s).
8. **Glow color** for a room is the average of the RGB of its lights that are on, throttled to one update per 250ms. Unknown color falls back to warm white; ink color (dark or light text) is chosen from luminance.

---

## Accessibility

- **Touch targets:** at least 44x44 everywhere; 48 for primary controls. Check the narrowest layout (360px), because grids of small buttons are where this fails.
- **Inputs are 16px or larger.** iOS Safari zooms the page on focus when an input is smaller. `Control` enforces `fontSize.base`; never lower it.
- **Roles:** slider (`role="slider"` with `aria-valuemin/max/now/valuetext`), switch (`role="switch"` with `aria-checked`), radiogroup with radios for single choice, `aria-pressed` for toggle buttons, `role="dialog"` with `aria-modal` for sheets, `role="alert"` for errors, `role="status"` for passive status, `role="region"` with a label for the event banner.
- **Names:** icon-only and visual-only controls need `aria-label` that states the action and the target ("Set Bedroom brightness to 50 percent"). Decorative SVG gets `aria-hidden`.
- **Focus:** every control has a visible `:focus-visible` ring: `2px solid accentText`, `outline-offset: 2px`. Do not remove outlines. Sheets trap focus and restore it.
- **Contrast:** text at least 4.5:1, UI boundaries and control edges at least 3:1. That is why interactive borders use `borderStrong` and not `borderSubtle`, and why `textFaint` is `#8b8b94` (not darker). Text on a glow fill must use `--room-glow-ink`.
- **Keyboard parity:** anything draggable has arrow-key support.
- **Reduced motion:** every animation has a `@media (prefers-reduced-motion: reduce)` override that disables it.
- **Safe areas:** use `env(safe-area-inset-*)` for anything fixed to a screen edge.

---

## Motion

Short and functional, never decorative.

| Where | Spec |
|-------|------|
| Press feedback | `transform: scale(0.92 to 0.98)` on `:active`, 120ms |
| Hover and color changes | 120ms ease |
| Glow, fill, border color | 200 to 400ms ease |
| Bottom sheet | 180ms ease-out slide up 24px with fade |
| Skeleton | 1.4s opacity pulse |
| Studio swatches | Looping animations that show the routine's real motion |

Reduced-motion users get no animation; state changes still apply instantly.

---

## Copy and labels

- **Display names.** Prefer a backend-provided `display_name` for rooms (`lib/rooms/roomLabel`). Where none exists, use `titleCase(key)`: `living_room` becomes "Living Room".
- **Routine names.** `lib/rooms/routineLabel` trusts `display_name` only for custom Studio routines; built-ins are `titleCase(key)`.
- **Room order is fixed:** Living Room, Office, Bedroom, then any others in backend order. Always pass rooms through `lib/rooms/sortRooms`.
- **Events** are humanized with underscores replaced by spaces and capitalized by CSS or `titleCase`.
- **Tone:** short, sentence case, no exclamation marks, no jargon. Buttons are verbs ("Add", "Remove", "Cancel"). In-progress labels end with an ellipsis character ("Applying…", "Removing…"). Section headings are single nouns.
- **Errors** say what failed and why in one line: "Failed to load rooms: <message>".
- **Time** is shown 12-hour with AM/PM; days collapse to "Every day", "Weekdays", "Weekends" where they match.

---

## Known gotchas

- **`loading.tsx` needs `LoadingShell`, not `PageShell`.** Streamed loading UI is rendered before the page's styled-components CSS is flushed; `LoadingShell` uses its own styled components (sharing only the CSS fragments) so padding and layout survive the stream. Studio has no `loading.tsx` because its boundary broke SSR padding.
- **Never call the backend port from the browser.** Client code fetches `/api/clyde/<path>` (the Next proxy, which supports GET, POST, PUT, PATCH and DELETE). Server components use `@/lib/clyde`.
- **Bun only.** Never use node, npm, or npx. Use `bun`, `bun run`, `bun x`.
- **Next 16 differs from older versions.** Check `node_modules/next/dist/docs/` before using a Next API you are unsure of. Error boundaries receive `unstable_retry`.
- **Grids of small buttons break the 44px rule at 360px.** Seven day toggles in a card are only about 38px wide, so the schedule day picker is 4 columns on phones and 7 from 768px.
- **Use `minmax(0, 1fr)`** in grids and `min-width: 0` on flex children that hold text or form controls. Without them, long content or an intrinsic input width pushes the layout past the card.
- **Native `input[type=time|date]` on iOS Safari** has an intrinsic minimum width and ignores `width: 100%` unless appearance is reset. Use `TimeInput` from `shared/Control` (display block, `appearance: none`, `min-width: 0`, `max-width: 100%`, inner value left-aligned).
- **Hooks that subscribe to realtime** must unsubscribe in cleanup; seeds from HTTP must be aborted on unmount (`AbortController`).
- **Sheets lock body scroll** by setting `overflow: hidden` on `body`; restore the previous value on close, not `''`.
- **Never send state-changing requests from tests or screenshots** against the real backend; these are real lights.

---

## Adding a new page or tab

1. **Route.** Create `src/app/<route>/page.tsx` (server component). Fetch with `@/lib/clyde` in parallel (`Promise.all`). Handle the error and empty cases in the page itself with `PageShell`, `PageHeader`, and `ErrorBanner` or `FaintText`.
2. **Types and fetchers.** Add response types and a `fetchX` helper in `src/lib/clyde.ts` (shared) or a colocated file in `src/lib/<feature>/`. One function per file.
3. **Loading and error.** Add `loading.tsx` (skeletons that match the final layout, inside `LoadingShell`) and `error.tsx` (`RouteError` with `unstable_retry`).
4. **Components.** Add `src/app/_components/<Name>/index.tsx` and `styles.tsx`. Use only theme tokens, transient `$props`, and the shared controls. Mark `'use client'` only where interaction needs it.
5. **Tab.** Add an icon (24px, 1.8 stroke) and an entry to `TABS` in `AppNav/tabs.tsx`. Keep the label to one short word and verify all tabs fit at 360px with `flex: 1`.
6. **Mobile check.** Screenshot at 360, 390, and 1280. No horizontal scroll, no control under 44px, no input under 16px, last item clears the tab bar.
7. **States.** Provide on/off, pending, error (transient, with revert), loading, and empty states.
8. **Realtime.** If the page shows live state, seed from the server and subscribe through `RealtimeContext`; use seq numbers and stale-echo handling for any slider.
9. **Docs.** Update this file's inventory and `docs/README.md` architecture table.
10. **Verify.** `bun x tsc --noEmit`, `bun run lint`, `bun run build`.

---

## Known inconsistencies

Documented so they are not copied further. Fix opportunistically.

| Area | Inconsistency | Dominant pattern to follow |
|------|---------------|----------------------------|
| Touch size | Controls use 48px (`touch`) while pills, presets, quick dots, and close buttons use 44px (`touchSm`) | 48 for primary controls, 44 as the floor |
| Page titles | `PageHeader` title is 34px, `HomeHeader` and `RouteError` use 30px | `PageHeader` for new pages |
| Inline errors | `RoomCard`, `HomeHeader`, and others define their own `Error` styled `p` instead of `ErrorText` | Use `ErrorText` from `shared/Section` |
| Z-index | `AppNav` and `StudioEditor` use literals (10, 5) rather than `theme.zIndex` | Use `theme.zIndex.*` |
| Raw values | `globals.css` and the viewport `themeColor` hardcode the background hex; some sizes (sheet max-width 520, skeleton heights, grab handle) are literal | Add a token if a value repeats |
| Focus ring | Slider track uses a 3px box-shadow ring instead of an outline | Outline `2px accentText` for everything else |
| Loading and error boundaries | Present for Home and Schedules only; Studio omits loading, Party has neither | Provide both for new pages |
