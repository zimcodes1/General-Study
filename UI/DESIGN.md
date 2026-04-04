# Design System Strategy: The Celestial Editorial

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Celestial Editorial."** 

Unlike standard SaaS platforms that rely on rigid grids and heavy borders, this system treats the UI as a vast, dark expanse where information floats like celestial bodies. We are moving away from the "boxed-in" dashboard look toward a high-end editorial experience. We achieve this through **intentional asymmetry**, where large display typography creates a focal point, and **tonal depth**, where elements are layered using light rather than lines. The goal is to make the user feel like they are navigating a premium, AI-augmented digital atlas—sophisticated, quiet, and profoundly deep.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
Our palette is rooted in the deep space of `surface` (#0a0e19). Color is not just a decorative choice; it is a functional tool for atmospheric perspective.

*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning content. Boundaries must be defined solely through background color shifts or subtle tonal transitions. To separate a sidebar from a main feed, transition from `surface-container-low` to `surface`.
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers of frosted glass.
    *   **Level 0 (Deep Space):** `surface` or `surface-dim` for the main background.
    *   **Level 1 (The Canvas):** `surface-container-low` for large content areas.
    *   **Level 2 (The Object):** `surface-container` or `surface-container-high` for interactive elements.
*   **The "Glass & Gradient" Rule:** Floating elements (modals, popovers, navigation bars) must use glassmorphism. Combine `surface-variant` at 40% opacity with a `backdrop-blur` of 20px-40px.
*   **Signature Textures:** For high-impact areas like hero buttons or AI states, use a linear gradient from `primary` (#9ba8ff) to `secondary` (#a68cff). This provides a "soul" to the UI that flat colors cannot replicate.

---

## 3. Typography: The Curated Voice
We utilize a pairing of **Manrope** for structural clarity and **Plus Jakarta Sans** for precise labeling.

*   **Display & Headline (Manrope):** Use `display-lg` and `headline-lg` with tight letter-spacing (-0.02em) to create an authoritative, editorial feel. These should be white (`on-surface`) to "pop" against the deep navy.
*   **Title & Body (Manrope):** `title-md` and `body-lg` handle the narrative. Ensure a generous line-height (1.6) to allow the "dark mode" text to breathe, preventing eye fatigue.
*   **Labels (Plus Jakarta Sans):** `label-md` and `label-sm` are used for technical data, metadata, and buttons. This font's slightly wider stance provides a modern, "AI-engineered" aesthetic.

---

## 4. Elevation & Depth: Tonal Layering
In "The Celestial Editorial," we do not use drop shadows to scream for attention. We use them to mimic ambient glow.

*   **The Layering Principle:** Instead of a shadow, place a `surface-container-highest` card on a `surface-container-low` background. This creates a natural "lift" through value contrast alone.
*   **Ambient Glows:** When a floating state is required, use a shadow with a 40px–60px blur and 6% opacity. The shadow color must be tinted with `primary_dim` (#4963ff) rather than black, making the element appear as if it's emitting a soft light.
*   **The "Ghost Border":** If a container requires a perimeter for accessibility, use the `outline_variant` token at 15% opacity. It should be felt, not seen.
*   **Glassmorphism Depth:** For "active" cards, apply a subtle top-down inner glow (1px, white at 10% opacity) to simulate the edge of a glass pane catching a distant light source.

---

## 5. Components: Fluid Primitives

### Buttons
*   **Primary:** Pill-shaped (`rounded-full`). Gradient fill from `primary` to `secondary`. No border. Text in `on-primary-fixed` (Black) for maximum contrast.
*   **Secondary:** Pill-shaped. Background: `surface-container-high`. Subtle `outline-variant` ghost border.
*   **States:** On hover, primary buttons should increase their "glow" (outer shadow spread), never change their base color.

### Input Fields
*   **Geometry:** 16px to 24px corner radius (`rounded-md` to `rounded-lg`).
*   **Style:** `surface-container-low` background. On focus, the background shifts to `surface-container-high` with a subtle `tertiary` (#81ecff) outer glow. Forbid hard-colored focus rings.

### Glassmorphism Cards
*   **Construction:** Use `surface-variant` at 30% opacity. 
*   **Content:** No dividers. Use 32px of internal padding and `body-md` typography to create separation through white space. 

### AI-Insight Chips
*   **Visuals:** Use `tertiary_container` with `tertiary` text. These should feel "electric"—smaller than standard chips, with a slight 2px blur on the text to simulate a digital pulse.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical layouts. A header can be offset to the left with wide open space on the right to create an editorial feel.
*   **Do** use `secondary` (#a68cff) for "magical" or AI-driven moments.
*   **Do** prioritize vertical rhythm. Use the `xl` (3rem) spacing token between major sections to maintain the "minimal" vibe.

### Don't
*   **Don't** use 100% white text for everything. Use `on-surface-variant` (#a7aaba) for secondary info to preserve the dark-room atmosphere.
*   **Don't** use sharp corners. Everything in this system should feel sanded and smooth, like obsidian.
*   **Don't** use standard "Grey" shadows. They look muddy on deep navy. Always tint your shadows with the `primary` blue or `secondary` purple.