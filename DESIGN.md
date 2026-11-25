---
name: Valor Qatar
description: Haute Chocolaterie, Bespoke Floristry & Qatari Majlis Hospitality
colors:
  canvas-ivory: "#FAF7F2"
  surface-white: "#FFFFFF"
  surface-sand: "#F1EAE0"
  border-hairline: "#DDD4C8"
  border-strong: "#B9AC9C"
  ink-obsidian: "#1C1815"
  ink-muted: "#595149"
  brand-terracotta: "#963E28"
  brand-terracotta-hover: "#7D321F"
  brand-terracotta-tint: "#F7EAE6"
  heritage-slate: "#263846"
  qatar-maroon: "#6B132C"
  cacao-taupe: "#6B5446"
  foil-gold-text: "#7D5C1B"
  foil-gold-accent: "#B89242"
  concierge-green: "#136B36"
  concierge-green-hover: "#0E5229"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "3.25rem"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "2.125rem"
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0em"
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.06em"
  arabic-display:
    fontFamily: "Amiri, Georgia, serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0em"
  arabic-body:
    fontFamily: "IBM Plex Sans Arabic, Cairo, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "0em"
rounded:
  none: "0px"
  xs: "2px"
  sm: "4px"
  md: "8px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "64px"
  3xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.ink-obsidian}"
    textColor: "{colors.canvas-ivory}"
    rounded: "{rounded.sm}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.brand-terracotta}"
  button-secondary:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink-obsidian}"
    rounded: "{rounded.sm}"
    padding: "14px 26px"
  button-concierge:
    backgroundColor: "{colors.concierge-green}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
  card-product:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink-obsidian}"
    rounded: "{rounded.sm}"
    padding: "16px"
---

# Design System: Valor Qatar

## 1. Overview

**Creative North Star: "The Qatari Salon of Craft"**

Valor Qatar's visual language is derived directly from its physical packaging, bespoke pedestals, and hospitality rituals—not from external DTC templates or internal enterprise tools. Across Valor's photography, four authentic material worlds anchor the brand: **Porcelain White & Gold Pedestals**, **Terracotta Lattice Signature Boxes**, **Warm Cacao Taupe Ribbon Boxes**, and the **Slate-Blue Arabian Horse Heritage Collection**, complemented by **Qatar National Maroon** for seasonal national editions.

The website functions as an editorial gallery and curated salon: restrained porcelain-ivory canvases, crisp 1px architectural hairlines, uncrowded typography, and full-bleed product photography that lets the sheen of tempered chocolate, gold Arabic calligraphy, and fresh Dutch petals speak without visual noise.

**Key Characteristics:**
- **Editorial Restraint:** Generous breathing room, crisp `4px` architectural radii (rejecting bubbly `16–24px` SaaS pill cards), and flat tonal layering over heavy drop shadows.
- **Authentic Packaging Chromatics:** Every color token traces directly to physical Valor boxes, ribbons, or national heritage motifs, calibrated mathematically to pass WCAG 2.2 AA (`≥ 4.5:1`).
- **Roman Dignity + Native Arabic Calligraphy:** Roman display serifs (`Cormorant Garamond`) avoid AI-default italic hero cliches, paired seamlessly with classical Arabic (`Amiri`) and crisp Arabic UI sans (`IBM Plex Sans Arabic`).
- **Bespoke SVG Craft:** Zero Unicode emojis in UI controls; custom vector rendering of Valor's symmetrical **Tulip-V Crest** paired with consistent `1.5px`-stroke Lucide/custom SVGs.

---

## 2. Colors

All foreground/background pairings have been verified for WCAG 2.2 AA compliance (`≥ 4.5:1` normal text, `≥ 3.0:1` large text):

| Token | Hex | Role & Physical Origin | Verified Contrast |
| :--- | :--- | :--- | :--- |
| `canvas-ivory` | `#FAF7F2` | Primary page canvas (warm marble & porcelain pedestal tone) | Base light surface |
| `surface-white` | `#FFFFFF` | Product cards, slide-over drawers, PDP panels | High-key studio backdrop |
| `surface-sand` | `#F1EAE0` | Subtle band alternation, filter toolbar wells, active tabs | Soft tonal contrast |
| `border-hairline` | `#DDD4C8` | 1px architectural card edges, table rules, section dividers | Subtle structure |
| `ink-obsidian` | `#1C1815` | Primary headings, body copy, primary CTA fill (matte black carved boxes) | **16.5:1** on Ivory |
| `ink-muted` | `#595149` | Metadata, secondary copy, breadcrumbs, labels | **7.28:1** on Ivory / **7.78:1** on White |
| `brand-terracotta` | `#963E28` | Primary brand accent, active state, editorial highlight (Valor Terracotta Box) | **6.51:1** on Ivory / **6.96:1** on White |
| `heritage-slate` | `#263846` | Editorial Heritage / Arabian Horse spotlight bands | **11.32:1** Ivory on Slate |
| `qatar-maroon` | `#6B132C` | Top announcement ribbon, National Day accents, brand crest accent | **11.20:1** Ivory on Maroon |
| `cacao-taupe` | `#6B5446` | Secondary warm chocolate/ribbon packaging accents | Supporting decorative/chip fill |
| `foil-gold-text` | `#7D5C1B` | Text-safe antique gold for labels & calligraphic quotes on light canvas | **5.75:1** on Ivory |
| `foil-gold-accent` | `#B89242` | Pure decorative hairline rules, borders, and dark-surface metallic highlights | Non-text ornament / dark-bg only |
| `concierge-green` | `#136B36` | Accessible WhatsApp concierge CTA (replaces low-contrast `#25D366` 2.0:1) | **6.60:1** White on Green |

---

## 3. Typography

- **English Display & Editorial Headings:** `Cormorant Garamond` (weights `500`, `600`, `700`). Set **upright (roman)** in hero headlines—never force oversized italic display scripts as a default formula.
- **English UI & Body:** `Plus Jakarta Sans` (weights `400`, `500`, `600`, `700`), tabular numerals (`font-variant-numeric: tabular-nums`) on all SKUs, dimensions, and QAR prices.
- **Arabic Display:** `Amiri` (weights `400`, `700`) for calligraphic elegance matching Arabic acrylic toppers and editorial titles.
- **Arabic UI & Body:** `IBM Plex Sans Arabic` (fallback `Cairo`) at `line-height: 1.75` for crisp RTL scanning across dense category labels and PDP specifications.

### Modular Scale & Floors
- **Hero Display (`h1`):** `clamp(2.25rem, 4vw, 3.25rem)` (36px–52px), `line-height: 1.08`, `letter-spacing: -0.02em`, `text-wrap: balance`.
- **Section Heading (`h2`):** `clamp(1.625rem, 2.5vw, 2.125rem)` (26px–34px), `text-wrap: balance`.
- **Card / Component Title (`h3`):** `1.125rem` (18px), weight `600`.
- **Body Copy:** `1rem` (16px), measure constrained to `60ch–72ch`, `text-wrap: pretty`.
- **UI Labels / Metadata:** Minimum **`0.75rem` (12px)** — **no functional text below `11px`** anywhere (including crest subtitles and footers).

---

## 4. Layout

- **Max Container Width:** `1360px` with responsive horizontal gutter (`16px` on `<640px`, `24px` on `640px–1023px`, `40px` on `≥1024px`).
- **Spacing Rhythm (8px Grid):** Tight intra-group spacing (`4px`–`12px`), clear component breathing room (`16px`–`24px`), generous section separation (`64px`–`96px`). Headings always carry larger `margin-block-start` than `margin-block-end`.
- **Responsive Grids:**
  - Product Listing Grid: `1 column` (`<480px`), `2 columns` (`480px–899px`), `3 columns` (`900px–1199px`), `4 columns` (`≥1200px`). Never hardcode inline `grid-template-columns`.
  - PDP Layout: Single-column media-first stack on mobile with sticky bottom concierge bar; `58% / 42%` gallery-to-buybox split on desktop (`≥1024px`).
- **RTL Native Mirroring:** All directional layouts, margins, paddings, icons with directionality (arrows/chevrons), and drawer anchors use CSS Logical Properties (`inline-start`, `inline-end`, `margin-inline`, `padding-inline`). Phone numbers and SKUs always sit inside `<bdi dir="ltr">`.

---

## 5. Elevation & Depth

Valor relies on **tonal surface contrast and crisp 1px hairlines** rather than floating drop shadows:
- **Level 0 (Canvas):** `#FAF7F2` (`canvas-ivory`).
- **Level 1 (Card / Surface):** `#FFFFFF` with `1px solid #DDD4C8` (`border-hairline`), zero resting shadow.
- **Level 2 (Interactive Hover):** Border shifts to `#B9AC9C` (`border-strong`) with a subtle directional shadow (`0 8px 24px -6px rgba(28, 24, 21, 0.08)`).
- **Level 3 (Drawers / Modals / Dropdowns):** `#FFFFFF` with `0 20px 50px -12px rgba(28, 24, 21, 0.18)` and backdrop `rgba(28, 24, 21, 0.55)`.

---

## 6. Shapes

- **Architectural Precision:** Primary containers, cards, inputs, and buttons use subtle crisp corners (`4px` default, `8px` for large feature blocks) echoing Valor's structured wooden, acrylic, and hexagonal presentation boxes.
- **Photographic Aspect Ratios:**
  - Product Grid Cards: Strict uniform **`4:5` portrait ratio** (`aspect-ratio: 4 / 5; object-fit: cover`) to frame tall cone towers, floral bouquets, and angled gift boxes cleanly without clipping crowns or toppers.
  - Category Discovery Thumbnails: `4:5` or `1:1` crisp framed tiles (never arbitrary circular cutouts where tall towers get clipped).
- **Focus Rings:** Universal `:focus-visible` rule: `outline: 2px solid #963E28; outline-offset: 2px;` on every interactive link, button, tab, and form control.

---

## 7. Components

1. **Brand Mark (`<ValorBrand />`):** Inline vector SVG of the Valor Tulip-V Crest alongside the wordmark (`VALOR` / `فالور`) + `"QATAR • DOHA"` at `≥12px`.
2. **Site Header & Navigation:**
   - Top utility strip (`#6B132C` Qatar Maroon): Bilingual delivery/concierge notice + `<bdi dir="ltr">` phone link.
   - Sticky primary header (`#FAF7F2` translucent with hairline bottom border): Mobile drawer button (`<1024px`), Brand Mark, 6–7 clean top-level links (`≥1024px`), Search button, Language switch (`العربية` / `EN`), and clean text-contrast-safe WhatsApp link.
3. **Product Card (`<ProductCard />`):**
   - Clickable `<a href="...">` wrapping the entire card or primary title/image cleanly (no `<div onclick>`).
   - `4:5` framed photograph (swap to alternate interior/angle shot on hover when available).
   - At most **1 restrained text tag** (only when genuinely meaningful, e.g., `Seasonal` or `Made to Order`), category label (`12px`), `h3` product title (max 2 lines), and verified price (`XXX QAR` / `XXX ر.ق`) or `Price on Request` (`السعر عند الطلب`).
4. **Product Detail Buy-Box (`<EnquiryPanel />`):**
   - Multi-image thumbnail gallery (keyboard-navigable).
   - Variant selector (`radiogroup` with clear selected border, never native hidden radios without focus).
   - Customization controls (Acrylic Arabic topper text, floral color preference, gift card note).
   - Primary WhatsApp Concierge CTA (`#136B36` with `#FFFFFF` text, `6.6:1` contrast) generating a localized bilingual message.
5. **Bespoke Consultation Form (`<BespokeWizard />`):**
   - Progressive multi-step or grouped clean form (Occasion, Presentation Type, Category Mix, Scale/Guests, Calligraphy Note) outputting a formatted WhatsApp brief—zero synthetic price math.

---

## 8. Do's and Don'ts

### Do
- **Do** extract real brand photography colors (Terracotta, Heritage Slate, Taupe, Ivory, Gold) and keep every text surface `≥ 4.5:1` contrast.
- **Do** render every interactive card, filter, modal close button, and drawer trigger as real semantic `<a href>` or `<button type="button">`.
- **Do** respect `@media (prefers-reduced-motion: reduce)` by disabling scale/translate transitions.
- **Do** style browser surfaces from the palette (`::selection` tinted soft terracotta/sand, custom scrollbars, `accent-color: #963E28`).

### Don't
- **Don't** place tiny uppercase eyebrow/kicker labels directly above section headings (`kicker-above-heading`). Let headings stand on their own weight.
- **Don't** nest bordered cards inside bordered cards (`nested-cards`). Use background shifts or 1px dividers.
- **Don't** use Unicode emojis (`🌸`, `🍫`, `💬`, `🔍`) as UI icons; use crisp Lucide/custom SVGs.
- **Don't** display `"Riviera"`, `"Bouqs"`, or internal Sendian OS styles anywhere in code, tokens, or copy.
- **Don't** fabricate prices, weights, ingredients, addresses, or hours that have not passed the Business Verification Register.
