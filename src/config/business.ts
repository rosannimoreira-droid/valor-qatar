export type VerificationFlag = 'verified' | 'pending_verification';

export interface BusinessConfig {
  brand: {
    nameEn: string;
    nameAr: string;
    taglineEn: string;
    taglineAr: string;
    packagingQuoteEn: string;
    packagingQuoteAr: string;
    parentAttributionStatus: VerificationFlag;
  };
  site: {
    canonicalOrigin: string;
    defaultLocale: 'en' | 'ar';
  };
  concierge: {
    /** Central WhatsApp number (BVR-01: confirm before production cutover) */
    whatsappDigits: string;
    whatsappDisplay: string;
    verificationStatus: VerificationFlag;
  };
  location: {
    cityEn: string;
    cityAr: string;
    addressVerificationStatus: VerificationFlag;
    hoursVerificationStatus: VerificationFlag;
    deliveryPolicyVerificationStatus: VerificationFlag;
  };
}

export const BUSINESS_CONFIG: BusinessConfig = {
  brand: {
    nameEn: 'Valor Qatar',
    nameAr: 'فالور قطر',
    taglineEn: 'Haute Chocolaterie, Floristry & Qatari Hospitality',
    taglineAr: 'شوكولاتة فاخرة وزهور طبيعية وضيافة قطرية راقية',
    // Verified directly from Valor Qatar box lid photography
    packagingQuoteEn:
      'Pamper yourself with moments of happiness with every taste from the delicious Valor collection.',
    packagingQuoteAr: 'دلل نفسك بلحظات من السعادة مع كل طعم تتذوقه من مجموعة فالور اللذيذة.',
    parentAttributionStatus: 'pending_verification',
  },
  site: {
    canonicalOrigin: 'https://valor.sendianmedia.com',
    defaultLocale: 'en',
  },
  concierge: {
    // BVR-01: Number observed in archival brand media; confirm active WhatsApp Business line before launch
    whatsappDigits: '97459992926',
    whatsappDisplay: '+974 5999 2926',
    verificationStatus: 'pending_verification',
  },
  location: {
    cityEn: 'Doha, State of Qatar',
    cityAr: 'الدوحة، دولة قطر',
    addressVerificationStatus: 'pending_verification',
    hoursVerificationStatus: 'pending_verification',
    deliveryPolicyVerificationStatus: 'pending_verification',
  },
};

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${BUSINESS_CONFIG.concierge.whatsappDigits}?text=${encodeURIComponent(message)}`;
}
