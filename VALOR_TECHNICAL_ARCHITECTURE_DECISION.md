# Valor Qatar — Technical, Media & Conversion Architecture Decision

**Date:** 2026-11-25  
**Scope:** Independent technical stack selection, media pipeline architecture, conversion journeys, analytics, SEO, and workspace tooling governance for **Valor Qatar** (a standalone customer-facing website, independent of Sendian OS).

---

## 1. Framework & Stack Comparison

Evaluated against Valor Qatar's confirmed initial scope: **bilingual (`EN`/`AR`) static product catalogue and WhatsApp-driven consultation platform** with zero initial backend, auth, cart, or payment gateway, plus clean future CMS and e-commerce extensibility.

| Criterion | Weight | Modular Vanilla HTML/CSS/JS | **Astro 5 (Static SSG + Islands)** | Next.js (Static Export / Hybrid) |
| :--- | :---: | :--- | :--- | :--- |
| **Performance / CWV** | High | Fast if simple, but manual partial reuse/bundling/image optimization scales poorly across 200+ PDPs × 2 languages. | **Best-in-class:** Zero client JS by default; ships pure HTML/CSS per route with tiny JS islands only for search/filter/gallery. | Ships React hydration runtime (~85–130 KB+ gzipped) even on static marketing/product pages. |
| **SEO & Multi-Page SSG** | High | Requires custom static HTML generator scripts to produce 400+ localized PDP/category HTML files + sitemaps. | **Native:** File-based `/en/` and `/ar/` i18n routing, automatic `@astrojs/sitemap`, canonical/hreflang per route, zero client routing penalties. | Strong SSG/App Router, but heavier setup for pure static multi-page exports (`output: 'export'` disables `next/image` optimization unless custom loader). |
| **Catalogue Management** | High | Manual JSON wiring; no built-in schema validation. | **Native Content Collections + Zod:** Validates all ~200+ JSON product records at build time; fails build on missing images, duplicate SKUs, or invalid fields. | Requires custom Zod script or headless CMS wiring. |
| **Arabic & RTL Support** | High | Manual CSS logical properties + manual duplication of templates. | **First-class:** Shared Astro layout sets `lang={locale}` and `dir={locale === 'ar' ? 'rtl' : 'ltr'}` cleanly at build time with CSS logical properties (`margin-inline`, `padding-inline`). | Good, via Next.js i18n middleware or `[locale]` dynamic segments. |
| **Hosting Cost & Ops** | High | Free static CDN (Cloudflare Pages / Netlify / Vercel). | **Free / minimal static CDN** (Cloudflare Pages, Vercel, or Netlify) — zero Node server, zero DB, zero cold starts. | Static export is cheap; Hybrid SSR requires Node/Edge runtime and higher ops complexity. |
| **Future CMS Readiness** | Med | Poor without rewrite. | **Seamless:** Swap `getCollection('products')` loader from local JSON to Sanity, Directus, Strapi, or Payload at build/webhook time. | Seamless (built-in ISR/CMS webhooks). |
| **Future E-Commerce** | Med | Poor (requires rewriting state/cart/checkout). | **Seamless:** Astro Islands allow mounting React/Preact cart & checkout islands (e.g., Shopify Storefront API, Stripe, or Qatar gateways like QPay/MyFatoorah/Sadad) without rebuilding static pages. | Native React ecosystem for full cart/checkout apps. |
| **Maintainability & DX** | High | No type safety or component scoping without custom Vite setup. | **High:** Typed `.astro` components, scoped CSS, TypeScript strict mode, minimal dependency footprint. | High, though React Client/Server boundary adds complexity not needed for a catalogue. |

### Architectural Decision: **Adopt Astro 5 (Static Site Generation + TypeScript + Selective Vanilla/Preact Islands)**
- **Why Astro wins for Valor Qatar:**
  1. Produces **zero-JS static HTML** for the Homepage, Category PLPs, Occasion pages, About, and ~200×2 localized PDPs — ideal for Qatar 4G/5G mobile visitors arriving from Instagram links.
  2. Built-in **Content Collections + Zod** eliminates the entire class of catalogue data bugs discovered in `products.js` / `generate_products_data.py`.
  3. **Zero backend / zero database / zero auth complexity** in Phase 2, keeping hosting cost near `$0/month` on Cloudflare Pages or Vercel with instant atomic rollbacks.
  4. **Zero-rebuild future path:** Adding headless CMS webhooks or React/Preact shopping-cart islands later requires adding an integration, not migrating frameworks.

---

## 2. Media Architecture (196.09 MiB, Max 5.51 MiB Master Assets)

### Principles
1. **Non-Destructive Master Preservation:** Never overwrite or delete the 470 original source assets. Store masters cleanly outside the built web bundle (e.g., `assets/masters/` via Git LFS or an immutable Cloudflare R2 `masters` bucket) while publishing only optimized derivatives.
2. **Perceptual Deduplication & Grouping:** Before build, resolve the 15 strict `dHash` near-duplicate clusters and group multi-angle photos under parent product SKUs (`images[]` array with `primary`, `angle`, `interior`, `detail`).
3. **Automated Multi-Format Build Pipeline (Sharp / Astro Assets):**
   - Generate responsive widths: **`400w`**, **`800w`**, **`1200w`**, and **`1600w`** (never serve `4096×4096` or `5.51 MiB` files to mobile viewports).
   - Output formats in priority order: **AVIF** (primary modern compression), **WebP** (broad fallback), and **JPEG** (`<picture>` / `srcset` fallback; automatically converts the `.jfif` outlier to standard `.avif`/`.webp`/`.jpg`).
   - Enforce explicit `width` and `height` HTML attributes on every `<img>` to prevent Cumulative Layout Shift (`CLS < 0.05`).
   - Hero LCP image: `loading="eager"`, `fetchpriority="high"`, `<link rel="preload" as="image">`. Below-the-fold cards: `loading="lazy"`, `decoding="async"`.
   - Every published product image requires verified bilingual `alt` text (`alt.en`, `alt.ar`).

### Storage & CDN Decision: **Cloudflare R2 + Cloudflare CDN (or Cloudflare Pages Static Assets for Grouped Derivative Set)**
- **If grouped + optimized down to ~180–220 curated products (~250–350 selected gallery images across 4 widths in AVIF/WebP/JPG):** total optimized derivative payload shrinks from **196 MiB** to **~35–55 MiB**.
- **Recommendation:** Host the **static Astro HTML/CSS/JS on Cloudflare Pages** and serve **optimized responsive media derivatives from a dedicated Cloudflare R2 custom domain (`media.valorqatar.com`)** (or Astro build assets if total output stays well under Cloudflare Pages' 25 MiB per-file / 20,000-file limits — every derivative is <250 KB). Using R2 decouples heavy binary media from Git commits (`git clone` stays <5 MB), enables long-lived `Cache-Control: public, max-age=31536000, immutable` edge caching in Doha/GCC PoPs, and supports instant cache-busted asset updates.

---

## 3. Conversion Strategy & Analytics Architecture

### Core Conversion Journeys
1. **Browse → PDP → WhatsApp Enquiry:** Category PLP → Product Card → Dedicated PDP (multi-angle gallery, confirmed specs, variant selector) → Bilingual WhatsApp link (`https://wa.me/<VERIFIED_NUMBER>?text=...`).
2. **Occasion → Collection → PDP → Enquiry:** Occasion banner/hub (e.g., *Ramadan & Eid*, *Newborn*, *Qatar National Day*) → Filtered occasion showcase → PDP → WhatsApp enquiry.
3. **Search → PDP → Enquiry:** Instant client-side bilingual search (using lightweight Pagefind or prebuilt JSON search index `< 40 KB` gzipped — never 722 KB!) → PDP → WhatsApp enquiry.
4. **Custom Gifting Consultation (Replacing Current Fixed-Price Builder):**
   - **Audit Finding:** The prototype's `#builder` outputs a fabricated `"900 QAR"` total (`+450/+180/+220/+50 QAR`) for arbitrary pairings (including physically incompatible ones like Warak Enab inside a horse box with roses).
   - **Target Design:** Replace it with a **Bespoke Gifting & Majlis Consultation Wizard**: captures (1) Occasion, (2) Preferred Presentation Style (Heritage Box, Stepped Stand, Acrylic Display, Pyramid Tower), (3) Category Focus (Chocolates, Florals, Dates, Savoury, Combination), (4) Estimated Scale / Guest Count, (5) Preferred Palette, and (6) Custom Arabic Calligraphy Note — producing a structured, language-matched **Quotation Request via WhatsApp** with **no fabricated pricing**.
5. **Corporate & VIP Hospitality Consultation:** Dedicated consultation journey capturing company/event name, quantity tier, branding/ribbon needs, and target event date.

### WhatsApp Payload Standard
- Generated dynamically in the visitor's active language (`EN` or `AR`) containing:
  - Product Name (`EN` / `AR`), Verified SKU, Selected Variant, Selected Customizations (e.g., acrylic topper text), Canonical Product URL, and Language tag.
- Phone number stored in **one centralized config module** (`src/config/business.ts`) and rendered inside `<bdi dir="ltr">` so RTL layouts never reverse digits.

### Analytics Specification (Consent-Aware Event Schema)
Track via lightweight GA4 / Plausible / Cloudflare Web Analytics abstraction (`src/lib/analytics.ts`):
- `view_item_list` (`category_id`, `occasion_id`, `locale`)
- `view_item` (`sku`, `category_id`, `pricing_mode`, `locale`)
- `search` (`search_term`, `results_count`, `locale`)
- `select_variant` (`sku`, `variant_sku`, `locale`)
- `whatsapp_enquiry_click` (`sku`, `source_surface`: `'pdp' | 'card' | 'bespoke' | 'corporate' | 'header'`, `locale`)
- `bespoke_consultation_submit` (`occasion`, `presentation_style`, `locale`)

---

## 4. SEO & Bilingual Localization Architecture

- **Static Pre-Rendered HTML:** Every English and Arabic route is pre-rendered to static HTML at build time.
- **Head Metadata Contract (`BaseLayout.astro`):**
  - Unique `<title>` and `<meta name="description">` per route & locale.
  - `<link rel="canonical" href="https://<domain>/<locale>/...">`
  - Symmetric `<link rel="alternate" hreflang="en-QA" ...>`, `<link rel="alternate" hreflang="ar-QA" ...>`, and `<link rel="alternate" hreflang="x-default" ...>`.
  - Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:locale`: `en_US` / `ar_QA`).
- **XML Sitemap & Robots:** Auto-generated `sitemap-index.xml` covering all `published` routes; `robots.txt` pointing to sitemap and blocking internal preview/draft paths if any.
- **Structured Data (Verified-Only JSON-LD):**
  - `Organization` & `LocalBusiness` (only emitting street address, hours, and phone once verified in `BVR-01..04`).
  - `BreadcrumbList` on all collection, occasion, and product pages.
  - `Product` schema on PDPs — emitting `offers` (`priceCurrency: "QAR"`, `price`) **strictly** when `pricingMode === 'fixed_qar'` and `verificationStatus === 'verified'`; otherwise omitting fabricated prices.
- **First-Class Arabic (`dir="rtl"`):**
  - Separate centralized translation dictionaries (`src/i18n/en.ts`, `src/i18n/ar.ts`) typed so missing Arabic keys **fail TypeScript compilation at build time**.
  - 100% CSS logical properties (`margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `border-inline-start`) — zero physical `left`/`right` positioning flips to debug.
  - Explicit `<bdi dir="ltr">` wrapping all phone numbers, SKUs, and Latin brand marks inside Arabic text.

---

## 5. Quality Standards & `.agent/` / `.agents/` Governance

### Code & Quality Standards (Adapted from Organization Discipline for Standalone Static Site)
- **TypeScript (`strict: true`)**, **Prettier**, **ESLint** (with `eslint-plugin-jsx-a11y` / `eslint-plugin-astro`), and **Stylelint**.
- **Automated CI Pipeline (GitHub Actions):**
  1. `npm run format:check` & `npm run lint` & `npm run typecheck`
  2. `npm run validate:catalog` (Zod schema + image existence + zero placeholder/unverified-price leaks)
  3. `npm run build` (`astro check && astro build`)
  4. **Playwright E2E + Axe-Core Accessibility Gate:** Tests Desktop (`1440×900`), Tablet (`768×1024`), and Mobile (`375×812`) in both `/en/` and `/ar/`, verifying zero console errors, zero horizontal overflow (`scrollWidth <= innerWidth`), zero WCAG 2.2 AA violations, working search/filters, and valid WhatsApp URL generation.
  5. **Lighthouse CI Gate:** Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

### `.agent/` and `.agents/` Separation Recommendation
- **Problem Observed:** The repo currently commits 6.36 MB of generic third-party AI agent skills (`.agent/skills/impeccable` and `.agents/skills/{banner-design,brand,design,design-system,slides,ui-styling,ui-ux-pro-max}` including upstream unit test suites) alongside project files, and `.agents/hooks.json` has a broken relative path (`..\.agent\...`).
- **Recommended Separation:**
  1. **Keep in Repository (Project-Specific Truth):** `PRODUCT.md`, `DESIGN.md`, `.impeccable/config.json`, `.impeccable/surfaces/`, and `.impeccable/design.json`.
  2. **Move Generic Skills Out of App Repo (or Exclude from Deploy Artifact):** Install `impeccable` and `ui-ux-pro-max` in user-global Antigravity scope (`~/.gemini/config/skills/` or `~/.agents/skills/`) or reference via pinned dev documentation (`CONTRIBUTING.md`) instead of committing 6.36 MB of upstream skill test fixtures into the website repository. If kept locally during development, configure `.agents/hooks.json` with a project-root-relative path (`.\.agent\skills\impeccable\scripts\impeccable.cmd`) and ensure Cloudflare Pages/Vercel deploys only `dist/`.
