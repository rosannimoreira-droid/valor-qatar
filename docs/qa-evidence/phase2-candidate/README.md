# Phase 2 Candidate — Visual & Runtime QA Evidence

This directory stores representative desktop (`1440×900`) and mobile (`375×812`) screenshots captured locally against the built Astro 5 static output (`dist/` served via `astro preview` on `http://127.0.0.1:4321`) during Playwright + `@axe-core/playwright` verification (`tests/e2e/valor.spec.ts`).

## Screenshot Inventory

### Desktop (`1440×900`)
- [`desktop/home-en-desktop.png`](./desktop/home-en-desktop.png) — English Homepage (`dir="ltr"`)
- [`desktop/home-ar-desktop.png`](./desktop/home-ar-desktop.png) — Arabic Homepage (`dir="rtl"`)
- [`desktop/plp-ar-desktop.png`](./desktop/plp-ar-desktop.png) — Arabic Collections Listing (`dir="rtl"`, active category tabs, filter controls)
- [`desktop/pdp-en-desktop.png`](./desktop/pdp-en-desktop.png) — English Product Detail Page (`VLR-CHO-010`, specifications, acrylic topper selector, WhatsApp enquiry)

### Mobile (`375×812`)
- [`mobile/home-en-mobile.png`](./mobile/home-en-mobile.png) — English Homepage mobile stack & header drawer button
- [`mobile/home-ar-mobile.png`](./mobile/home-ar-mobile.png) — Arabic Homepage mobile RTL stack & `<bdi dir="ltr">` phone display
- [`mobile/plp-ar-mobile.png`](./mobile/plp-ar-mobile.png) — Arabic Collections mobile responsive tabs & search bar
- [`mobile/pdp-en-mobile.png`](./mobile/pdp-en-mobile.png) — English Product Detail gallery & multi-angle thumbnail switcher

## Automated Verification Coverage

All `8/8` Playwright tests passed against the local candidate build (`tests/e2e/valor.spec.ts`):
- Responsive health (`0` console errors, `0` HTTP `>=400` responses, `0` broken images, `0` horizontal overflow) across **14 EN/AR routes × 3 viewports** (`1440×900`, `768×1024`, `375×812`).
- `@axe-core/playwright` WCAG 2.2 AA scan across **9 core EN/AR routes** (`0` violations).
- Keyboard `Tab` focus on `.skip-link`, mobile navigation drawer (`#mobile-menu-open` / `#mobile-nav-drawer`), and `Escape` close restoring button focus.
- PLP pagination (`48` → `96`), packaging filter (`acrylic` = `19` results), empty state recovery, and `Reset Filters` visibility toggling.
- PDP multi-angle gallery switcher + localized WhatsApp concierge URL assembly (`VLR-CHO-010`).
- Arabic Bespoke Hospitality Consultation brief builder generating formatted WhatsApp payloads.
