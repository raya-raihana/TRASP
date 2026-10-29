---
name: Atelier Editorial Minimal
colors:
  surface: '#fff8f1'
  surface-dim: '#dfd9d2'
  surface-bright: '#fff8f1'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f3eb'
  surface-container: '#f3ede6'
  surface-container-high: '#ede7e0'
  surface-container-highest: '#e7e2db'
  on-surface: '#1d1b17'
  on-surface-variant: '#41484a'
  inverse-surface: '#32302c'
  inverse-on-surface: '#f6f0e9'
  outline: '#71787b'
  outline-variant: '#c0c8ca'
  surface-tint: '#3a646f'
  primary: '#002830'
  on-primary: '#ffffff'
  primary-container: '#0f3f49'
  on-primary-container: '#7faab6'
  inverse-primary: '#a2ceda'
  secondary: '#b02e26'
  on-secondary: '#ffffff'
  secondary-container: '#ff6758'
  on-secondary-container: '#690004'
  tertiary: '#3a1d02'
  on-tertiary: '#ffffff'
  tertiary-container: '#533214'
  on-tertiary-container: '#ca9a74'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bdeaf6'
  primary-fixed-dim: '#a2ceda'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#204d57'
  secondary-fixed: '#ffdad5'
  secondary-fixed-dim: '#ffb4aa'
  on-secondary-fixed: '#410001'
  on-secondary-fixed-variant: '#8e1311'
  tertiary-fixed: '#ffdcc2'
  tertiary-fixed-dim: '#f0bc94'
  on-tertiary-fixed: '#2e1500'
  on-tertiary-fixed-variant: '#623f20'
  background: '#fff8f1'
  on-background: '#1d1b17'
  surface-variant: '#e7e2db'
typography:
  display-hero:
    fontFamily: Bodoni Moda
    fontSize: 4.5rem
    fontWeight: '600'
    lineHeight: 5rem
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Bodoni Moda
    fontSize: 2.75rem
    fontWeight: '600'
    lineHeight: 3.25rem
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Bodoni Moda
    fontSize: 3rem
    fontWeight: '500'
    lineHeight: 3.5rem
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Bodoni Moda
    fontSize: 2rem
    fontWeight: '500'
    lineHeight: 2.5rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Bodoni Moda
    fontSize: 2rem
    fontWeight: '500'
    lineHeight: 2.5rem
  headline-sm:
    fontFamily: Bodoni Moda
    fontSize: 1.5rem
    fontWeight: '500'
    lineHeight: 2rem
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.06em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.08em
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies a disciplined, high-end editorial aesthetic grounded in print curation and architectural balance. It addresses discerning audiences seeking thoughtful experiences, cultural substance, and bespoke digital luxury without excessive embellishment. 

The visual identity relies on three primary expressions:
- **Restrained Editorial Minimalism**: Large deliberate whitespace, rigorous typographic contrast, and intentional rhythm dictate focus.
- **Architectural Line & Grid**: Content relies on structural framing, sharp delineation, and hairline borders rather than artificial dropshadows or complex gradients.
- **Controlled Drama**: High contrast pairings between rich teal-aquamarine, bone-like concrete beige, and deep burgundy establish dramatic focus points.

## Colors

The palette is strictly restricted to three purposeful tones:
- **Aquamarine (`#0f3f49`)**: Deep rich teal. Acts as the primary brand anchor, dominant body typography, key interactive states, dark inverted hero surfaces, and crisp structural borders.
- **Concrete (`#ece6df`)**: Muted linen off-white. Operates as the foundation canvas, neutral surface container, input field background, and inverted text color over dark blocks.
- **Burgundy (`#7f0508`)**: Deep crimson wine. Reserved for accents, primary calls to action, badges, highlight states, and critical actions.

### Color Rules & Application
- **No Extraneous Hues**: Standard interface alerts (success, warnings, info) must rely on typographic layout, subtle micro-copy, and tonal hierarchy within this strict tri-color scheme rather than introducing neon greens, yellows, or blues.
- **Contrast Ratios**: Text in `#0f3f49` on `#ece6df` canvas achieves a contrast ratio well above AAA (10.8:1). Burgundy `#7f0508` against `#ece6df` provides a bold 7.4:1 contrast ratio for pristine accessibility.
- **Tonal Inversion**: Inverted cards or hero sections flip the canvas to `#0f3f49`, using `#ece6df` for titles and body copy, while `#7f0508` maintains its targeted accent role.

## Typography

The typography pairing contrasts the dramatic editorial flair of **Bodoni Moda** with the modern structural clarity of **Hanken Grotesk**.

- **Bodoni Moda** delivers high-contrast serifs reminiscent of luxury magazines and architectural monograph publications. Used exclusively for headlines, section displays, and prominent numerical calls.
- **Hanken Grotesk** serves as a clean, highly legible counterpart. It manages long-form body content, data readouts, functional interactive labels, and uppercase tracking elements without visual noise.
- **Case and Tracking**: Display uppercase treatments are styled with deliberate tracking (`letter-spacing: 0.06em` to `0.08em`) on labels and section kickers, reinforcing the bespoke editorial quality shown in the reference materials.

## Layout & Spacing

Layouts follow a clean 12-column grid on desktop and tablet, collapsing to a single-column or 2-column modular rhythm on mobile.

- **Desktop (1024px+)**: Max container width of 1320px, 12 columns, 24px (`1.5rem`) gutters, with generous outer margins of 48px (`3rem`) to let editorial imagery and typography breathe.
- **Tablet (768px - 1023px)**: 8 columns, 20px gutters, 32px margins.
- **Mobile (<768px)**: 4 columns, 16px (`1rem`) gutters, 20px (`1.25rem`) side margins.
- **Compositional Rhythm**: Blocks are grouped using strict multiples of `space-md` (16px) and `space-xl` (40px). Generous vertical section padding (64px to 112px) mimics broadsheet magazine spreads.

## Elevation & Depth

In alignment with strict editorial minimalism, this system abandons diffuse drop shadows and artificial skeuomorphic lighting. Visual depth is established purely through:

- **Surface Contrast**: Stacking `#ece6df` surfaces atop solid `#0f3f49` or vice versa creates crisp, planar separation.
- **Hairline Dividers & Outlines**: Clean 1px solid borders in `#0f3f49` (or `#ece6df` when inverted) ground cards, navigation headers, and segmented panels.
- **Offset Framing**: Critical imagery and highlight cards leverage subtle 1px to 2px offset outlines rather than soft drop shadows to maintain a tactile, physical paper-like construction.

## Shapes

The design system employs **sharp geometry** (`roundedness: 0`). 
- Borders, buttons, cards, dialogs, badges, and input fields all feature crisp 90-degree corners (`border-radius: 0px`).
- Sharp rectangular geometry reinforces the editorial publication feel, celebrating clean structural intersections and distinct grid boundaries.

## Components

### Buttons
- **Primary**: Background `#0f3f49`, text `#ece6df`, zero border radius. On hover, background transitions smoothly to `#7f0508`.
- **Accent (Call-to-Action)**: Background `#7f0508`, text `#ece6df`. On hover, slightly dim tone via full solid state swap or inverted 1px border.
- **Secondary / Outlined**: 1px solid border in `#0f3f49`, transparent background, text `#0f3f49`. On hover, fills solid `#0f3f49` with `#ece6df` text.
- **Text Button**: Text `#0f3f49`, underlined with a 1px offset line that shifts to `#7f0508` upon focus/hover.

### Input Fields & Controls
- **Text Inputs**: Flat background in `#ece6df`, bottom border or full 1px border in `#0f3f49`. Focused state deepens border thickness to 2px `#7f0508`. Placeholder text in `#0f3f49` at 50% opacity.
- **Checkboxes & Radios**: Sharp square and diamond/square marks with 1.5px solid `#0f3f49` stroke. When active/checked, filled with `#0f3f49` or accented with `#7f0508`.

### Chips & Badges
- **Status Chips / Category Tags**: 1px border in `#0f3f49`, text `#0f3f49`, font `label-sm` uppercase with 0.08em letter spacing.
- **Accent Badges**: Solid `#7f0508` background, `#ece6df` text, zero radius.

### Cards & Panels
- **Standard Card**: Base background `#ece6df` with a 1px perimeter border in `#0f3f49`. Padding set to `space-lg` (24px).
- **Featured / Dark Card**: Inverted background in solid `#0f3f49`, content in `#ece6df`, and secondary accents or buttons rendered in `#7f0508`.

### Lists & Tables
- **Lists**: Clean horizontal border-bottom dividers (1px solid `#0f3f49` at 20% opacity or full crisp line). Text in `#0f3f49` with generous vertical cell padding (`space-md`).
- **Data Headers**: Set in `label-sm`, uppercase, font family `Hanken Grotesk`, tracked widely.