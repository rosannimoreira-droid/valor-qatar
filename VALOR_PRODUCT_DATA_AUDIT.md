# Valor Qatar — Product Data & Media Audit

**Audit Date:** 2026-11-25  
**Source Audited:** `products.js` (722,196 bytes / 470 entries), `generate_products_data.py`, and directories `01_Chocolates_and_Pralines` through `09_Brand_and_Media`.

---

## 1. Empirical Media Inventory (Verified via `audit_repo_and_media.py`)

- **Total Asset Files:** **470** files across 9 directories
- **Total Disk Footprint:** **205,613,317 bytes (196.09 MiB)**
- **File Extensions:** `.jpg` (465), `.webp` (4), `.jfif` (1 — `08_Hospitality_Stands_and_Towers/885420255_...jfif`)
- **Decoded Formats (Pillow):** `JPEG` (466), `WEBP` (4)
- **File Size Distribution:**
  - Median: **215,114 bytes (~210 KiB)**
  - Minimum: **37,220 bytes (~36 KiB)** (`08_Hospitality_Stands_and_Towers/481699946_...jpg`, `640×1136`)
  - Maximum: **5,776,341 bytes (~5.51 MiB)** (`06_Custom_Cakes_and_Desserts/805696443_...jpg`, `3500×3500`)
  - Files `> 1 MiB`: **61 files**
  - Files `> 2 MiB`: **5 files**
- **Low-Resolution Files (`< 800 px` on shortest edge):** **13 files** (including `480×854` story screenshot `470894235_...jpg`, `640×1136` vertical frames `481699946_...jpg` and `705438391_...jpg`, `695×695`, and `720×900`/`720×1280` assets).
- **Note on `_Discarded/`:** `.gitignore` excludes `_Discarded/`, and earlier documentation referenced 204 discarded assets, but `_Discarded/` is **not present** in the current workspace directory.

### Folder-by-Folder Breakdown

| Directory | Files | Footprint (MiB) | Min Res (px) | Max Res (px) | Audit Classification |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `01_Chocolates_and_Pralines` | 145 | 60.38 | `1066×1000` | `4096×4096` | Shoppable products (contains multi-angle & same-box filling variants) |
| `02_Fresh_Flowers_and_Bouquets` | 13 | 2.04 | `1080×1399` | `1440×1920` | Shoppable products (1–2 shots per bouquet/vase) |
| `03_Flowers_and_Chocolate_Combos` | 20 | 6.02 | `720×1080` | `4096×4000` | Shoppable products (includes 4 angles of stepped white stand) |
| `04_Dates_and_Arabic_Sweets` | 88 | 52.63 | `640×695` | `4096×4096` | Shoppable products (some overlap with `08_` trays & chocolate boxes) |
| `05_Savory_and_Appetizers` | 40 | 13.87 | `720×1080` | `4096×4096` | Shoppable products (Warak Enab towers, croissants, sliders, canapés) |
| `06_Custom_Cakes_and_Desserts` | 37 | 15.85 | `720×1280` | `4096×4096` | Shoppable portfolio / made-to-order examples |
| `07_Seasonal_and_Occasions` | 38 | 14.35 | `752×1002` | `4096×4096` | Seasonal & occasion products + 2 CSR/school event photos (`830834248_`, `833958119_`) |
| `08_Hospitality_Stands_and_Towers` | 82 | 27.38 | `480×751` | `4096×4096` | Shoppable stands/towers + 2 showroom/buffet setup shots (`481699946_`, `481863025_`) |
| `09_Brand_and_Media` | 7 | 3.57 | `720×1280` | `4096×4096` | **Non-product editorial/lifestyle/craft photography** (must not be shoppable SKUs) |
| **Total** | **470** | **196.09** | — | — | — |

---

## 2. Unique Products vs. Alternate Angles & Near-Duplicates

Perceptual hashing (`dHash`) combined with visual contact-sheet review confirms that **470 images do NOT equal 470 distinct products**:

- **Exact MD5 Duplicates:** `0` across the 470 files.
- **Strict Perceptual Clusters (`dHash` Hamming distance ≤ 5):** **15 clusters**, accounting for **24 additional photos** of identical or near-identical framing (e.g., 6 shots of the black carved box with different fillings shot from the same camera angle; 4 shots of the Arabian Horse baklava box).
- **Moderate Similarity Clusters (`dHash` Hamming distance ≤ 10):** **27 clusters**, accounting for **54 additional photos** representing alternate angles, tight macro crops, or color/text variations of the same physical container.
- **Cross-Folder Misclassification Example:** Five photos of the circular floral-and-sweet Eid tray (`503606073_`, `503576485_`, `503758099_`, `503862264_`, `503890674_`) are split between `04_Dates_and_Arabic_Sweets` and `08_Hospitality_Stands_and_Towers` (`dHash` ≤ 5). Similarly, multiple Stepped Stand shots (`703676210_`, `705842417_`, `706020533_`, `706021185_`) represent angles of one hero product, while `07_Seasonal_and_Occasions` includes Teacher's Day classroom event photography (`830834248_`, `833958119_`) that belongs in editorial/brand media rather than product SKUs.
- **Estimated Unique Product Families:** Based on clustering and contact-sheet inspection, the 470 assets realistically consolidate into **~160–220 distinct products/offerings** once multi-angle photos, macro detail shots, and lifestyle/event photos are grouped under parent SKUs or moved to editorial media. Exact grouping requires Valor merchandising sign-off.

---

## 3. Audit of `products.js` & `generate_products_data.py`

### Confirmed Critical Data Defects
1. **98.7% Generic Placeholder Names:** `464 / 470` entries have auto-generated titles (`"Chocolates & Pralines — Selection #01"`). Only `6 / 470` entries have curated titles because **8 out of 14 filenames** in `generate_products_data.py`'s `notable_items` map do not match the actual filenames on disk.
2. **100% Synthetic Pricing & Variant Data:** All `price_qar` and `sizes` (`Original`, `Deluxe (+25%)`, `Grand Imperial (+60%)`) in `products.js` were generated via an unverified deterministic formula (`p_min + ((idx * 37) % (p_max - p_min))`). None of these prices are verified commercial figures.
3. **Broken Reproducibility:** `generate_products_data.py` runs at top-level import without an `if __name__ == "__main__":` guard and **does not generate `price_qar`, `sizes`, or `color`**. Executing `python generate_products_data.py` silently wipes those fields from `products.js`.
4. **Broken Filtering Metadata:**
   - `newborn` occasion has **0 items** in `products.js`, despite `"Newborn & Baby"` existing in `#occasionSelect` (and despite newborn blue/pink stands existing in `07_Seasonal_and_Occasions`).
   - Keyword matching (`'national' in f.lower()`) fails on numeric Instagram CDN filenames (`625026040_...jpg`), leaving `national_day` with only 3 items, `summer` with 1 item, `ramadan_eid` with 8 items, and dumping 311 items into `luxury_gift`.
   - `color` tags were inferred purely from English title keywords rather than actual visual attributes (`mixed`: 307, `white`: 1).
5. **Non-Shoppable Media Leakage:** All 7 editorial images in `09_Brand_and_Media` are included in `VALOR_CATALOG` with `price_qar: 0`, rendering as `"Inquire For Price"` cards inside `"All Collections"`.
6. **Bloated Monolithic Runtime Delivery:** `products.js` is a `722,196-byte` synchronous global script (`const VALOR_CATALOG = [...]`) parsed on initial page load regardless of which category a visitor views.

---

## 4. Recommended Production Product Schema

In production, `VALOR_CATALOG` should be stored as validated JSON/YAML content collections (e.g., `src/data/products/*.json` or `src/content/products/*.json`) validated at build time via Zod / JSON Schema.

```ts
export type PublicationStatus = 'draft' | 'pending_verification' | 'published' | 'archived';
export type VerificationStatus = 'unverified' | 'partially_verified' | 'verified';
export type PricingMode = 'fixed_qar' | 'starting_from_qar' | 'price_on_request';

export interface LocalizedText {
  en: string;
  ar: string;
}

export interface ProductImage {
  id: string;
  masterPath: string;           // Immutable source path under media-masters/
  role: 'primary' | 'angle' | 'interior' | 'detail' | 'scale' | 'packaging';
  alt: LocalizedText;           // Meaningful bilingual alt text (required for published)
  width: number;
  height: number;
  dominantColor?: string;
}

export interface ProductVariant {
  sku: string;
  label: LocalizedText;         // e.g., "500g Box" / "علبة 500 جم", or "2-Tier Stand"
  pricingMode: PricingMode;
  priceQar: number | null;      // null when price_on_request; never fabricated
  piecesCount?: number | null;
  weightGrams?: number | null;
  dimensionsCm?: string | null;
  servings?: string | null;
}

export interface CustomizationOption {
  id: string;
  type: 'acrylic_topper' | 'floral_palette' | 'filling_assortment' | 'gift_card_note' | 'ribbon_color';
  label: LocalizedText;
  choices?: Array<{
    id: string;
    label: LocalizedText;
    additionalPriceQar: number | null; // null if quotation-based
  }>;
  allowsCustomText?: boolean;
  maxCharacters?: number;
}

export interface ProductRecord {
  id: string;                   // Stable immutable UUID or canonical key, e.g., "valor-stepped-stand-crimson"
  sku: string;                  // Verified Valor SKU, e.g., "VLR-CMB-001"
  slug: LocalizedText;          // URL slugs: en "royal-stepped-stand-crimson", ar "منصة-الضيافة-المدرجة"
  name: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;

  // Taxonomy
  primaryCategory:
    | 'chocolates'
    | 'flowers'
    | 'combos'
    | 'dates-sweets'
    | 'savoury'
    | 'cakes-desserts'
    | 'stands-towers'
    | 'seasonal';
  collections: string[];        // e.g., ["arabian-horse-heritage", "terracotta-signature"]
  occasions: string[];          // e.g., ["ramadan-eid", "newborn", "graduation", "national-day", "majlis"]

  // Media
  images: ProductImage[];       // Min 1 primary image required

  // Commercial & Fulfillment (verified only)
  pricingMode: PricingMode;
  basePriceQar: number | null;  // Strictly null until verified by Valor
  variants: ProductVariant[];
  customizations: CustomizationOption[];
  availability: 'in_stock' | 'made_to_order' | 'seasonal' | 'unavailable';
  leadTimeHours: number | null; // e.g., 24 or 48; null until verified

  // Attributes
  attributes: {
    packagingLine?: 'arabian-horse' | 'terracotta' | 'taupe-ribbon' | 'porcelain-white' | 'matte-black' | 'acrylic' | 'floral-wrap';
    dietaryNotes?: string[];    // Only verified allergens/notes (nuts, dairy, gluten)
    floralVarieties?: string[]; // Only verified stems
    chocolatesIncluded?: string[];
  };

  // Merchandising, SEO & Enquiry
  featured: boolean;
  sortWeight: number;
  seo: {
    title: LocalizedText;
    description: LocalizedText;
  };
  whatsapp: {
    enabled: boolean;
    enquiryContext: LocalizedText; // Template tokens resolved in customer's active language
  };

  // Governance Gates
  publicationStatus: PublicationStatus;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
}
```

---

## 5. Disposition of `generate_products_data.py`

**Recommendation: Retire and Replace.**
- `generate_products_data.py` was a one-time bootstrap script designed around folder scanning and heuristic filename guessing. It cannot reproduce curated product groupings, multi-image galleries, real SKUs, or verified pricing.
- **Migration Path:**
  1. Freeze `products.js` inside the `baseline-prototype-v1` tag as historical reference.
  2. Write a **one-time deterministic migration script** (`scripts/migrate-prototype-catalog.mjs` or `.py`) that:
     - Uses the `dHash` clustering + manual curation spreadsheet (completed with Valor's merchandising team) to group the ~470 images into parent product records (`images[]`) and separate out non-product lifestyle/CSR photos into an editorial media manifest.
     - Emits normalized `src/content/products/*.json` records with `pricingMode: "price_on_request"`, `basePriceQar: null`, `verificationStatus: "unverified"`, and `publicationStatus: "pending_verification"`.
  3. Replace `generate_products_data.py` with a strict **CI Catalogue Integrity Validator** (`scripts/validate-catalog.ts`) checking schema compliance, zero missing images, zero duplicate slugs/SKUs, and blocking publication of unverified prices.
