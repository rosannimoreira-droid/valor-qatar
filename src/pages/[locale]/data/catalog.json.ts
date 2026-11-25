import type { APIRoute, GetStaticPaths } from 'astro';
import { getPublishedProducts, formatProductPrice, getProductUrl } from '@/lib/catalog';
import { getDictionary, type Locale } from '@/i18n';

export const getStaticPaths: GetStaticPaths = () => [
  { params: { locale: 'en' } },
  { params: { locale: 'ar' } },
];

export const GET: APIRoute = async ({ params }) => {
  const locale = (params.locale === 'ar' ? 'ar' : 'en') as Locale;
  const t = getDictionary(locale);
  const products = await getPublishedProducts();

  const items = products.map((product) => {
    const img = product.data.images[0];
    return {
      sku: product.data.sku,
      name: product.data.name[locale],
      nameAlt: product.data.name[locale === 'ar' ? 'en' : 'ar'],
      url: getProductUrl(locale, product),
      category: product.data.primaryCategory,
      categoryLabel: t.categories[product.data.primaryCategory].name,
      occasions: product.data.occasions,
      packagingStyle: product.data.attributes.packagingLine ?? 'assorted',
      priceText: formatProductPrice(product.data, locale),
      mediaKey: img.mediaKey,
      alt: img.alt[locale],
      width: img.width,
      height: img.height,
    };
  });

  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
