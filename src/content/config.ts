import { defineCollection, z } from 'astro:content';

const localizedText = z.object({
  en: z.string().min(1),
  ar: z.string().min(1),
});

const productImageSchema = z.object({
  id: z.string().min(1),
  masterPath: z.string().min(1),
  mediaKey: z.string().min(1),
  role: z.enum(['primary', 'angle', 'interior', 'detail', 'scale', 'packaging']),
  alt: localizedText,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const variantSchema = z.object({
  sku: z.string().min(1),
  label: localizedText,
  pricingMode: z.enum(['fixed_qar', 'starting_from_qar', 'price_on_request']),
  priceQar: z.number().positive().nullable(),
});

const customizationSchema = z.object({
  id: z.string().min(1),
  type: z.enum([
    'acrylic_topper',
    'floral_palette',
    'filling_assortment',
    'gift_card_note',
    'ribbon_color',
  ]),
  label: localizedText,
  choices: z
    .array(
      z.object({
        id: z.string().min(1),
        label: localizedText,
      })
    )
    .optional(),
  allowsCustomText: z.boolean().default(false),
});

export const CATEGORY_IDS = [
  'chocolates',
  'flowers',
  'combos',
  'dates-sweets',
  'savoury',
  'cakes-desserts',
  'stands-towers',
  'seasonal',
] as const;

export const OCCASION_IDS = [
  'majlis-weddings',
  'ramadan-eid',
  'qatar-national-day',
  'newborn',
  'graduation',
  'hajj-umrah',
  'summer',
  'everyday-gifting',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];
export type OccasionId = (typeof OCCASION_IDS)[number];

const productsCollection = defineCollection({
  type: 'data',
  schema: z
    .object({
      id: z.string().min(1),
      sku: z.string().min(1),
      slug: localizedText,
      name: localizedText,
      shortDescription: localizedText,
      description: localizedText,
      primaryCategory: z.enum(CATEGORY_IDS),
      collections: z.array(z.string()).default([]),
      occasions: z.array(z.enum(OCCASION_IDS)).min(1),
      images: z.array(productImageSchema).min(1),
      pricingMode: z.enum(['fixed_qar', 'starting_from_qar', 'price_on_request']),
      basePriceQar: z.number().positive().nullable(),
      variants: z.array(variantSchema).default([]),
      customizations: z.array(customizationSchema).default([]),
      availability: z.enum(['in_stock', 'made_to_order', 'seasonal', 'unavailable']),
      leadTimeHours: z.number().int().positive().nullable(),
      attributes: z.object({
        packagingLine: z
          .enum([
            'arabian-horse',
            'terracotta',
            'taupe-ribbon',
            'porcelain-white',
            'matte-black',
            'acrylic',
            'floral-wrap',
            'seasonal-box',
          ])
          .optional(),
        formatLabel: localizedText.optional(),
      }),
      featured: z.boolean().default(false),
      sortWeight: z.number().int().default(100),
      seo: z.object({
        title: localizedText,
        description: localizedText,
      }),
      whatsapp: z.object({
        enabled: z.boolean().default(true),
        enquiryContext: localizedText,
      }),
      publicationStatus: z.enum(['draft', 'pending_verification', 'published', 'archived']),
      verificationStatus: z.enum(['unverified', 'partially_verified', 'verified']),
    })
    .refine(
      (data) =>
        (data.pricingMode === 'price_on_request' && data.basePriceQar === null) ||
        (data.pricingMode !== 'price_on_request' && data.basePriceQar !== null),
      {
        message: 'basePriceQar must be null for price_on_request and non-null otherwise.',
      }
    ),
});

export const collections = {
  products: productsCollection,
};
