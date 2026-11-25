# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro 5 (Static Site Generation + TypeScript + Content Collections with Zod validation + selective lightweight islands). *(Recommended in Phase 1 architecture decision; awaiting stakeholder approval before migration from static HTML/CSS/JS prototype.)*

## Users

- **Private Gift Buyers in Qatar:** Residents and citizens in Doha and across Qatar purchasing luxury floral arrangements, chocolates, dates, or custom celebration cakes for personal milestones (birthdays, weddings, newborn welcomes, graduations, get-well visits, housewarmings, Ramadan, Eid, and Qatar National Day).
- **Majlis Hosts & Event Organizers:** Families and hosts commissioning high-impact tiered stands, pyramid sweet/truffle towers, and savoury *Warak Enab* displays for formal hospitality (*Diyafah*) and wedding receptions.
- **Corporate & VIP Concierge Buyers *(Pending Verification)*:** Organizations ordering bulk seasonal hampers or bespoke event hospitality.

## Product Purpose

Valor Qatar is an independent, bilingual (`English` / `Arabic`) digital catalogue and WhatsApp-driven consultation platform showcasing Valor Qatar's chocolates, floristry, dates, savoury catering, custom cakes, and bespoke hospitality towers—designed to convert product discovery into qualified, option-rich WhatsApp enquiries while remaining architecturally ready for future online checkout.

## Positioning

Unlike mass-market floral aggregators or single-category chocolatiers, Valor Qatar unites fine confectionery, fresh floral styling, traditional Arabic *Diyafah* (stuffed dates, ma'amoul, baklava, Warak Enab), custom celebration cakes, and sculptural majlis towers with personalized Arabic acrylic calligraphy under a cohesive luxury presentation system.

## Operating Context

- **Primary Conversion Channel:** Direct WhatsApp Business concierge enquiry carrying exact SKU, language (`EN`/`AR`), selected variant, and optional customization notes. No online cart, authentication, or payment gateway in the initial production release.
- **Bilingual Reality:** Arabic (`dir="rtl"`) and English (`dir="ltr"`) are co-equal customer experiences. Gift toppers, occasion greetings, and concierge chats frequently occur natively in Arabic.
- **Mobile-First Discovery:** Most luxury gifting traffic originates on mobile devices via Instagram/social links and direct word-of-mouth shares.

## Capabilities and Constraints

- **Confirmed Core Categories (Grounded in 470 Repository Media Assets):**
  1. Chocolates & Pralines (145 assets)
  2. Fresh Flowers & Bouquets (13 assets)
  3. Flower & Chocolate Combinations (20 assets)
  4. Dates & Arabic Sweets (88 assets)
  5. Savoury & Appetizers / Warak Enab (40 assets)
  6. Custom Cakes & Desserts (37 assets)
  7. Hospitality Stands & Towers (82 assets)
  8. Seasonal & Occasions (38 assets: Ramadan & Eid, Qatar National Day, Hajj, Newborn, Graduation, Summer Coolers, Teacher's Day)
- **Undecided / Pending Business Verification (See `VALOR_BUSINESS_VERIFICATION_REGISTER.md`):**
  - Verified SKU names, grouping of ~470 images into ~160–220 parent products, and verified QAR prices vs. *Price on Request*.
  - Official WhatsApp Business concierge number(s), showroom street address, operating hours, delivery zones/fees, preparation lead times, chocolate/floral provenance claims, and Sendian Group legal attribution text.
  - Approval of replacing the fixed-price prototype stand builder with a consultation brief workflow.

## Brand Commitments

- **Verified Brand Assets:**
  - **Mark & Wordmark:** Symmetrical tulip-crest `'V'` emblem paired with the custom flared geometric-serif `VALOR` wordmark and Arabic `فالور` script (verified on staff apron `09_Brand_and_Media/755246511_...jpg` and packaging `01_Chocolates_and_Pralines/560484380_...jpg`).
  - **Signature Bilingual Brand Copy (Verified on Packaging Lid):**
    - Arabic: `"دلل نفسك بلحظات من السعادة مع كل طعم تتذوقه من مجموعة فالور اللذيذة"`
    - English: `"Pamper yourself with moments of happiness with every taste from the delicious Valor collection."`
  - **Authentic Packaging Lines:** Terracotta Lattice Box, Mocha/Taupe Ribbon Box, Slate-Blue *Arabian Horse* Heritage Box, Porcelain White & Gold Hexagonal/Pedestal Stands, and Matte Black Carved Boxes.
- **Independent Identity Rule:** Valor Qatar is an independent customer-facing brand; it must not inherit internal operational design systems or third-party competitor naming/styling.

## Evidence on Hand

- 470 high-resolution product and craft images (`196.09 MiB`) across `01_Chocolates_and_Pralines/` through `09_Brand_and_Media/`.
- 7 editorial/craft photos in `09_Brand_and_Media/` (apron emblem, lifestyle/resort campaign, chocolatier craft).
- *Absences that future work must not fabricate:* Verified retail prices, confirmed ingredients/allergens, verified delivery fee thresholds, verified showroom coordinates, and confirmed customer testimonials.

## Product Principles

1. **Honesty Over Fabrication:** Display *"Price on Request"* (`السعر عند الطلب`) wherever commercial pricing, lead times, or specifications remain unverified.
2. **Bilingual Parity from Day One:** Every route, filter, specification, and WhatsApp enquiry payload ships natively in both Arabic and English.
3. **Photography-First Restraint:** Let tactile packaging, artisanal fillings, and floral craftsmanship lead; strip generic decorative UI clutter.
4. **Frictionless Concierge Conversion:** Minimize steps between discovering an arrangement and sending a complete, context-rich enquiry to Valor's team.
5. **Modular Extensibility:** Maintain strict typed separation between media, catalog schema, i18n copy, and UI so future CMS and e-commerce checkout require no structural rewrite.

## Accessibility & Inclusion

Target **WCAG 2.2 AA** compliance across English (`LTR`) and Arabic (`RTL`) on desktop, tablet, and mobile: minimum `4.5:1` text contrast, full keyboard navigation with visible focus indicators, proper heading hierarchy, semantic landmarks, meaningful bilingual `alt` text, and `prefers-reduced-motion` support.
