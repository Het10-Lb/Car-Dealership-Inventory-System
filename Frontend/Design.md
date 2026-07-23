---
name: Kinetic Velocity
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e4beb6'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#ab8982'
  outline-variant: '#5b403a'
  surface-tint: '#ffb4a4'
  primary: '#ffb4a4'
  on-primary: '#630e00'
  primary-container: '#ff5733'
  on-primary-container: '#580c00'
  inverse-primary: '#b72301'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#efc200'
  on-tertiary: '#3c2f00'
  tertiary-container: '#cea700'
  on-tertiary-container: '#4e3e00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad3'
  primary-fixed-dim: '#ffb4a4'
  on-primary-fixed: '#3d0600'
  on-primary-fixed-variant: '#8c1800'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#ffe083'
  tertiary-fixed-dim: '#eec200'
  on-tertiary-fixed: '#231b00'
  on-tertiary-fixed-variant: '#574500'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-padding: 2rem
  gutter: 1.5rem
  card-gap: 1.5rem
  section-margin: 3rem
---

## Brand & Style
This design system captures a high-performance, premium automotive aesthetic tailored for a car dealership inventory management platform. The brand personality is powerful, precise, and sophisticated, designed to evoke a sense of speed and high-end luxury.

The visual style is **Corporate / Modern** with a dark-mode focus. It utilizes deep tonal layering and subtle borders to create a structured, "cockpit-like" experience. High-contrast typography and vibrant performance-inspired accents ensure the UI remains functional for data-heavy inventory tasks while maintaining a premium editorial feel.

## Colors
The palette is built on a "Deep Midnight" foundation, using layered greys to establish hierarchy without relying on heavy shadows. 

- **Primary (Ignition Orange):** A high-vibrancy orange-red used exclusively for primary CTAs, active states, and critical price information.
- **Secondary (Pure White):** Used for primary text and high-priority iconography to ensure maximum legibility against the dark background.
- **Tertiary (Track Gold):** Reserved for ratings and secondary highlights.
- **Neutral (Carbon):** A range of greys from `#0A0A0A` (background) to `#262626` (borders/dividers) that mimic automotive materials like carbon fiber and matte metal.

## Typography
We use **Hanken Grotesk** for its sharp, contemporary geometry which reflects modern automotive branding. For technical data and UI labels, **Geist** provides a monospaced-adjacent clarity that feels industrial and precise.

Scale headlines aggressively for desktop views to create an editorial impact, but collapse them for mobile to maintain a compact, "utility-first" interface. Use semi-bold weights for vehicle names and prices to ensure they dominate the visual hierarchy.

## Layout & Spacing
The system utilizes a **12-column fluid grid** for the main dashboard content. A persistent sidebar (280px) houses navigation, while the main stage expands to fill the viewport.

- **Desktop:** 24px (1.5rem) gutters between inventory cards.
- **Tablet:** 16px (1rem) gutters; grid reflows from 4 columns to 2.
- **Mobile:** Single column inventory with 16px side margins.

Use generous internal padding (24px) within cards and containers to maintain a premium feel. Avoid overcrowding data; use the primary brand accent sparingly to guide the eye through the layout.

## Elevation & Depth
In this dark-themed system, depth is communicated through **Tonal Layering** and **Low-contrast outlines** rather than shadows.

- **Level 0 (Base):** `#0A0A0A` for the main application background.
- **Level 1 (Surface):** `#161616` for cards, sidebar, and headers.
- **Outlines:** Elements are defined by a 1px solid border of `#262626`. 
- **Active State:** When a card is selected or hovered, the border transitions to the primary orange or a lighter grey (`#404040`) to indicate interactivity.

## Shapes
The shape language follows a **Rounded** philosophy (0.5rem / 8px). This softens the high-contrast "tech" look, making the interface feel more approachable and modern.

- **Cards & Input Fields:** 8px (0.5rem) radius.
- **Buttons & Chips:** 12px (0.75rem) to 16px (1rem) radius for a more ergonomic, "touchable" appearance.
- **Avatar/Status Indicators:** Fully circular (9999px).

## Components

### Buttons
- **Primary:** Solid `#FF5733` with white text. High-contrast, bold font weight.
- **Secondary:** Transparent background with a 1px `#262626` border. White text.
- **Icon Buttons:** Circular or slightly rounded squares with subtle `#262626` borders.

### Inventory Cards
Cards should feature a large vehicle image at the top, followed by a title section. Technical specs (HP, Transmission) should be displayed with small icons and label-sm typography. The price is the primary anchor, always highlighted in the brand's orange accent.

### Chips/Tags
Use "pill" shapes for status indicators (e.g., "New," "Sold," "Reserved"). Use low-opacity fills of the status color (e.g., Orange at 10% opacity) with full-opacity text for a sophisticated glass-like effect.

### Input Fields
Inputs should have a `#161616` background and a `#262626` border. Focus states must trigger a 1px border highlight in the primary orange color. Use **Geist** for input text to enhance readability of VINs and stock numbers.

### Navigation Sidebar
Darker than the main content area (`#0F0F0F`). Active links should be indicated by a vertical orange stripe on the left edge and a subtle text weight increase.