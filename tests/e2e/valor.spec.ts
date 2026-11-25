import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import path from 'node:path';
import fs from 'node:fs';

const SCREENSHOT_DIR =
  process.env.VALOR_SCREENSHOT_DIR ||
  path.resolve('C:/Users/samer/.gemini/antigravity/brain/5223afa9-dde4-43f7-9cde-76e1541b4985/qa-screenshots');

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 },
] as const;

const CORE_ROUTES = [
  '/en/',
  '/ar/',
  '/en/collections/',
  '/ar/collections/',
  '/en/collections/chocolates/',
  '/ar/collections/stands-towers/',
  '/en/occasions/',
  '/ar/occasions/ramadan-eid/',
  '/en/products/porcelain-stepped-stand-red-roses-acrylic-tray-014/',
  '/ar/products/terracotta-signature-box-rolled-wafer-cigars-010/',
  '/en/bespoke-hospitality/',
  '/ar/bespoke-hospitality/',
  '/en/about/',
  '/ar/contact/',
] as const;

async function auditPageHealth(page: Page, route: string) {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];

  const onConsole = (msg: import('@playwright/test').ConsoleMessage) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  };
  const onResponse = (resp: import('@playwright/test').Response) => {
    if (resp.status() >= 400) {
      failedRequests.push(`${resp.status()} ${resp.url()}`);
    }
  };

  page.on('console', onConsole);
  page.on('response', onResponse);

  await page.goto(route, { waitUntil: 'networkidle' });

  // Wait for fonts and scroll down once so lazy images decode if in view
  await page.evaluate(async () => {
    await document.fonts.ready;
    window.scrollTo(0, document.body.scrollHeight / 2);
  });
  await page.waitForTimeout(250);
  await page.evaluate(() => window.scrollTo(0, 0));

  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });

  const brokenImages = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img'))
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src);
  });

  page.off('console', onConsole);
  page.off('response', onResponse);

  expect(consoleErrors, `Console errors on ${route}`).toEqual([]);
  expect(failedRequests, `HTTP errors on ${route}`).toEqual([]);
  expect(overflow, `Horizontal overflow on ${route}`).toBe(false);
  expect(brokenImages, `Broken images on ${route}`).toEqual([]);
}

test.describe('Valor Qatar Phase 2 Production Verification', () => {
  test.beforeAll(() => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });

  for (const vp of VIEWPORTS) {
    test(`responsive health & zero overflow across routes (${vp.name} ${vp.width}x${vp.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      for (const route of CORE_ROUTES) {
        await auditPageHealth(page, route);

        const expectedDir = route.startsWith('/ar/') ? 'rtl' : 'ltr';
        const expectedLang = route.startsWith('/ar/') ? 'ar' : 'en';
        await expect(page.locator('html')).toHaveAttribute('dir', expectedDir);
        await expect(page.locator('html')).toHaveAttribute('lang', expectedLang);
      }

      // Save key visual screenshots at desktop and mobile
      if (vp.name === 'desktop' || vp.name === 'mobile') {
        await page.goto('/en/', { waitUntil: 'networkidle' });
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `home-en-${vp.name}.png`),
          fullPage: false,
        });

        await page.goto('/ar/', { waitUntil: 'networkidle' });
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `home-ar-${vp.name}.png`),
          fullPage: false,
        });

        await page.goto('/en/products/terracotta-signature-box-rolled-wafer-cigars-010/', {
          waitUntil: 'networkidle',
        });
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `pdp-en-${vp.name}.png`),
          fullPage: false,
        });

        await page.goto('/ar/collections/', { waitUntil: 'networkidle' });
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `plp-ar-${vp.name}.png`),
          fullPage: false,
        });
      }
    });
  }

  test('WCAG 2.2 AA automated Axe audit across EN & AR pages', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const auditRoutes = [
      '/en/',
      '/ar/',
      '/en/collections/',
      '/ar/collections/chocolates/',
      '/en/occasions/',
      '/en/products/porcelain-stepped-stand-red-roses-acrylic-tray-014/',
      '/ar/bespoke-hospitality/',
      '/en/about/',
      '/ar/contact/',
    ];

    for (const route of auditRoutes) {
      await page.goto(route, { waitUntil: 'networkidle' });
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();

      expect(
        results.violations,
        `Axe violations on ${route}: ${JSON.stringify(results.violations, null, 2)}`
      ).toEqual([]);
    }
  });

  test('keyboard navigation and mobile drawer Escape behavior', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/en/', { waitUntil: 'networkidle' });

    // First Tab hits Skip Link
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();

    // Open mobile drawer
    const menuBtn = page.locator('#mobile-menu-open');
    await menuBtn.click();
    const drawer = page.locator('#mobile-nav-drawer');
    await expect(drawer).toBeVisible();
    await expect(menuBtn).toHaveAttribute('aria-expanded', 'true');

    // Escape closes mobile drawer and restores focus
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
    await expect(menuBtn).toBeFocused();
  });

  test('PLP search, packaging filter, empty state & show-more pagination', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/en/collections/', { waitUntil: 'networkidle' });

    const initialCards = await page.locator('#catalogue-grid .product-card').count();
    expect(initialCards).toBe(48);
    await expect(page.locator('#catalogue-reset')).toBeHidden();

    // Test Show More pagination (48 -> 96)
    await page.locator('#catalogue-load-more').click();
    await expect(page.locator('#catalogue-grid .product-card')).toHaveCount(96);

    // Filter by packaging line ('acrylic' has 19 items < 48)
    await page.selectOption('#filter-packaging', 'acrylic');
    await expect(page.locator('#catalogue-count')).toContainText('19');
    await expect(page.locator('#catalogue-reset')).toBeVisible();
    const acrylicCount = await page.locator('#catalogue-grid .product-card').count();
    expect(acrylicCount).toBe(19);

    // Trigger empty state via impossible query then reset
    await page.fill('#catalogue-search', 'NONEXISTENT_XYZ_9999');
    await page.locator('#catalogue-filter-form button[type="submit"]').click();
    await expect(page.locator('#catalogue-empty')).toBeVisible();

    await page.locator('#catalogue-empty-reset').click();
    await expect(page.locator('#catalogue-empty')).toBeHidden();
    await expect(page.locator('#catalogue-reset')).toBeHidden();
    await expect(page.locator('#catalogue-grid .product-card')).toHaveCount(48);
  });

  test('PDP multi-angle switcher & localized WhatsApp URL generation', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/en/products/terracotta-signature-box-rolled-wafer-cigars-010/', {
      waitUntil: 'networkidle',
    });

    // Switch gallery angle
    const thumbs = page.locator('.pdp-thumb');
    expect(await thumbs.count()).toBeGreaterThan(1);
    await thumbs.nth(1).click();
    await expect(thumbs.nth(1)).toHaveAttribute('aria-pressed', 'true');

    // Select Arabic calligraphy topper + add custom note
    await page.selectOption('#pdp-topper', { index: 1 });
    await page.fill('#pdp-notes', 'Deep Burgundy Roses for Friday');

    const whatsappHref = await page.locator('#pdp-whatsapp-btn').getAttribute('href');
    expect(whatsappHref).toContain('https://wa.me/97459992926?text=');
    const decoded = decodeURIComponent(whatsappHref!.split('text=')[1]);
    expect(decoded).toContain('VLR-CHO-010');
    expect(decoded).toContain('Deep Burgundy Roses for Friday');
    expect(decoded).not.toContain('{topper}');
  });

  test('Bespoke Hospitality Consultation brief builder updates WhatsApp link', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/ar/bespoke-hospitality/', { waitUntil: 'networkidle' });

    await page.fill('#bespoke-scale', '60 ضيف في المجلس');
    await page.fill('#bespoke-calligraphy', 'منزل مبارك');

    const href = await page.locator('#bespoke-whatsapp-btn').getAttribute('href');
    expect(href).toContain('https://wa.me/97459992926?text=');
    const decoded = decodeURIComponent(href!.split('text=')[1]);
    expect(decoded).toContain('60 ضيف في المجلس');
    expect(decoded).toContain('منزل مبارك');
  });
});
