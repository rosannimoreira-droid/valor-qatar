export type Locale = 'en' | 'ar';

export interface TranslationDictionary {
  meta: {
    siteName: string;
    defaultTitle: string;
    defaultDescription: string;
  };
  nav: {
    skipToContent: string;
    topNotice: string;
    conciergeLabel: string;
    home: string;
    collections: string;
    flowers: string;
    chocolates: string;
    combos: string;
    datesSweets: string;
    savoury: string;
    cakes: string;
    towers: string;
    occasions: string;
    bespoke: string;
    about: string;
    contact: string;
    search: string;
    menuOpen: string;
    menuClose: string;
    switchLang: string;
  };
  categories: Record<
    | 'all'
    | 'chocolates'
    | 'flowers'
    | 'combos'
    | 'dates-sweets'
    | 'savoury'
    | 'cakes-desserts'
    | 'stands-towers'
    | 'seasonal',
    {
      name: string;
      shortDesc: string;
    }
  >;
  occasions: Record<
    | 'all'
    | 'majlis-weddings'
    | 'ramadan-eid'
    | 'qatar-national-day'
    | 'newborn'
    | 'graduation'
    | 'hajj-umrah'
    | 'summer'
    | 'everyday-gifting',
    {
      name: string;
      shortDesc: string;
    }
  >;
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroPrimaryCta: string;
    heroSecondaryCta: string;
    heroFeaturedCaption: string;
    categoriesTitle: string;
    categoriesLead: string;
    signatureTitle: string;
    signatureLead: string;
    viewAllCollections: string;
    occasionsTitle: string;
    occasionsLead: string;
    craftTitle: string;
    craftLead: string;
    craftLink: string;
    bespokeBannerTitle: string;
    bespokeBannerLead: string;
    bespokeBannerCta: string;
  };
  plp: {
    allCollectionsTitle: string;
    allCollectionsLead: string;
    filterCategory: string;
    filterOccasion: string;
    filterPackaging: string;
    searchPlaceholder: string;
    searchButton: string;
    clearFilters: string;
    showingCount: string;
    emptyStateTitle: string;
    emptyStateBody: string;
    priceOnRequest: string;
    fromPricePrefix: string;
    currencyCode: string;
    viewProduct: string;
    quickEnquire: string;
    allPackaging: string;
    packagingLabels: Record<string, string>;
  };
  pdp: {
    breadcrumbHome: string;
    breadcrumbCollections: string;
    skuLabel: string;
    categoryLabel: string;
    occasionsLabel: string;
    packagingLabel: string;
    availabilityLabel: string;
    availabilityValues: Record<'in_stock' | 'made_to_order' | 'seasonal' | 'unavailable', string>;
    leadTimeLabel: string;
    leadTimePending: string;
    pricingLabel: string;
    variantLabel: string;
    topperLabel: string;
    topperPlaceholder: string;
    topperChoices: Array<{ id: string; label: string }>;
    notesLabel: string;
    notesPlaceholder: string;
    enquireButton: string;
    enquireHelper: string;
    complementaryTitle: string;
    galleryThumbnailPrefix: string;
  };
  bespoke: {
    title: string;
    lead: string;
    stepOccasion: string;
    stepPresentation: string;
    stepCategoryMix: string;
    stepScale: string;
    stepCalligraphy: string;
    stepDateNotes: string;
    scalePlaceholder: string;
    calligraphyPlaceholder: string;
    dateNotesPlaceholder: string;
    submitCta: string;
    disclaimer: string;
    presentationChoices: Array<{ id: string; label: string }>;
    mixChoices: Array<{ id: string; label: string }>;
  };
  about: {
    title: string;
    lead: string;
    storyTitle: string;
    storyP1: string;
    storyP2: string;
    packagingTitle: string;
    packagingItems: Array<{ title: string; detail: string }>;
  };
  contact: {
    title: string;
    lead: string;
    conciergeTitle: string;
    conciergeBody: string;
    whatsappCta: string;
    showroomTitle: string;
    showroomBody: string;
    deliveryTitle: string;
    deliveryBody: string;
  };
  legal: {
    privacyTitle: string;
    privacyBody: string;
    allergenTitle: string;
    allergenBody: string;
  };
  footer: {
    collectionsHeading: string;
    occasionsHeading: string;
    atelierHeading: string;
    policiesHeading: string;
    privacyLink: string;
    allergenLink: string;
    copyright: string;
  };
  whatsappTemplates: {
    productEnquiry: string;
    bespokeEnquiry: string;
    generalEnquiry: string;
  };
}
