import { ServiceCategory } from '../types';
import { SALON_SERVICES } from '../types';
import {
  BridalPackage,
  FaqItem,
  GalleryImage,
  GoogleReviewsConfig,
  PromotionConfig,
  DEFAULT_PROMOTION,
  DEFAULT_GOOGLE_REVIEWS,
  DEFAULT_FAQ,
  DEFAULT_PACKAGES,
  DEFAULT_GALLERY,
} from './marketingDefaults';
import {
  ChatConfig,
  GiftVoucherConfig,
  DEFAULT_CHAT,
  DEFAULT_GIFT_VOUCHERS,
} from './experienceDefaults';

export type {
  BridalPackage,
  FaqItem,
  GalleryImage,
  GoogleReviewsConfig,
  PromotionConfig,
} from './marketingDefaults';

export type { ChatConfig, GiftVoucherConfig, ChatProvider } from './experienceDefaults';

export interface BusinessHours {
  days: string;
  hours: string;
  closed?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  service?: string;
}

export interface CorePromise {
  title: string;
  description: string;
}

export interface SalonConfig {
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    city: string;
    mapEmbedUrl: string;
  };
  social: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
  businessHours: BusinessHours[];
  hoursNote: string;
  hero: {
    tagline: string;
    subtitle: string;
    motto: string;
    bannerText: string;
    cardTitle: string;
    cardSubtitle: string;
    cardDescription: string;
  };
  about: {
    title: string;
    subtitle: string;
    paragraphs: string[];
    highlights: string[];
  };
  footer: {
    description: string;
    slogan: string;
    tagline: string;
  };
  navbar: {
    bannerText: string;
  };
  corePromises: CorePromise[];
  testimonials: Testimonial[];
  services: ServiceCategory[];
  timeSlots: string[];
  promotion: PromotionConfig;
  googleReviews: GoogleReviewsConfig;
  faq: FaqItem[];
  packages: BridalPackage[];
  gallery: GalleryImage[];
  chat: ChatConfig;
  giftVouchers: GiftVoucherConfig;
  adminPassword: string;
}

export const DEFAULT_SALON_CONFIG: SalonConfig = {
  contact: {
    phone: '+92 300 1234567',
    whatsapp: '923001234567',
    email: 'hello@lumierebeauty.pk',
    address: 'Shop 12, Main Boulevard, DHA Phase 5',
    city: 'Lahore, Pakistan',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3403.0!2d74.3587!3d31.4697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDI4JzExLjAiTiA3NMKwMjEnMzEuMyJF!5e0!3m2!1sen!2spk!4v1',
  },
  social: {
    instagram: 'https://instagram.com/lumierebeautysalon',
    facebook: 'https://facebook.com/lumierebeautysalon',
    tiktok: 'https://tiktok.com/@lumierebeautysalon',
  },
  businessHours: [
    { days: 'Tuesday – Sunday', hours: '10:30 AM – 08:30 PM' },
    { days: 'Mondays', hours: 'Closed for Sanitization', closed: true },
  ],
  hoursNote:
    'Booking in advance guarantees that our stylist has a fully dedicated time block designated for your service.',
  hero: {
    tagline: 'Redefining Elegance',
    subtitle: 'Beauty Salon',
    motto: 'Because You Deserve to Shine',
    bannerText: 'Ladies Only Sanctuary',
    cardTitle: 'LADIES ONLY',
    cardSubtitle: 'Your Beauty, Our Passion',
    cardDescription: 'Premium treatments in a private, ladies-only setting',
  },
  about: {
    title: 'Our Story',
    subtitle: 'A sanctuary crafted for women, by women',
    paragraphs: [
      'Founded with a vision to create a safe, luxurious space where every woman feels celebrated, Lumière Beauty Salon has become Lahore\'s premier ladies-only beauty destination.',
      'Our team of certified stylists and beauticians bring years of expertise in hair artistry, HD makeup, advanced skincare, and bridal transformations. We use only imported, dermatologist-approved products because your skin deserves nothing less.',
      'From your first consultation to your final reveal, every detail is tailored to you. Walk in feeling welcomed, walk out feeling radiant.',
    ],
    highlights: [
      '10+ years of combined expertise',
      '500+ happy brides styled',
      '100% ladies-only private venue',
      'Premium imported products only',
    ],
  },
  footer: {
    description:
      'A private, premium, and fully hygienic Ladies Only beauty sanctuary. We design custom cuts, HD makeup, and restorative facials tailored to make your natural radiance shine.',
    slogan: 'Look Beautiful, Feel Beautiful.',
    tagline: 'BE BEAUTIFUL, BE YOU!',
  },
  navbar: {
    bannerText: 'LADIES ONLY SALON • Professional Care Guaranteed',
  },
  corePromises: [
    {
      title: 'Professional Staff',
      description:
        'Highly trained hair stylists and certified skin beauticians with years of premium treatment mastery.',
    },
    {
      title: 'Premium Quality',
      description:
        'Only imported, non-toxic, and dermatologist-approved beauty cosmetics are placed on your skin and hair.',
    },
    {
      title: 'Hygienic & Safe',
      description:
        '100% sanitized tools, disposal towels, and ultra-hygienic individual waxing sheets for complete safety.',
    },
    {
      title: 'Exclusive Care',
      description:
        'Custom consultations. Because your skin and style are unique, we tailor our touch to optimize your beauty.',
    },
  ],
  testimonials: [
    {
      id: 't1',
      name: 'Ayesha K.',
      text: 'My bridal makeup was absolutely flawless! The team understood exactly what I wanted and made me feel like a princess on my big day.',
      rating: 5,
      service: 'Bridal Makeup',
    },
    {
      id: 't2',
      name: 'Fatima R.',
      text: 'Best hair rebonding experience in Lahore. My hair has never looked this silky and healthy. The salon is so clean and private.',
      rating: 5,
      service: 'Hair Rebonding',
    },
    {
      id: 't3',
      name: 'Sana M.',
      text: 'I love that it\'s strictly ladies only — I can truly relax. Their gold facial left my skin glowing for weeks!',
      rating: 5,
      service: 'Gold Facial',
    },
    {
      id: 't4',
      name: 'Hira A.',
      text: 'Professional, hygienic, and worth every rupee. I\'ve been coming here for over a year and never disappointed.',
      rating: 5,
      service: 'Regular Client',
    },
  ],
  services: SALON_SERVICES,
  timeSlots: [
    '10:30 AM', '11:30 AM', '12:30 PM', '01:30 PM', '02:30 PM',
    '03:30 PM', '04:30 PM', '05:30 PM', '06:30 PM', '07:30 PM',
  ],
  promotion: DEFAULT_PROMOTION,
  googleReviews: DEFAULT_GOOGLE_REVIEWS,
  faq: DEFAULT_FAQ,
  packages: DEFAULT_PACKAGES,
  gallery: DEFAULT_GALLERY,
  chat: DEFAULT_CHAT,
  giftVouchers: DEFAULT_GIFT_VOUCHERS,
  adminPassword: 'lumiere2024',
};

export type PublicSalonConfig = Omit<SalonConfig, 'adminPassword'>;
