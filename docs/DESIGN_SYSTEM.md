# Dovia design system — Phase 1

Dovia is an AI-powered meeting-to-execution workspace. **Turn conversations into action.** This foundation communicates clarity, productivity, trust, collaboration, and progress. White surfaces, a light workspace, navy navigation tokens, and selective blue/violet accents keep the interface suitable for professional work.

Phase 1 implements reusable components. Phase 2 composes these into the workspace shell; page content and backend handlers remain placeholders. See [WORKSPACE_SHELL.md](./WORKSPACE_SHELL.md) for shell usage.

## Design principles

- Give content room to breathe. Use thin borders and restrained shadows.
- Use blue for primary actions, violet for AI, and semantic status colors for feedback.
- Always pair status and priority colors with readable text.
- Use the same tokens, focus ring, field wrapper, and button primitive everywhere.
- Prefer semantic HTML and native interactions over custom widget infrastructure.
- No remote font requests, heavy UI framework, simulated network activity, or business logic.

## Color reference

All values are centralized in `src/app/globals.css`. Tailwind 4 semantic utilities are mapped with `@theme inline`; for example `bg-surface`, `text-text-secondary`, `border-border`, and `text-ai`. Do not repeat hex values in components.

| CSS variable | Value | Usage |
| --- | --- | --- |
| `--background` | `#F8FAFF` | App background |
| `--surface` | `#FFFFFF` | Cards, forms, dialogs |
| `--surface-soft` | `#F5F7FF` | Subtle sections |
| `--surface-hover` | `#F1F4FF` | Hover and selected surfaces |
| `--sidebar` | `#0B1437` | Future sidebar, tooltip surface |
| `--sidebar-secondary` | `#151F4D` | Secondary navy |
| `--sidebar-hover` | `#1B285C` | Future sidebar hover |
| `--sidebar-text` | `#DCE3FF` | Text on navy |
| `--sidebar-muted` | `#96A1C8` | Secondary text on navy |
| `--primary` | `#4057F4` | Primary action and focus |
| `--primary-hover` | `#3449DF` | Primary hover |
| `--primary-active` | `#2D3FC9` | Primary pressed |
| `--secondary` | `#7C3AED` | Violet accent |
| `--secondary-hover` | `#6D28D9` | Violet hover |
| `--foreground` | `#0B102A` | Primary text |
| `--text-secondary` | `#475467` | Supporting text |
| `--text-muted` | `#667085` | Hints, placeholders |
| `--text-subtle` | `#98A2B3` | Nonessential decoration or disabled UI only |
| `--text-disabled` | `#B7BDC9` | Optional disabled treatment, not essential content |
| `--border` | `#E7EAF3` | Cards and separators |
| `--border-strong` | `#D8DDEA` | Stronger structural borders |
| `--border-focus` | `#4057F4` | Focus ring |
| `--success` / `--success-soft` | `#12B76A` / `#ECFDF3` | Success accent / background |
| `--warning` / `--warning-soft` | `#F79009` / `#FFFAEB` | Warning accent / background |
| `--danger` / `--danger-soft` | `#F04438` / `#FEF3F2` | Danger accent / background |
| `--info` / `--info-soft` | `#2E90FA` / `#EFF8FF` | Information accent / background |
| `--priority-low` | `#12B76A` | Low priority marker |
| `--priority-medium` | `#F79009` | Medium priority marker |
| `--priority-high` | `#F04438` | High priority marker |
| `--priority-urgent` | `#D92D20` | Urgent priority marker |
| `--ai` / `--ai-soft` | `#7C3AED` / `#F4F0FF` | AI foreground / background |
| `--on-brand` | `#FFFFFF` | Text on dark solid buttons and gradient |
| `--overlay` | `rgb(11 20 55 / 45%)` | Dialog backdrop |

The official accents are preserved. Bright green, orange, and red are not used as small text on white or behind white button labels. Additional contrast companions provide readable text and solid buttons:

| Token | Value |
| --- | --- |
| `--success-foreground` / `--success-hover` | `#067647` / `#085D3A` |
| `--warning-foreground` | `#93370D` |
| `--danger-foreground` / `--danger-hover` | `#B42318` / `#912018` |
| `--info-foreground` | `#175CD3` |
| `--control-border` | `#667085` |

Controls use the stronger control border to distinguish their boundary against white. Decorative card borders can remain subtle. Subtle/disabled tokens must not be used for required readable text.

## Typography

No existing Geist assets were present. The local system stack is `Segoe UI, -apple-system, BlinkMacSystemFont, Arial, sans-serif`; the root layout inherits it from the body. Metadata remains **Dovia** / **Turn conversations into action.**

| Role | Size | Line height / weight | Class or convention |
| --- | --- | --- | --- |
| Display | Responsive 48–64px | 1.1 / 600 | `dovia-display` |
| Page title | Responsive 36–44px | 1.2 / 600 | `dovia-page-title` |
| Section heading | Responsive 24–30px | 1.3 / 600 | `dovia-section-title` |
| Card heading | 18px | 1.4 / 600 | `dovia-card-title` |
| Body | 16px | 1.5 / 400 | Body default |
| Compact body / labels | 14px | 1.5 / 400–500 | `text-sm` |
| Caption / badge | 12px | Readable 16–20px / 400–500 | `text-xs` |

Headers use explicit classes, not global `h1` styling. Consumers retain semantic heading order: PageHeader uses h1, SectionHeader h2, CardTitle h3. Compose an appropriate heading directly if a different level is needed.

## Spacing, radius, and shadows

Spacing tokens `--space-1/2/3/4/5/6/8/10/12/16/20` correspond to **4/8/12/16/20/24/32/40/48/64/80px**, aligned with Tailwind's default spacing scale.

- `--page-padding`: 16px mobile, 24px from 768px, 32px from 1024px.
- `--card-padding`: 16px mobile, 24px from 768px.
- `--section-gap`: 24px mobile/tablet, 32px from 1024px.
- `dovia-page` is an opt-in page padding utility. It does not globally change every main element.

| Radius token / utility | Value | Use |
| --- | --- | --- |
| `--radius-sm` / `rounded-sm` | 6px | Small menu items |
| `--radius-default` / `rounded-default` | 8px | Buttons, fields |
| `--radius-md` / `rounded-md` | 12px | Menus, compact panels |
| `--radius-lg` / `rounded-lg` | 16px | Cards, dialogs |
| `--radius-xl` / `rounded-xl` | 20px | Reserved larger surfaces |
| `--radius-pill` / `rounded-pill` | 9999px | Badges, avatars |

| Shadow token / utility | Value |
| --- | --- |
| `--shadow-sm` / `shadow-sm` | `0 1px 2px rgb(16 24 40 / 5%)` |
| `--shadow-default` / `shadow-default` | `0 2px 8px rgb(16 24 40 / 6%)` |
| `--shadow-lg` / `shadow-lg` | `0 8px 24px rgb(16 24 40 / 8%)` |

Cards default to a border without a shadow. Pass `shadow="sm"` or `shadow="default"` when hierarchy warrants it.

## Gradient and motion

`--gradient-primary` is `linear-gradient(135deg, #4057F4 0%, #7C3AED 100%)`. Apply `dovia-gradient` selectively to major CTAs or small brand/AI accents. Do not use it as the default background for every panel.

Transitions use 180–200ms. Spinners and skeletons are subtle. `prefers-reduced-motion: reduce` disables animations, transitions, and smooth scrolling; loading text still communicates state.

## Buttons and links

Button accepts native button props, including React 19 refs, and defaults to `type="button"` to avoid accidental form submission. Pass `type="submit"` intentionally. Optional icons are ordinary children; mark decorative icons `aria-hidden`.

| Variant | Use |
| --- | --- |
| `primary` | Main action, blue |
| `secondary` | Supporting action, soft violet |
| `outline` | Neutral bordered action |
| `ghost` | Low emphasis action |
| `danger` | Destructive action with contrast-safe red |
| `success` | Positive action with contrast-safe green |
| `gradient` | Selective AI / major CTA |

Sizes: `sm` (36px minimum height), `md` (44px), `lg` (48px). Labels wrap safely. `loading` disables activation, sets `aria-busy`, and renders a spinner; `loadingText` is optional. Disabled/loading treatment suppresses hover interaction.

IconButton requires an `aria-label` in its TypeScript API. Tooltips describe an action but never substitute for that name. Textual links are blue with hover underline/darker color and a focus ring. Navigation components can opt out of underline using a utility.

## Badges, statuses, and priorities

Badge variants: `default`, `primary`, `success`, `warning`, `danger`, `info`, `neutral`, `ai`. Labels use semantic foreground companions on soft backgrounds.

StatusBadge imports the shared Phase 0 MeetingStatus and TaskStatus types:

| Status | Label | Variant |
| --- | --- | --- |
| DRAFT | Draft | neutral |
| SCHEDULED | Scheduled | info |
| IN_PROGRESS | In Progress | primary |
| PROCESSING | Processing | ai |
| REVIEW | Review | warning |
| COMPLETED | Completed | success |
| CANCELLED | Cancelled | neutral |
| NOT_STARTED | Not Started | neutral |
| BLOCKED | Blocked | danger |
| OVERDUE | Overdue | danger |

PriorityBadge imports TaskPriority. Low uses success, Medium warning, High and Urgent danger. Each displays its human-readable label plus a marker in the exact official priority color; High and Urgent remain distinguishable through their text.

## Forms

- Input, Textarea, and Select share FormField and `dovia-control`. Labels are required strings; `hideLabel` preserves a screen-reader label when appropriate.
- IDs are generated with React useId unless supplied. `required` uses the native attribute and a visual marker. Helper/error IDs are merged with caller `aria-describedby`. Errors set `aria-invalid` and show readable text.
- Input supports native attributes, refs, disabled/error states, and decorative left/right icon slots. Interactive adornments should use a separate named button; do not put buttons inside the decorative slots.
- Textarea supports controlled or uncontrolled input, native maxLength, an optional character count, a 128px minimum height, and vertical resizing. Character count uses native JavaScript/HTML string length (UTF-16 code units).
- Select is single-choice native HTML with `options`, a disabled placeholder, and native keyboard/mobile behavior. No custom select dependency.
- Checkbox uses a native input and a 44px-high clickable label. Space toggles it; disabled and required attributes remain native.
- SearchInput supplies a search icon, `type="search"`, and a default visually hidden Search label. It performs no fetching.
- FormField is available for additional controls; connect their IDs and descriptions using `fieldDescription`.
- No validation rules or submission/persistence logic are included.

## Interaction contracts

- **Tabs:** `items`, accessible `label`, optional controlled `value`/`onValueChange`, or `defaultValue`. Arrow keys wrap through enabled tabs; Home/End move to the first/last. Activation follows keyboard focus. Tab/panel IDs and roving tabIndex are linked. Values must be unique. Horizontal overflow stays within the list.
- **Dropdown:** `trigger` is button content, not another button. `label` names the trigger/menu; `items` have unique IDs, labels, disabled/destructive flags, optional icons, and onSelect callbacks. Enter/Space or arrows open; Up/Down and Home/End navigate; typeahead searches; Escape restores trigger focus. Tab exits naturally. Outside pointer/blur dismisses. Position is clamped to the viewport and flips above when useful. Use for actions, not a form select. Avoid placing within an overflow-clipped ancestor.
- **Modal:** controlled `open`/`onClose`, required title/body, optional description/footer, or onConfirm with confirm label/variant/loading/disabled. Native `dialog.showModal()` supplies focus containment, inert background, and Escape behavior. Initial focus goes to the title; focus returns to the opener. Body scrolling is locked while open. Backdrop dismissal is optional. Sizes are sm/md/lg, capped by viewport dimensions. Confirm only invokes the supplied callback; caller controls closing. Avoid nested modals.
- **Tooltip:** wraps one focusable element that forwards aria-describedby. Opens on hover/focus, remains hoverable, dismisses with Escape, and is positioned within the viewport. Its portal stays within the native dialog when applicable. Keep content short and noninteractive; disabled buttons cannot receive keyboard focus.
- **Toast:** a controlled inline feedback pattern, without a global provider or implicit timers. Success/warning/info use a polite status; error uses an alert. Optional onDismiss controls removal. A parent may position a stack using `fixed bottom-4 right-4 left-4 sm:left-auto` and must avoid covering controls. Do not mount duplicate live regions for the same event.
- **FilterChip:** a toggle button with `selected`/`aria-pressed`; filtering is the consumer's responsibility.

## Other components

- Avatar sizes xs/sm/md/lg/xl are 24/32/40/48/64px. Supply a name and optional src/alt. Multi-word names use first/last initials (Sarah Chen becomes SC). To match the requested Abdulfatai → AD example, single-word names use first/third letters, falling back to the second for two-letter names. Broken images fall back to initials. Native images accept user avatar URLs without a global remote-host configuration.
- Table uses real table elements and a named, keyboard-scrollable region. Supply `containerLabel` and a TableCaption or table aria-label. Header cells default to scope=col. Long tables scroll horizontally within their wrapper.
- Progress clamps invalid, negative, and excessive values and handles invalid maximums. Both visible percent text and progressbar attributes convey completion.
- Skeleton is decorative and hidden from assistive technology. Pair a group with LoadingState or a named loading region.
- EmptyState accepts icon/title/description/action. ErrorState accepts readable text and an optional retry callback. LoadingState announces its label politely.
- AIProcessingState accepts idle/processing/success/error plus a zero-based step. Steps: preparing transcript, analyzing discussion, identifying decisions, extracting action items, finding open questions, finalizing summary. It has no timers or API calls. Success explicitly requests human review before final task creation.
- PageHeader supports eyebrow/title/description/actions/breadcrumbs. SectionHeader supports title/description/action. Neither implements a product page.

## Responsive and accessibility conventions

Review at **375, 768, 1024, and 1440px**. Forms fill available width; flex layouts wrap; headers stack on mobile. Cards and tables have min-width:0. Dialogs have a 16px viewport inset and scroll internally. Dropdown/tooltip widths are viewport-capped. Tables and tab lists may scroll horizontally without making the document overflow.

Use the shared 2px primary focus outline with a 3px offset. Keep it visible on controls, links, and keyboard-scrollable containers. Native disabled semantics, visible field labels, text status/priority labels, accessible icon names, live feedback, and reduced motion are required. Any future composition needs its own heading/landmark and contrast review; these primitives do not validate arbitrary caller-provided colors or content.

## Component inventory and imports

All UI primitives are exported from `src/components/ui/index.ts`; leaf components import one another directly to avoid cycles. Existing default exports remain compatible. Presentation-only primitives stay server-compatible. Components using hooks, browser focus, or callback-driven feedback have client boundaries. A server component can render these with serializable props; interactive callbacks must originate in a client component.

| Category | Exports |
| --- | --- |
| Actions | Button, IconButton, FilterChip |
| Forms | Input, Textarea, Select, Checkbox, SearchInput, FormField, fieldDescription |
| Surfaces | Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Divider |
| Identity / state | Avatar, Badge, StatusBadge, PriorityBadge |
| Navigation / overlays | Tabs, Dropdown, Modal, Tooltip |
| Table | Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption |
| Feedback | Progress, Skeleton, Toast, EmptyState, ErrorState, LoadingState |
| Structure | PageHeader, SectionHeader |
| AI (separate module) | AIProcessingState, aiProcessingSteps |

```tsx
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

<Card>
  <CardHeader><CardTitle>Example form</CardTitle></CardHeader>
  <CardContent className="space-y-4">
    <Input label="Meeting title" placeholder="Product Strategy Sync" required />
    <Button variant="gradient">Generate Meeting Summary</Button>
  </CardContent>
</Card>
```

`cn(...inputs)` uses clsx for conditional classes and tailwind-merge for conflicting Tailwind utilities. Caller className overrides are merged last; reusable CSS classes live in the components layer so Tailwind utilities can override them.

## Dependencies and review fixture

Added only `clsx`, `tailwind-merge`, and `lucide-react`. No UI framework, Radix, toast library, backend SDK, or font package was added. Existing Next.js, React, TypeScript, and Tailwind versions were retained.

`docs/design-system-preview.tsx` is a component-only review fixture covering variants and interactions. It is deliberately not a shipped application route. A temporary route may render it during development; remove that route before release. All Phase 0 frontend/API routes remain as documented in ROUTES.md.

## Phase 1 quality review

The review fixture was rendered temporarily in local Chrome at 375, 768, 1024, and 1440px. Desktop, mobile, and dialog screenshots were visually reviewed for spacing, typography, control treatment, and containment. Browser assertions verified no document overflow, field error associations, checkbox keyboard activation, textarea counts, tab navigation with disabled items, menu keyboard navigation/typeahead/Tab exit/Escape, dialog focus wrapping and restoration, confirmation/dismiss callbacks, avatar fallbacks, and reduced motion.

axe WCAG 2 A/AA and 2.1 AA scans reported zero violations at each width and in the open dialog. No page runtime errors were observed. These checks cover the fixture, not every possible future composition or a full assistive-technology audit. Temporary Playwright/axe tools were installed outside the product dependencies; the temporary route and runner were removed after review.

Review fixes included explicit dialog Tab wrapping, recovery from avatar image failures before hydration, and a semantic role for the fixture's skeleton group. Final acceptance requires `npm run lint` and `npm run build` to pass with only the original application routes present.

## Phase 2 shell extensions

- Dropdown now supports either an `href` (Next.js Link) or an `onSelect` action, optional descriptions/meta text, separators, a header, two menu widths, and an IconButton trigger. Existing action-item usage remains valid. Do not nest a button or link inside trigger content.
- Modal supports `placement="left"`, `titleContent`, `closeLabel`, and an optional element ID. Default centered dialogs retain their existing API. Left placement is used for the mobile navigation drawer and shares native backdrop/focus behavior.
- Tooltip accepts `wrapperClassName` for full-width sidebar links.
- Breadcrumbs is exported from the UI barrel; its explicit items avoid guessing names from route IDs. It owns its navigation landmark, so PageHeader's breadcrumbs slot is now a neutral wrapper.
- Shell dimensions and stacking levels are semantic CSS tokens. WorkspaceShell owns content padding and the main landmark; individual workspace pages should not add another main or duplicate shell padding.
- The shell reuses Avatar, SearchInput, IconButton, Dropdown, Modal, Badge, Toast, Tooltip, and PageHeader. No new package is required.
