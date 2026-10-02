# Dovia workspace shell — Phase 2

The shared workspace shell is frontend-only. Pages remain placeholders; authentication, API fetching, persistence, and business features are not implemented.

## Architecture

`src/app/(workspace)/layout.tsx` remains a Server Component. It renders the client `WorkspaceShell` around server-rendered children. The shell owns sidebar state, drawer state, layout spacing, and the single `main#main-content` landmark. Route changes keep the shared layout mounted.

| Module | Responsibility |
| --- | --- |
| `workspace-shell.tsx` | Layout orchestration, collapse state, mobile drawer, skip link, content wrapper |
| `sidebar.tsx` | Sticky desktop/tablet rail, branding, collapse controls |
| `sidebar-navigation.tsx` | Shared desktop/mobile links and pathname-aware active state |
| `mobile-nav.tsx` | Mobile navigation using the existing Modal primitive's left placement |
| `topbar.tsx` | Search, notification preview, profile actions, sign-out feedback |
| `brand.tsx` | Dashboard link with the existing Dovia brand mark |
| `src/lib/navigation.ts` | Typed navigation configuration and segment-aware matching |
| `src/components/ui/breadcrumbs.tsx` | Explicit breadcrumb labels/links for future pages |

The existing app icon was copied unchanged to `public/logo/dovia-mark.png` for a stable public URL. No new logo was invented.

## Navigation and active routes

One configuration supplies both navigation presentations:

| Label | Destination |
| --- | --- |
| Dashboard | `/dashboard` |
| Meetings | `/meetings` |
| My Tasks | `/tasks` |
| Calendar | `/calendar` |
| Team | `/team` |
| Reports | `/reports` |
| Settings | `/settings` |

Settings lives in the lower section. Internal destinations use Next.js Link. Matching is `pathname === href || pathname.startsWith(href + "/")`: `/meetings/new`, `/meetings/abc/content`, and `/meetings/abc/ai-review` highlight Meetings, but `/meetings-other` does not. Task and settings subroutes work the same way. `/notifications` has no active sidebar item because notifications are accessed from the topbar.

Active links have a restrained brand gradient, light icon/text, a visible marker when expanded, and `aria-current="page"`. Inactive links use sidebar text/muted tokens and the sidebar hover surface.

## Responsive behavior

| Width | Behavior |
| --- | --- |
| Below 768px | Permanent sidebar hidden; compact topbar with menu, brand, search, bell, and avatar |
| 768–1023px | 76px icon rail by default; can expand to 248px |
| 1024px and wider | 248px expanded rail by default; can collapse to 76px |
| 1440px and wider | Same fluid shell with generous available page width |

CSS handles the initial breakpoint defaults, so server and client start with identical markup. React state records an explicit expand/collapse choice for the lifetime of the layout. The state is not persisted to browser storage. Collapsed links retain accessible names and use the existing Tooltip. Toggling returns focus to the corresponding expand/collapse control.

The sidebar is sticky and full viewport height, with an internal navigation scroll area only when necessary. The topbar is sticky within the workspace column and approximately 68px high. Page content scrolls with the document. Shell padding is 16px mobile, 24px tablet, and 32px desktop; content width is fluid.

Dimensions are centralized as `--sidebar-expanded-width`, `--sidebar-collapsed-width`, and `--topbar-height`. Layer tokens order chrome (20), dropdowns (30), tooltips (40), toasts (50), and the skip link (60). Native dialogs/backdrops use the browser top layer above ordinary stacking contexts.

## Mobile drawer

The existing Modal handles focus containment, Escape, backdrop dismissal, close button, and focus restoration. Left placement is 88vw with a 320px maximum and full dynamic viewport height. The drawer shares the same navigation config and closes on selecting a link, browser history navigation, or crossing into the desktop/tablet breakpoint. Normal desktop navigation never locks body scrolling; the modal locks it only while open.

## Topbar and display fixtures

- **Search:** the Phase 1 SearchInput accepts local text. Desktop and mobile use the same value. Mobile Search reveals an input below the bar, focuses it, and supports Escape/Close with focus restored. There are no requests or fabricated results.
- **Notifications:** IconButton is reused through Dropdown's icon-only trigger. Three static examples show icons, titles, descriptions, and illustrative relative times. The accessible trigger describes the unread preview count. Items navigate to placeholder meeting/task routes; “View all notifications” links to `/notifications`. No read state or notification API exists.
- **Profile:** Avatar renders AD for the display fixture Abdulfatai; the desktop view includes Product Team. Account, Workspace settings, Notifications, and Security use real Next.js links to existing settings routes. A separator precedes Sign out.
- **Sign out:** closes the menu and shows an informational Toast that authentication will be connected later. It does not modify storage or simulate a session.

Only the two minimal fixture modules under `src/data/mock/` were added. They are presentation data, not authentication or application records.

## Accessibility and component reuse

- A keyboard-visible skip link targets the focusable `main#main-content`.
- Workspace placeholders use non-main wrappers so there is exactly one main landmark. They reuse PageHeader and retain their route parameters and placeholder text.
- Buttons have descriptive labels. Desktop links have labels even when their visible text is hidden. Focus on navy uses the readable sidebar text token.
- Dropdown supports arrows, Home/End, typeahead, Enter/Space, Escape restoration, and natural Tab exit. Navigation items render as links; action items render as buttons.
- Modal is extended with left placement and optional visual title content; its existing centered-dialog behavior remains the default.
- Tooltip accepts a wrapper class so sidebar highlights span the rail without reimplementing tooltips.
- Breadcrumbs accepts explicit `items: { label, href? }[]`, wraps safely, and marks its last item current. Pass it to PageHeader's breadcrumbs slot; PageHeader does not add a second navigation landmark. Route IDs are never automatically turned into labels.
- Existing reduced-motion rules apply. No route-transition animation or new dependency was added.

Example for a future page:

```tsx
<PageHeader
  title="Meeting overview"
  breadcrumbs={<Breadcrumbs items={[
    { label: "Meetings", href: "/meetings" },
    { label: "Product Strategy Sync" },
  ]} />}
/>
```

## Verification scope

Check 375, 768, 1024, and 1440px; sidebar defaults and toggling; all workspace route families and nested active states; profile/notification menus; mobile search; drawer dismissal, focus containment/restoration; skip link; overflow; console/hydration errors; and absence of `/api/` requests. Run `npm run lint` followed by `npm run build` before accepting the phase.

The next phase is **Phase 3 — Landing Page & Authentication UI**. It is not part of this implementation.
