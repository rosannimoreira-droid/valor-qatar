import { getCollection, type CollectionEntry } from 'astro:content';
import { BUSINESS_CONFIG, buildWhatsAppUrl } from '@/config/business';
import { formatTemplate, getDictionary, type Locale } from '@/i18n';

export type ProductEntry = CollectionEntry<'products'>;

export async function getPublishedProducts(): Promise<ProductEntry[]> {
  const entries = await getCollection('products', ({ data }) => {
    return data.publicationStatus === 'published';
  });
  return entries.sort((a, b) => a.data.sortWeight - b.data.sortWeight);
}

export function getProductUrl(locale: Locale, product: ProductEntry): string {
  return `/${locale}/products/${product.data.slug[locale]}/`;
}

export function getCategoryUrl(locale: Locale, categoryId: string): string {
  if (categoryId === 'all') return `/${locale}/collections/`;
  return `/${locale}/collections/${categoryId}/`;
}

export function getOccasionUrl(locale: Locale, occasionId: string): string {
  if (occasionId === 'all') return `/${locale}/occasions/`;
  return `/${locale}/occasions/${occasionId}/`;
}

export function formatProductPrice(product: ProductEntry['data'], locale: Locale): string {
  const t = getDictionary(locale);
  if (product.pricingMode === 'price_on_request' || product.basePriceQar === null) {
    return t.plp.priceOnRequest;
  }
  if (product.pricingMode === 'starting_from_qar') {
    return `${t.plp.fromPricePrefix} ${product.basePriceQar} ${t.plp.currencyCode}`;
  }
  return `${product.basePriceQar} ${t.plp.currencyCode}`;
}

export function buildProductEnquiryUrl(
  product: ProductEntry,
  locale: Locale,
  options?: {
    variantLabel?: string;
    topperLabel?: string;
    notes?: string;
  }
): string {
  const t = getDictionary(locale);
  const canonicalProductUrl = `${BUSINESS_CONFIG.site.canonicalOrigin}${getProductUrl(locale, product)}`;
  const msg = formatTemplate(t.whatsappTemplates.productEnquiry, {
    name: product.data.name[locale],
    sku: product.data.sku,
    variant: options?.variantLabel || (locale === 'ar' ? 'النسخة القياسية' : 'Standard'),
    topper: options?.topperLabel || t.pdp.topperPlaceholder,
    notes: options?.notes?.trim() || (locale === 'ar' ? 'لا يوجد' : 'None'),
    url: canonicalProductUrl,
  });
  return buildWhatsAppUrl(msg);
}

export function getAlternatePath(pathname: string, targetLocale: Locale): string {
  const stripped = pathname.replace(/^\/(en|ar)(\/|$)/, '/');
  return `/${targetLocale}${stripped === '/' ? '/' : stripped}`;
}
