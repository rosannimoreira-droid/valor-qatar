# Valor Qatar — Phase 2 Candidate Audit Readiness Report

**Candidate Branch:** `feat/phase2-astro-production`  
**Baseline Tag Preserved on `main`:** `baseline-prototype-v1` (`cfcf182`)  
**Target Future Deployment Host:** `https://valor.sendianmedia.com` (not deployed; zero DNS/Cloudflare changes applied)  
**Audit Disclosure Status:** All items below reflect empirical checks on repository code and assets. Nothing commercial or visual is misrepresented as signed off.

---

## 1. Repository & Reproducibility Verification

### Tracked vs. Ignored Artifacts
- **Tracked Source & Assets:** Original photography masters (`01_*`–`09_*`), Phase 1 specifications (`DESIGN.md`, `PRODUCT.md`, `VALOR_*.md`), Astro 5 source (`src/`), Playwright tests (`tests/`), lockfile (`package-lock.json`), generator/validation/media scripts (`scripts/`), and QA screenshots (`docs/qa-evidence/phase2-candidate/`).
- **Excluded via `.gitignore`:** `node_modules/`, `dist/`, `.astro/`, `public/media/`, `test-results/`, `playwright-report/`, `blob-report/`, `_Discarded/`, and local `.impeccable/` runtime cache files. No `.env`, API secret, or credential files are tracked.
- **Note on Legacy Prototype & Local Skills:** The baseline static prototype (`index.html`, `styles.css`, `app.js`, `products.js`, `generate_products_data.py`) and `.agent/` / `.agents/` skill suites remain in the repository from `cfcf182` for baseline traceability. Astro 5 builds exclusively from `src/` and `public/` into `dist/`.
- **Reproducible Fresh-Checkout Build:** Verified by cloning `feat/phase2-astro-production` cleanly into an isolated temporary checkout (without `public/media/` or `dist/`), installing dependencies with `npm ci`, validating the catalogue with `npm run validate:catalog`, and running `npm run build` (`scripts/build-media.mjs` + `astro build`), regenerating all 1,410 AVIF/WebP/JPEG width sets from the 470 tracked masters and building 921 static HTML pages cleanly.

---

## 2. Discrepancy Between Estimated `160–220` Unique Products and `436` Product Records

During Phase 1 (`VALOR_PRODUCT_DATA_AUDIT.md`), visual inspection and perceptual hashing (`dHash <= 10`) estimated that the 470 files represent roughly **160–220** unique physical products once distinct camera angles, interior-vs-closed box views, macro crops, event photos, and cross-folder duplicates are consolidated.

In Phase 2, **`436` published JSON product records** were emitted by `scripts/generate_curated_catalog.py` because:
1. Only `11` non-product brand/CSR/setup photos (`09_Brand_and_Media` + 2 classroom shots + 2 buffet shots) were separated into `src/data/editorial-media.json`, leaving `459` shoppable assets.
2. Without merchant SKU sign-off (`BVR-07`), the migration script intentionally used a **conservative within-category perceptual threshold (`dHash <= 6`)**, merging `23` near-identical shots (`459` → `436`) rather than risking false merges of distinct boxes or mismatched box fillings shot from different angles or folders (for example, `4` distinct angles of the Porcelain Stepped Stand or multiple cross-folder tray shots).
3. `12` flagship SKUs received curated bilingual names matching verified visual subjects, while the remaining `424` records retain honest non-fabricated category-and-SKU fallback titles (e.g., `Valor Chocolates & Pralines Assortment (VLR-CHO-001)`) until Valor merchandising provides canonical parent grouping and product names.

---

## 3. Status of Requested Visual Directions

- **Three Requested Visual Directions: NOT COMPLETED.**
- Three separate exploratory design concepts or interactive visual directions were **not** produced or implemented side-by-side.
- Instead, **one** consolidated production design system (*"The Qatari Salon of Craft"*) was specified in `DESIGN.md` and implemented across `src/styles/tokens.css`, `src/styles/global.css`, and Astro components using chromatics sampled from repository photography (`#FAF7F2` Canvas Ivory, `#1C1815` Obsidian, `#963E28` Terracotta, `#263846` Heritage Slate, `#6B132C` Qatar Maroon).
- **Impeccable Design Audit Disclosure:** Running `impeccable detect` against live `http://127.0.0.1:4321/en/` and `/ar/` returned zero typography, balanced-heading, or layout issues after switching UI copy to `Libre Franklin` and adding `text-wrap: balance;` to `h3`. One detector warning remains open and intentionally un-suppressed: `cream-palette` on `body` (`rgb(250, 247, 242)` / `#FAF7F2`), retained deliberately to reflect Valor's porcelain-ivory packaging documented in `DESIGN.md`.

---

## 4. `ValorCrest` & Brand Asset Provenance

- **`src/components/ValorCrest.astro` and `public/favicon.svg` do NOT reproduce an official approved vector brand asset.**
- Both files contain a **custom hand-coded SVG approximation** modeled visually from staff apron embroidery (`09_Brand_and_Media/755246511_...jpg`) and box foil prints (`01_Chocolates_and_Pralines/560484380_...jpg`).
- **Action Required Before Launch:** Replace `ValorCrest.astro` and `favicon.svg` with Valor Qatar's official brand-approved vector file (`SVG` / `AI` / `EPS`).

---

## 5. Known Limitations & Outstanding Business Verification Items (`BVR-01`..`BVR-13`)

All **13 items** in `VALOR_BUSINESS_VERIFICATION_REGISTER.md` remain **`UNVERIFIED`** and block public production go-live:

1. **Concierge Contact (`BVR-01`):** Placeholder WhatsApp line `+974 5999 2926` sourced from social flyer images awaits confirmation as the active official concierge number.
2. **Showroom Address & Hours (`BVR-02`, `BVR-03`):** Street location and boutique hours are omitted in both UI and `Organization` JSON-LD (city-level `Doha, State of Qatar` only) until confirmed.
3. **Corporate / Sendian Group Attribution (`BVR-04`):** Parent ownership wording omitted until signed off.
4. **Delivery Zones, Fees & Lead Times (`BVR-05`, `BVR-06`):** Hardcoded `Free Delivery > 500 QAR` and SLA promises removed; PDP `leadTimeHours` remains `null` (`"Confirmed with concierge upon enquiry"`).
5. **Product Grouping, Naming, Pricing & Allergens (`BVR-07`, `BVR-08`, `BVR-09`, `BVR-11`):**
   - `436` SKUs require stakeholder consolidation toward `~160–220` parent offerings and Arabic/English marketing copy.
   - All `436` products have `pricingMode: "price_on_request"`, `basePriceQar: null`, `variants: []`, and `verificationStatus: "unverified"`; `offers` schema is omitted in JSON-LD.
   - Year-specific/seasonal items (e.g., `"Class of 2024"` graduation cake, Summer Coconut coolers, Hajj stands) remain published pending seasonal archiving rules (`BVR-11`).
6. **Bespoke Toppers & Mix Options (`BVR-10`):** Standard acrylic calligraphy phrase list is pre-populated (`pdp.topperChoices`), and bespoke pairings route directly to WhatsApp rather than an automated price checkout.
7. **Deferred / Unimplemented Scope (`BVR-12`, Domain `BVR-13`):**
   - Dedicated `/en/corporate-gifting/` & `/ar/corporate-gifting/` route documented in `VALOR_INFORMATION_ARCHITECTURE.md` is deferred until B2B MOQs (`BVR-12`) are confirmed (corporate inquiries currently route via `/bespoke-hospitality/`).
   - Analytics helper (`src/lib/analytics.ts`) dispatches `valor:analytics` and pushes to `window.dataLayer`, with no GTM/GA4 container configured yet.
   - Client-side catalogue filter index (`dist/{en,ar}/data/catalog.json`, `~224 KiB` uncompressed) serves all 436 entries rather than a smaller `<50 KB` pre-split index; initial SSR HTML renders 48 cards cleanly within DOM size targets.
   - No automated Lighthouse CI scores or Cloudflare edge security headers (`_headers`) are configured yet because hosting/deployment is explicitly out of scope at this stage.
   - **Dependency Audit (`npm audit --omit=dev`):** Reports `5 vulnerabilities (1 low, 3 high, 1 critical)` in pinned build-time toolchain packages (`astro@^5.5.5`, `sharp`, `zod`, `esbuild`); remediation to `astro@7.4.x` / `zod@4.x` is a breaking major upgrade left for post-audit hardening prior to production cutover (note: `output: 'static'` emits zero SSR server runtime).
   - **Node Engine Warning:** `@astrojs/sitemap` pulls transitive `sitemap@10.0.0` / `undici@8.13.1` with `engines.node >=22.19.0`; builds succeed on Node `20.20.2` with `npm warn EBADENGINE`, and CI/Cloudflare Pages should target Node `22` LTS.
