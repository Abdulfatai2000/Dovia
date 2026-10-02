# Dovia Design System

> **Product:** Dovia  
> **Tagline:** *Turn conversations into action.*  
> **Purpose:** Single visual reference for every Dovia frontend phase.

## 1. Design principles

Dovia should feel:
- clear
- professional
- trustworthy
- modern
- collaborative
- action-oriented

Use:
- a clean light workspace
- a dark navy authenticated sidebar
- blue/violet brand accents
- subtle borders
- soft shadows
- consistent spacing
- restrained gradients
- readable data-dense layouts

Avoid:
- excessive glassmorphism
- neon colors
- oversized shadows
- decorative motion that slows work
- inconsistent radii
- random one-off colors

## 2. Official color tokens

### Background and surfaces

| Token | Value | Use |
|---|---:|---|
| `--background` | `#F8FAFF` | Main app background |
| `--surface` | `#FFFFFF` | Cards, forms, panels |
| `--surface-soft` | `#F5F7FF` | Secondary surfaces |
| `--surface-hover` | `#F1F4FF` | Hover states |

### Sidebar

| Token | Value |
|---|---:|
| `--sidebar` | `#0B1437` |
| `--sidebar-secondary` | `#151F4D` |
| `--sidebar-hover` | `#1B285C` |
| `--sidebar-text` | `#DCE3FF` |
| `--sidebar-muted` | `#96A1C8` |

### Brand

| Token | Value |
|---|---:|
| `--primary` | `#4057F4` |
| `--primary-hover` | `#3449DF` |
| `--primary-active` | `#2D3FC9` |
| `--secondary` | `#7C3AED` |
| `--secondary-hover` | `#6D28D9` |

Primary gradient:

```css
linear-gradient(135deg, #4057F4 0%, #7C3AED 100%);
```

Use the gradient selectively for major CTA and AI accents.

### Text

| Token | Value |
|---|---:|
| `--text-primary` | `#0B102A` |
| `--text-secondary` | `#475467` |
| `--text-muted` | `#667085` |
| `--text-subtle` | `#98A2B3` |
| `--text-disabled` | `#B7BDC9` |

### Borders

| Token | Value |
|---|---:|
| `--border` | `#E7EAF3` |
| `--border-strong` | `#D8DDEA` |
| `--border-focus` | `#4057F4` |

### Status

| Meaning | Foreground | Soft background |
|---|---:|---:|
| Success | `#12B76A` | `#ECFDF3` |
| Warning | `#F79009` | `#FFFAEB` |
| Danger | `#F04438` | `#FEF3F2` |
| Info | `#2E90FA` | `#EFF8FF` |
| AI | `#7C3AED` | `#F4F0FF` |

### Priority

| Priority | Color |
|---|---:|
| Low | `#12B76A` |
| Medium | `#F79009` |
| High | `#F04438` |
| Urgent | `#D92D20` |

## 3. Typography

Prefer the existing Next.js/Geist setup where available.

Suggested hierarchy:

| Role | Size |
|---|---|
| Display | 48–64 px |
| Page title | 36–44 px |
| Section heading | 24–30 px |
| Card heading | 18–20 px |
| Body | 14–16 px |
| Small/metadata | 12–14 px |
| Form label | 13–14 px |

Requirements:
- readable line height
- strong hierarchy
- avoid excessive bold
- use responsive sizing where useful

## 4. Spacing

Preferred spacing scale:

```text
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80 px
```

Guidelines:
- desktop page padding: 24–32 px
- tablet: 20–24 px
- mobile: 16 px
- card padding: 20–24 px desktop, 16 px mobile
- major section gap: 24–32 px

## 5. Radius

| Size | Radius |
|---|---:|
| Small | 6 px |
| Default | 8 px |
| Medium | 12 px |
| Large | 16 px |
| XL | 20 px |
| Pill | 9999 px |

## 6. Shadows

```css
/* small */
0 1px 2px rgba(16, 24, 40, 0.05);

/* default */
0 2px 8px rgba(16, 24, 40, 0.06);

/* large */
0 8px 24px rgba(16, 24, 40, 0.08);
```

Most cards should depend primarily on borders rather than heavy shadows.

## 7. Component inventory

Core reusable UI:
- Button
- IconButton
- Input
- SearchInput
- Textarea
- Select
- Checkbox
- Card
- Badge
- StatusBadge
- PriorityBadge
- Avatar
- Tabs
- Dropdown
- Modal/Dialog
- Table
- Progress
- Skeleton
- Toast/feedback
- EmptyState
- ErrorState
- LoadingState
- PageHeader
- SectionHeader
- Divider
- Tooltip
- FilterChip
- FormField
- AIProcessingState

## 8. Button variants

- `primary`
- `secondary`
- `outline`
- `ghost`
- `danger`
- `success`
- `gradient`

Sizes:
- `sm`
- `md`
- `lg`

All variants must support:
- hover
- active
- focus
- disabled
- loading

## 9. Status mapping

Meeting:
- `DRAFT` → Draft
- `SCHEDULED` → Scheduled
- `IN_PROGRESS` → In Progress
- `PROCESSING` → Processing
- `REVIEW` → Review
- `COMPLETED` → Completed
- `CANCELLED` → Cancelled

Task:
- `NOT_STARTED` → Not Started
- `IN_PROGRESS` → In Progress
- `BLOCKED` → Blocked
- `COMPLETED` → Completed
- `OVERDUE` → Overdue

Do not communicate status using color alone.

## 10. Responsive baseline

Components must work at:
- 375 px mobile
- 768 px tablet
- 1024 px laptop
- 1440 px desktop

Desktop sidebar will later become collapsible/drawer navigation on smaller screens.

## 11. Accessibility

Required:
- keyboard navigation
- visible focus ring
- semantic HTML
- labels tied to inputs
- `aria-label` on icon-only buttons
- sufficient contrast
- useful disabled state
- errors presented in text, not only color
- reduced-motion support

## 12. Motion

Use subtle 150–250 ms transitions for:
- hover
- focus
- menus
- dialogs
- small state changes

Respect `prefers-reduced-motion`.
