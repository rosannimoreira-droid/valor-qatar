# Valor Qatar — Information Architecture

**Scope:** Multi-page bilingual (`EN` / `AR`) website structure replacing the prototype's single-page anchor layout, designed specifically for **Valor Qatar** as a WhatsApp-driven luxury catalogue with future e-commerce readiness.

---

## 1. Destination Evaluation (16 Candidate Routes)

Every candidate destination from the product brief was evaluated against (a) verified asset depth on disk and (b) business verification dependencies (`BVR-*`).

| Destination | Asset Evidence on Disk | Commercial Justification | Launch Phase | Gate / Dependency |
| :--- | :--- | :--- | :--- | :--- |
| **Homepage** | Hero & featured selections | Brand positioning, editorial entry, seasonal spotlight, category/occasion pathways | **Phase 2 (MVP)** | Needs approved brand copy & hero SKU |
| **All Collections** | 463 shoppable product assets | Unified browse/filter across full catalogue | **Phase 2 (MVP)** | Needs grouping of duplicate/multi-angle shots |
| **Chocolates** | 145 files (largest line) | Core product pillar (Arabian Horse, Terracotta, Taupe boxes, pralines, cigars) | **Phase 2 (MVP)** | Needs verified SKU names & pricing/PoR |
| **Dates & Arabic Sweets** | 88 files | Major regional *Diyafah* pillar (stuffed dates, ma'amoul, baklava, sablés) | **Phase 2 (MVP)** | Needs allergen/ingredient confirmation |
| **Hospitality Stands & Towers** | 82 files | High-ticket Majlis & wedding differentiator (cone towers, tiered stands) | **Phase 2 (MVP)** | Needs tier/capacity & lead-time confirmation |
| **Savoury Products** | 40 files | Strong Majlis catering line (Warak Enab towers, mini sliders, croissants) | **Phase 2 (MVP)** | Needs lead-time & serving-size specs |
| **Cakes & Desserts** | 37 files | Custom novelty/graduation cakes & dessert tartlets | **Phase 2 (MVP)** | Archive outdated `2024` cake labels unless portfolio-only |
| **Flower & Chocolate Combinations** | 20 files | Signature high-AOV gifting sets (stepped stands, arched acrylic boxes) | **Phase 2 (MVP)** | Needs valid pairing specs |
| **Flowers** | 13 files | Core floral category (bouquets, 100-rose statements, vases) | **Phase 2 (MVP)** | Confirm available daily vs. made-to-order stems |
| **Seasonal Collections** | ~25 files in `07_` | Ramadan & Eid, Qatar National Day, Hajj, Summer Coolers | **Phase 2 (MVP)** | Toggle visibility dynamically by season (`availability: seasonal`) |
| **Occasions** | Cross-cuts all categories | Mirrors Qatar gifting intent (Majlis/Weddings, Newborn, Graduation, Get Well, Housewarming) | **Phase 2 (MVP)** | Fix missing `newborn` & `national_day` tags |
| **Individual Products (PDP)** | ~160–220 grouped SKUs | Shareable URLs, SEO, multi-angle gallery, variant selector, WhatsApp enquiry | **Phase 2 (MVP)** | Grouping + bilingual copy (`BVR-07/08`) |
| **Bespoke Gifting & Hospitality** | Stands + event setups | Replaces unverified fixed-price calculator with structured consultation request | **Phase 2 (MVP)** | Confirm consultation fields & MOQ rules (`BVR-10`) |
| **Corporate Gifting** | Horse/Terracotta boxes + CSR | High-value B2B & diplomatic gifting channel in Doha | **Phase 2b / Conditional** | Confirm corporate MOQs, branding lead times & B2B line (`BVR-12`) |
| **About Valor** | 7 files in `09_` + craft shots | Builds trust through chocolatier craft, packaging heritage & Sendian Group lineage | **Phase 2 (MVP)** | Confirm Sendian Group attribution (`BVR-04`) |
| **Contact & Showroom** | WhatsApp + Doha coverage | Showroom visit & direct concierge contact | **Phase 2 (MVP)** | Mask street address/hours until `BVR-01/02/03` confirmed |

---

## 2. Bilingual URL Architecture (`/en/` & `/ar/`)

All public routes live symmetrically under `/en/` and `/ar/` with root `/` redirecting (or serving a clean language-preference interstitial/default `/en/` or `/ar/` based on `Accept-Language` and explicit switch persistence—never trapping crawlers).

| Page Type | English URL | Arabic URL (Clean UTF-8 or Transliterated) | `hreflang` Pair |
| :--- | :--- | :--- | :--- |
| **Homepage** | `/en/` | `/ar/` | Bidirectional + `x-default -> /en/` |
| **All Collections** | `/en/collections/` | `/ar/collections/` *(or `/ar/التشكيلات/` — recommend ASCII URLs `/ar/collections/` with Arabic titles/metadata to prevent messy percent-encoded WhatsApp/social shares)* | Bidirectional |
| **Category PLP** | `/en/collections/chocolates/` | `/ar/collections/chocolates/` | Bidirectional |
| | `/en/collections/flowers/` | `/ar/collections/flowers/` | |
| | `/en/collections/flower-chocolate-combos/` | `/ar/collections/flower-chocolate-combos/` | |
| | `/en/collections/dates-arabic-sweets/` | `/ar/collections/dates-arabic-sweets/` | |
| | `/en/collections/savoury/` | `/ar/collections/savoury/` | |
| | `/en/collections/cakes-desserts/` | `/ar/collections/cakes-desserts/` | |
| | `/en/collections/stands-towers/` | `/ar/collections/stands-towers/` | |
| | `/en/collections/seasonal/` | `/ar/collections/seasonal/` | |
| **Occasions Hub & Pages** | `/en/occasions/` | `/ar/occasions/` | Bidirectional |
| | `/en/occasions/ramadan-eid/` | `/ar/occasions/ramadan-eid/` | |
| | `/en/occasions/qatar-national-day/` | `/ar/occasions/qatar-national-day/` | |
| | `/en/occasions/newborn/` | `/ar/occasions/newborn/` | |
| | `/en/occasions/graduation/` | `/ar/occasions/graduation/` | |
| | `/en/occasions/weddings-majlis/` | `/ar/occasions/weddings-majlis/` | |
| **Product Detail Page** | `/en/products/<slug-en>/` | `/ar/products/<slug-en-or-sku>/` | Bidirectional |
| **Bespoke & Hospitality** | `/en/bespoke-hospitality/` | `/ar/bespoke-hospitality/` | Bidirectional |
| **Corporate Gifting** | `/en/corporate-gifting/` | `/ar/corporate-gifting/` | Bidirectional |
| **About Valor** | `/en/about/` | `/ar/about/` | Bidirectional |
| **Contact & Showroom** | `/en/contact/` | `/ar/contact/` | Bidirectional |
| **Legal & Allergens** | `/en/privacy-policy/`, `/en/allergen-care/` | `/ar/privacy-policy/`, `/ar/allergen-care/` | Bidirectional |

> **URL Design Decision:** Using predictable ASCII path segments under `/en/...` and `/ar/...` keeps shared WhatsApp links short and readable (`https://valorqatar.com/ar/products/arabian-horse-praline-box/` instead of long `%D8%...` percent-encoded strings), while keeping full Arabic `<title>`, `<h1>`, breadcrumbs, and `hreflang="ar-QA"` / `hreflang="en-QA"` metadata first-class.

---

## 3. Navigation Hierarchy & Wayfinding

### Top-Level Primary Navigation (Max 7 Items — Desktop)
1. **Collections** *(Mega-Menu Dropdown)*
   - *Confections:* Chocolates & Pralines, Dates & Arabic Sweets, Cakes & Desserts
   - *Florals & Pairings:* Fresh Flowers, Flower & Chocolate Combos
   - *Hospitality & Catering:* Majlis Stands & Towers, Savoury & Warak Enab
   - *Featured Lines:* Arabian Horse Heritage, Terracotta Signature, Seasonal Editions
2. **Flowers** *(Direct shortcut for floral-first buyers)*
3. **Chocolates** *(Direct shortcut for confectionery buyers)*
4. **Occasions** *(Dropdown: Ramadan & Eid, Qatar National Day, Weddings & Majlis, Newborn, Graduation, Get Well & Housewarming)*
5. **Bespoke & Majlis** *(Consultation page)*
6. **Corporate** *(Conditional on Phase 2b `BVR-12`, or anchored inside Bespoke until confirmed)*
7. **Our Craft** *(About Valor + Showroom/Contact)*

### Header Utility Controls
- **Search Trigger** (accessible command/search modal or dedicated `/search/` query view)
- **Language Switcher (`العربية` / `EN`)** — switches directly to the **exact matching route** in the other language (e.g., `/en/products/x/` → `/ar/products/x/`), preserving page context.
- **Concierge CTA** (clean outlined/solid primary link to Contact or WhatsApp — never overlapping content).

### Mobile Navigation (`< 1024px`)
- Compact sticky header: `[Menu Drawer Trigger]` — `[Valor Crest + Wordmark]` — `[Search]` + `[العربية / EN]`.
- Full-height slide-out `<dialog>`/`<nav>` drawer with focus trapping, Escape key close, expandable accordions for *Collections* and *Occasions*, and bottom WhatsApp Concierge link.

---

## 4. Breadcrumbs & Internal Linking Strategy

- **Breadcrumb Pattern (Every sub-page):**
  - Category PLP: `Home / Collections / Chocolates` (`الرئيسية / التشكيلات / الشوكولاتة`)
  - Occasion Page: `Home / Occasions / Newborn` (`الرئيسية / المناسبات / المواليد`)
  - PDP: `Home / Collections / Combos / Royal Stepped Stand`
  - Emits matching `BreadcrumbList` JSON-LD on every rendered page.
- **Internal Cross-Linking Rules:**
  - Every **PDP** links back to its `primaryCategory`, tagged `occasions[]`, and up to 4 curated **Complementary Pieces** (e.g., an Arabian Horse chocolate box links to a matching Naomi rose bouquet or stepped stand).
  - Every **Occasion Page** curates cross-category selections (e.g., *Newborn* brings together blue/pink acrylic arrangements + stuffed date hexagonal boxes + baby gift hampers).
  - **About Valor** and **Bespoke Hospitality** link directly to featured signature lines (`Arabian Horse`, `Terracotta`, `Majlis Towers`).

---

## 5. Footer Architecture (4 Balanced Columns)

1. **Brand & Location:** Valor wordmark, verified tagline, Doha/Qatar location status, official phone (`dir="ltr"` isolated) & verified social links.
2. **Collections:** Direct links to the 8 core collection routes.
3. **Occasions & Services:** Occasions hub, Bespoke & Majlis Consultation, Corporate Gifting, Contact & Showroom.
4. **Policies & Care:** Care & Storage Guide (chocolate/floral longevity in Doha), Allergen Notice, Privacy Policy, Terms.
