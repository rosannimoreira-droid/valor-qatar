# Valor Qatar — Production Acceptance Criteria

**Target Standards:** WCAG 2.2 AA · Core Web Vitals ("Good" tier) · Zero Unverified Claims · Bilingual EN/AR Parity  
**Release Rule:** Production launch is blocked unless **100% of P0 criteria** pass in automated CI and final staging verification.

---

## 1. Catalogue Data Integrity & Governance Criteria

| ID | Criterion | Verification Method | Threshold |
| :--- | :--- | :--- | :--- |
| **AC-DATA-01** | Every published product passes strict Zod/JSON Schema validation (`id`, `sku`, `slug.{en,ar}`, `name.{en,ar}`, `primaryCategory`, `images[]`, `pricingMode`, `publicationStatus`, `verificationStatus`). | `npm run validate:catalog` | 0 schema errors |
| **AC-DATA-02** | Zero placeholder titles (`"Selection #01"`, etc.) or legacy competitor references (`"Bouqs"`, `"Riviera"`) exist anywhere in code, data, CSS tokens, or UI copy. | Automated regex grep check in CI | 0 matches |
| **AC-DATA-03** | Zero unverified synthetic prices (`priceQar`) appear on UI or in JSON-LD `offers`. Unverified SKUs display `"Price on Request"` / `"السعر عند الطلب"`. | Catalog validator + DOM assertion | 0 unverified price leaks |
| **AC-DATA-04** | Every `images[].masterPath` resolves to an existing image file and every generated responsive variant (`AVIF`/`WebP`/`JPG`) returns HTTP 200. | Build pipeline + Playwright network check | 0 broken images / 404s |
| **AC-DATA-05** | All active filter options (categories, occasions) contain ≥ 1 published item, or empty facets are hidden automatically. | Automated route & filter check | 0 dead/empty filter states |
| **AC-DATA-06** | Non-shoppable brand/craft/CSR photography is excluded from shoppable product grids. | Category assertion in catalog validator | 0 editorial photos in PLPs |

---

## 2. Media & Performance Budgets (Core Web Vitals)

Measured via Lighthouse CI (Mobile 4G throttling) & Playwright:

| Metric / Budget | Target | Scope |
| :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | **≤ 2.5 s** | Homepage, PLPs, and PDPs on mobile simulation |
| **INP (Interaction to Next Paint)** | **≤ 200 ms** | Filter changes, variant switching, search input, mobile drawer |
| **CLS (Cumulative Layout Shift)** | **≤ 0.05** | Explicit `width`/`height` on every `<img>`; `font-display: swap` |
| **Lighthouse Performance Score** | **≥ 90** | English & Arabic mobile + desktop audits |
| **Initial JS Bundle (Static Routes)** | **≤ 35 KB gzipped** | Zero 722 KB monolithic catalog JS payload |
| **Grid Thumbnail Image Payload** | **≤ 150 KB** (`400w`/`800w` AVIF/WebP) | Zero raw >1 MB JPEGs served to mobile or desktop cards |
| **Hero / PDP Primary Image** | **≤ 250 KB** (AVIF/WebP) | `fetchpriority="high"` on LCP hero only; `loading="lazy"` below fold |
| **Original Masters Integrity** | **100% preserved** | Raw 470 files untouched in archival/master location |

---

## 3. Accessibility Criteria (WCAG 2.2 AA)

| ID | Criterion | Verification Method |
| :--- | :--- | :--- |
| **AC-A11Y-01** | Zero critical or serious violations across `axe-core` and `impeccable detect` on Homepage, PLP, PDP, Bespoke, and Contact in both `EN` and `AR`. | Automated Playwright + `@axe-core/playwright` + `impeccable detect` |
| **AC-A11Y-02** | Text contrast ≥ `4.5:1` for normal text and ≥ `3.0:1` for large text (`≥24px` or `≥18.66px bold`), including WhatsApp CTAs (`#136B36` / `#FFFFFF` = `6.6:1`) and Terracotta accents (`#963E28` = `6.51–6.96:1`). | Automated contrast audit |
| **AC-A11Y-03** | Complete keyboard navigation (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`): all product cards, filters, variant radios, gallery thumbnails, mobile drawer, and dialogs are operable without a mouse, with visible `:focus-visible` outlines. | Playwright keyboard traversal test |
| **AC-A11Y-04** | Valid sequential heading hierarchy (`h1` → `h2` → `h3`) with zero skipped levels, proper semantic landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`), and no clickable `<div>`/`<h3>` elements. | DOM outline check & `impeccable detect` |
| **AC-A11Y-05** | Meaningful bilingual `alt` text on all product/editorial images; decorative SVGs marked `aria-hidden="true"`; zero Unicode emojis used as UI icons. | Schema + DOM check |
| **AC-A11Y-06** | Animations honor `@media (prefers-reduced-motion: reduce)`. | CSS audit + Playwright reduced-motion test |

---

## 4. Bilingual (`EN` / `AR`) & RTL Parity Criteria

| ID | Criterion | Verification Method |
| :--- | :--- | :--- |
| **AC-I18N-01** | `/ar/*` routes render `<html lang="ar" dir="rtl">` and `/en/*` render `<html lang="en" dir="ltr">` statically in HTML (no flash of wrong direction). | HTML response check |
| **AC-I18N-02** | **100% translation completeness:** Zero untranslated English UI strings, badges, dropdown options, showroom names, footer links, or error messages appear on `/ar/*` pages. | TypeScript strict i18n dictionary + visual/DOM check |
| **AC-I18N-03** | WhatsApp enquiry URLs dynamically encode the localized message in the visitor's active language (`AR` on `/ar/*`, `EN` on `/en/*`) with SKU, selected variant, and canonical URL. | Playwright click-URL assertion |
| **AC-I18N-04** | All phone numbers (`+974 ...`), SKUs, and technical identifiers inside RTL copy render wrapped in `<bdi dir="ltr">` so digits never invert. | Visual RTL screenshot check (`375px` & `1440px`) |
| **AC-I18N-05** | Language toggle navigates cleanly to the equivalent route in the target language (`/en/collections/chocolates/` ↔ `/ar/collections/chocolates/`). | Playwright route-switch test |

---

## 5. Responsive Layout Matrix

Tested in Playwright across **6 viewports/locale combinations** with **zero horizontal overflow (`document.documentElement.scrollWidth <= window.innerWidth`)** and **zero overlapping fixed/floating controls**:
1. Desktop `1440×900` — English (`LTR`) & Arabic (`RTL`)
2. Tablet `768×1024` — English (`LTR`) & Arabic (`RTL`)
3. Mobile `375×812` — English (`LTR`) & Arabic (`RTL`) (including open Mobile Navigation Drawer, PLP filters, PDP sticky WhatsApp bar, and Bespoke Consultation form).

---

## 6. SEO, Security, Analytics & Operational Readiness

| ID | Domain | Acceptance Criterion |
| :--- | :--- | :--- |
| **AC-SEO-01** | Crawlability | Unique `<title>`, `<meta name="description">`, canonical URL, symmetric `hreflang` (`en-QA`, `ar-QA`, `x-default`), Open Graph tags, `robots.txt`, and `sitemap-index.xml` validated. |
| **AC-SEO-02** | Structured Data | JSON-LD (`Organization`, `BreadcrumbList`, `Product`) passes schema validator and emits **only verified business/pricing attributes**. |
| **AC-SEC-01** | Security & Headers | Zero unescaped `innerHTML` templating; strict CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` configured on hosting edge; `npm audit --omit=dev` reports 0 high/critical vulnerabilities. |
| **AC-ANA-01** | Analytics | Conversion events (`view_item_list`, `view_item`, `search`, `select_variant`, `whatsapp_enquiry_click`, `bespoke_consultation_submit`) verified firing cleanly with `sku` and `locale`. |
| **AC-OPS-01** | CI/CD & Rollback | Green GitHub Actions run (`format:check`, `lint`, `typecheck`, `validate:catalog`, `build`, `playwright` + `axe-core`); documented deployment runbook and verified rollback to previous Cloudflare Pages deployment / `baseline-prototype-v1` tag. |
