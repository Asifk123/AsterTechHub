# Design System Strategy: The Luminal Frontier

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Architect."** 

We are moving away from the "flat" web and into a world of depth, light refraction, and high-fidelity interfaces. This system is designed to feel like a high-end command deck—sophisticated, authoritative, and impossibly advanced. We break the standard "template" look by utilizing wide-gamut gradients, intentional asymmetry in layout, and a focus on **Tonal Layering** rather than structural containment. 

Every element must feel as though it is floating in a void of deep space, illuminated by the bioluminescent glow of the `primary` and `secondary` accents. We prioritize breathing room and "active white space" to ensure that the complex sci-fi aesthetic never feels cluttered or "cheap."

---

## 2. Colors: The Neon & The Void
The palette is rooted in deep space blacks and neon energy. 

*   **Background (#0A0A0F):** This is your canvas. It is not just "black"; it is an infinite depth. 
*   **The "No-Line" Rule:** Under no circumstances are 1px solid borders to be used to section off content. Boundaries must be defined by shifting between `surface-container-low` and `surface-container-lowest`. Let the color transitions do the work of the grid.
*   **Surface Hierarchy & Nesting:** Use the surface-container tiers to create a "tactile" digital environment. 
    *   **Level 0:** `surface` (#131318) for the main background.
    *   **Level 1:** `surface-container-low` (#1B1B20) for large structural sections.
    *   **Level 2:** `surface-container-highest` (#35343A) for interactive cards.
*   **The "Glass & Gradient" Rule:** All floating elements (modals, dropdowns, hero cards) must utilize Glassmorphism. Use a background of `rgba(255, 255, 255, 0.05)` with a `backdrop-blur` of 20px. 
*   **Signature Textures:** Main CTAs must use a linear gradient from `primary` (#A8E8FF) to `primary-container` (#00D4FF) at a 135-degree angle to simulate a glowing light source.

---

## 3. Typography: Technical Precision
We pair the aggressive, technical geometry of **Orbitron** (rendered as `spaceGrotesk` in our tokens) with the hyper-legible neutrality of **Inter**.

*   **Display & Headlines (Orbitron):** Used sparingly for high-impact messaging. The wide tracking and geometric forms convey a sense of "future-tech."
    *   *Rule:* Use `letter-spacing: 0.05em` for all `display-lg` and `headline-lg` to enhance the cinematic feel.
*   **Titles & Body (Inter):** Used for all functional information. 
    *   *Rule:* To maintain the premium feel, never use a font weight below 400 for body text. Use `on-surface-variant` (#BBC9CF) for secondary text to maintain high-contrast accessibility against the dark backgrounds.

---

## 4. Elevation & Depth: Tonal Layering
In this system, depth is not a shadow; it is a manifestation of light.

*   **The Layering Principle:** Avoid shadows for static elements. Instead, place a `surface-container-high` card inside a `surface-container-lowest` section. The slight shift in gray-blue tones creates a sophisticated "lift."
*   **Ambient Glow (Shadows):** When a "floating" effect is required (e.g., a hovered card), use a glow rather than a shadow. Apply a blur of 30px using `primary` at 15% opacity. This mimics the way neon light interacts with a dark surface.
*   **The "Ghost Border" Fallback:** If a container requires more definition, use a "Ghost Border": `outline-variant` (#3C494E) at 15% opacity. It should be felt, not seen.
*   **Glassmorphism Depth:** For high-priority overlays, use a 1px inner-stroke of `primary` at 10% opacity on the top and left edges only. This simulates light hitting the edge of a glass pane.

---

## 5. Components: Functional Scans

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary-container`). No border. `rounded-md` (0.375rem). On hover, add a `primary` outer glow.
*   **Secondary:** Glassmorphism background with a "Ghost Border." Text color is `primary`.
*   **Tertiary:** Ghost button. Orbitron font, all-caps, `label-md` size.

### Cards
*   **Construction:** Use `surface-container-low`. Forbid divider lines.
*   **Separation:** Use `spacing-8` (2.75rem) to separate content blocks within a card. 
*   **Interaction:** On hover, apply a `transform: translateY(-4px)` and a subtle 3D tilt effect (5 degrees max).

### Inputs & Fields
*   **State:** Default state is `surface-container-highest`.
*   **Active:** Border becomes `primary` at 40% opacity with a subtle inner glow.
*   **Validation:** Error states use `error` (#FFB4AB). Do not change the background color; only the "Ghost Border" and the helper text.

### Additional Signature Component: The "Pulse Tracer"
*   **The Tracer:** A 2px tall horizontal line using the `secondary` (#D9B9FF) gradient that animates across the top of a section or card when it enters the viewport. This reinforces the "scanning" sci-fi aesthetic.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts. A 60/40 split is often more sophisticated than a 50/50 split.
*   **Do** use "Breathing Room." If a layout feels cramped, increase spacing to the next tier in the scale (e.g., shift from `spacing-10` to `spacing-12`).
*   **Do** use `backdrop-blur` generously on all overlapping surfaces.

### Don't:
*   **Don't** use 100% white (#FFFFFF) for long-form body text; use `on-surface` (#E4E1E9) to reduce eye strain.
*   **Don't** use "Drop Shadows." Use "Glows."
*   **Don't** use hard 90-degree corners. Even the most "brutal" sci-fi UI needs the `DEFAULT` (0.25rem) radius to feel premium and engineered.
*   **Don't** use Dividers. If two pieces of content need to be separated, use a background color shift or `spacing-6`.