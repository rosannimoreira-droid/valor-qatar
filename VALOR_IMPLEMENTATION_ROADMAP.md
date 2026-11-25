# Valor Qatar — Implementation Roadmap

**Baseline Tag:** `baseline-prototype-v1` (`cfcf182`)  
**Target Architecture:** Astro 5 Static SSG + TypeScript + Content Collections (Zod) + Responsive AVIF/WebP Media Pipeline  
**Governance:** No framework migration or production deployment begins until Phase 1 architecture/design approval and `Gate 1` business verification inputs are received.

---

## Phase Overview & Dependencies

```text
[Phase 1: Discovery & Architecture] (COMPLETE — Awaiting Approval)
        │
        ├──► Gate 1: Architecture, Design System & Business Verification Sign-Off
        ▼
[Phase 2: Foundation, Media Pipeline & Data Consolidation]
        │    Depends on: Approved Schema, Media Grouping, Business Config (BVR-01..04)
        │
        ├──► Gate 2: Clean Media Derivatives + Zero-Error Zod Catalogue Build
        ▼
[Phase 3: Core Storefront, Bilingual PLPs, PDPs & Mobile Navigation]
        │    Depends on: Phase 2 Astro Scaffold, DESIGN.md Tokens, Verified Copy
        │
        ├──► Gate 3: Full EN/AR Parity + Desktop/Tablet/Mobile Visual & A11y Pass
        ▼
[Phase 4: Consultation Flows, Search, SEO & Analytics]
        │    Depends on: Phase 3 Routes, Verified Domain, Analytics IDs
        │
        ├──► Gate 4: Lighthouse, Axe-Core, Schema & Sitemap Verification
        ▼
[Phase 5: Production Deployment, Monitoring & Rollback Verification]
        │
        ├──► Gate 5: Go-Live Sign-Off on Custom Domain
        ▼
[Phase 6: Optional Future Extension — Headless CMS & Online Checkout]
```

---

## Detailed Phase Breakdown

### Phase 1b: Business Verification & Content Curation *(Prerequisite / Parallel)*
- **Priority:** `P0 — Blocking`
- **Owner:** Valor Business & Merchandising + Engineering Liaison
- **Key Activities:**
  1. Resolve `BVR-01` through `BVR-13` in `VALOR_BUSINESS_VERIFICATION_REGISTER.md` (official WhatsApp number, domain, showroom address/hours, delivery policy, Sendian Group wording).
  2. Group the 470 repository images using the `dHash` clustering report into unique parent products (`images[]` ordered by `primary`, `angle`, `interior`, `detail`) and move lifestyle/CSR photos to editorial media.
  3. Supply authentic English & Arabic names, descriptions, verified QAR pricing (or `price_on_request`), variant specs, lead times, and allergen notes.
- **Exit / Decision Gate (`Gate 1`):** Approved `PRODUCT.md`, `DESIGN.md`, `VALOR_TECHNICAL_ARCHITECTURE_DECISION.md`, and signed-off Business Verification Register.

### Phase 2: Repository Clean-Up, Media Pipeline & Astro Scaffold
- **Priority:** `P0 — Critical`
- **Dependencies:** `Gate 1` approval.
- **Technical Decisions:**
  - Create feature branch (`feat/astro-production`) leaving `baseline-prototype-v1` untouched on `main` until cutover.
  - Separate generic `.agent/` & `.agents/` skill suites out of the production web bundle (and fix `.agents/hooks.json` path).
  - Preserve original 470 masters in immutable `assets/masters/` (or R2 raw bucket).
  - Build Sharp image pipeline generating `400w`, `800w`, `1200w`, `1600w` in `AVIF`, `WebP`, and `JPEG` (converting the `.jfif` outlier).
  - Initialize Astro 5 + TypeScript (`strict: true`) with Content Collections (`src/content/products/*.json`), centralized `src/config/business.ts`, and typed `src/i18n/{en,ar}.ts`.
  - Write one-time catalog migration script replacing `generate_products_data.py`, plus CI validator (`scripts/validate-catalog.ts`).
- **Acceptance Criteria (`Gate 2`):**
  - `npm run validate:catalog` passes with 0 missing images, 0 duplicate slugs/SKUs, and 0 unverified synthetic prices.
  - All media derivatives `< 250 KB` on grid sizes; original masters 100% untouched.

### Phase 3: Core Bilingual Storefront, Navigation, PLPs & PDPs
- **Priority:** `P0 — Critical`
- **Dependencies:** Phase 2 Astro scaffold & `DESIGN.md` tokens.
- **Key Activities:**
  1. Implement `src/styles/tokens.css` & logical-property layout stylesheet strictly matching `DESIGN.md` (Porcelain Ivory `#FAF7F2`, Terracotta `#963E28`, Heritage Slate `#263846`, Qatar Maroon `#6B132C`, WCAG AA `≥ 4.5:1` verified).
  2. Build responsive Header & accessible Mobile Navigation Drawer (`<1024px`) with `<bdi dir="ltr">` phone numbers and context-preserving `EN ↔ AR` switcher.
  3. Build Homepage (editorial hero, collection entry tiles, signature lines spotlight, craft/provenance story, bespoke consultation banner).
  4. Build localized Category PLPs (`/en/collections/[category]/`, `/ar/collections/[category]/`) and Occasion Pages (`/en/occasions/[occasion]/`, `/ar/occasions/[occasion]/`) with real, non-empty facets.
  5. Build dedicated Product Detail Pages (`/en/products/[slug]/`, `/ar/products/[slug]/`) with multi-angle gallery, accessible variant radio selector, optional acrylic topper selector, complementary cross-links, and bilingual WhatsApp enquiry generator.
  6. Build About Valor, Contact & Showroom, and Allergen/Privacy policy pages (strictly respecting verified facts).
- **Acceptance Criteria (`Gate 3`):**
  - 100% English and Arabic translation parity (0 English strings in `/ar/`, 0 reversed phone numbers).
  - 0 horizontal overflow on `375×812`, `768×1024`, and `1440×900`.
  - Complete keyboard navigability (`Tab`, `Enter`, `Escape`, focus-visible rings).

### Phase 4: Bespoke Consultation, Search, SEO & Analytics
- **Priority:** `P1 — High`
- **Dependencies:** Phase 3 routes.
- **Key Activities:**
  1. Replace prototype fixed-price builder with **Bespoke Gifting & Majlis Consultation** page (`/en/bespoke-hospitality/`, `/ar/bespoke-hospitality/`) + Corporate page (if `BVR-12` confirmed).
  2. Integrate lightweight bilingual client-side search (Pagefind or lean `< 40 KB` prebuilt index) replacing the 722 KB synchronous `products.js`.
  3. Implement SEO head contract: unique meta descriptions, canonicals, `hreflang="en-QA"` / `"ar-QA"` / `"x-default"`, XML sitemap, `robots.txt`, Open Graph tags, and verified-only JSON-LD (`Organization`, `BreadcrumbList`, `Product`).
  4. Wire consent-aware analytics (`view_item_list`, `view_item`, `search`, `select_variant`, `whatsapp_enquiry_click`, `bespoke_consultation_submit`).
- **Acceptance Criteria (`Gate 4`):**
  - Validated `sitemap-index.xml` and JSON-LD (zero unverified offers/addresses).
  - Analytics events verified firing in staging with accurate SKU & locale payloads.

### Phase 5: Hardening, Automated QA Gates & Production Deployment
- **Priority:** `P0 — Critical`
- **Dependencies:** Phase 4 complete.
- **Key Activities:**
  1. Configure GitHub Actions CI: `format:check`, `lint`, `typecheck`, `validate:catalog`, `astro build`, Playwright E2E + Axe-Core WCAG 2.2 AA scan across `EN`/`AR` at `375px`, `768px`, and `1440px`, and Lighthouse CI budget gate.
  2. Configure hosting on Cloudflare Pages (+ R2 CDN if external media storage selected) with security headers (`CSP`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`) and immutable media cache headers.
  3. Document deployment runbook and one-click Cloudflare rollback + Git revert procedure.
- **Acceptance Criteria (`Gate 5` — Release Gate):**
  - All CI checks green; Lighthouse Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95; zero P0/P1 defects; explicit stakeholder production sign-off.

### Phase 6: Future E-Commerce & CMS Readiness *(Post-Launch / On Demand)*
- **Priority:** `P2 — Future Expansion`
- **Capabilities Supported Without Rebuild:**
  - Connect `src/content/` loader to a headless CMS (Directus / Sanity / Payload) for non-technical product updates.
  - Mount a Preact/React Cart & Checkout island integrated with Shopify Storefront API or Qatari payment gateways (QPay / Sadad / MyFatoorah) once fulfillment/inventory operations are ready.
