export interface PromotionConfig {
  enabled: boolean;
  message: string;
  linkUrl?: string;
  linkLabel?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface GoogleReviewSnippet {
  id: string;
  author: string;
  text: string;
  rating: number;
  relativeTime?: string;
}

export interface GoogleReviewsConfig {
  enabled: boolean;
  averageRating: number;
  totalReviews: number;
  reviewsUrl: string;
  embedUrl?: string;
  snippets: GoogleReviewSnippet[];
}

export interface GalleryImage {
  id: string;
  title: string;
  category: 'bridal' | 'hair' | 'makeup' | 'before-after' | 'style-refresh' | 'salon' | 'other';
  imageUrl: string;
}

export interface BridalPackage {
  id: string;
  name: string;
  description: string;
  badge: 'Bridal' | 'Party' | 'Special';
  serviceIds: string[];
  highlight?: string;
}

export const DEFAULT_PROMOTION: PromotionConfig = {
  enabled: true,
  message: '20% off all facials this month — book your glow-up today!',
  linkUrl: '#appointment',
  linkLabel: 'Book now',
};

export const DEFAULT_GOOGLE_REVIEWS: GoogleReviewsConfig = {
  enabled: true,
  averageRating: 4.9,
  totalReviews: 127,
  reviewsUrl: 'https://www.google.com/maps',
  embedUrl: '',
  snippets: [
    {
      id: 'gr1',
      author: 'Ayesha K.',
      text: 'Best bridal makeup in Lahore. Professional, hygienic, and truly ladies only.',
      rating: 5,
      relativeTime: '2 weeks ago',
    },
    {
      id: 'gr2',
      author: 'Sana M.',
      text: 'Gold facial left my skin glowing. Staff is warm and the salon is spotless.',
      rating: 5,
      relativeTime: '1 month ago',
    },
  ],
};

export const DEFAULT_FAQ: FaqItem[] = [
  {
    id: 'faq1',
    category: 'Venue',
    question: 'Is Lumière strictly ladies only?',
    answer:
      'Yes. Lumière is a 100% ladies-only beauty sanctuary. We do not allow male clients or male staff on the premises, so you can relax in complete privacy.',
  },
  {
    id: 'faq2',
    category: 'Waxing',
    question: 'What waxing services do you offer?',
    answer:
      'We offer arms, legs, face, and full body waxing with hygienic disposable sheets. We do not provide bikini wax or chocolate wax.',
  },
  {
    id: 'faq3',
    category: 'Booking',
    question: 'What is your cancellation policy?',
    answer:
      'Please notify us at least 24 hours before your appointment to reschedule. Late cancellations or no-shows may affect future booking priority during peak bridal season.',
  },
  {
    id: 'faq4',
    category: 'Visit',
    question: 'Is parking available?',
    answer:
      'Street parking is available near the salon on Main Boulevard, DHA Phase 5. We recommend arriving 10 minutes early for check-in.',
  },
  {
    id: 'faq5',
    category: 'Booking',
    question: 'Do repeat clients get a discount?',
    answer:
      'Yes! Clients with a previous confirmed visit receive 10% off when booking with the same phone number.',
  },
  {
    id: 'faq6',
    category: 'Bridal',
    question: 'How early should I book bridal makeup?',
    answer:
      'We recommend booking bridal appointments at least 2–4 weeks in advance. Peak wedding season slots fill quickly.',
  },
];

export const DEFAULT_PACKAGES: BridalPackage[] = [
  {
    id: 'pkg-bridal-complete',
    name: 'Complete Bridal Package',
    description:
      'Full bridal transformation: premium makeup, hair styling, gold facial prep, and dupatta setting.',
    badge: 'Bridal',
    highlight: 'Most booked for wedding day',
    serviceIds: ['other-bridalpkg', 'makeup-bridal', 'hair-style', 'skin-gold', 'makeup-saree'],
  },
  {
    id: 'pkg-party-glam',
    name: 'Party Glam Package',
    description: 'Party makeup, blow-dry styling, and manicure — perfect for festive events.',
    badge: 'Party',
    serviceIds: ['makeup-party', 'hair-blowdry', 'care-mani'],
  },
  {
    id: 'pkg-engagement',
    name: 'Engagement Special',
    description: 'Engagement makeup with elegant hair styling and express cleanup.',
    badge: 'Special',
    serviceIds: ['makeup-engagement', 'hair-style', 'skin-cleanup'],
  },
];

export const DEFAULT_GALLERY: GalleryImage[] = [
  {
    id: 'gal1',
    title: 'Bridal makeup artistry',
    category: 'bridal',
    imageUrl: '/images/gallery/bridal-makeup.jpg',
  },
  {
    id: 'gal2',
    title: 'Wedding day prep',
    category: 'bridal',
    imageUrl: '/images/gallery/bridal-prep.jpg',
  },
  {
    id: 'gal3',
    title: 'Blow-dry styling',
    category: 'hair',
    imageUrl: '/images/gallery/hair-blowdry.jpg',
  },
  {
    id: 'gal4',
    title: 'Curl & set',
    category: 'hair',
    imageUrl: '/images/gallery/hair-curling.jpg',
  },
  {
    id: 'gal5',
    title: 'Precision cut',
    category: 'hair',
    imageUrl: '/images/gallery/hair-cut.jpg',
  },
  {
    id: 'gal6',
    title: 'Flawless makeup',
    category: 'makeup',
    imageUrl: '/images/gallery/makeup-application.jpg',
  },
  {
    id: 'gal7',
    title: 'Party glam',
    category: 'makeup',
    imageUrl: '/images/gallery/party-makeup.jpg',
  },
  {
    id: 'gal8',
    title: 'Salon interior',
    category: 'salon',
    imageUrl: '/images/gallery/salon-interior.jpg',
  },
  {
    id: 'gal9',
    title: 'Luxury styling stations',
    category: 'salon',
    imageUrl: '/images/gallery/luxury-salon.jpg',
  },
  {
    id: 'gal10',
    title: 'Colour transformation',
    category: 'style-refresh',
    imageUrl: '/images/gallery/hair-color.jpg',
  },
  {
    id: 'gal11',
    title: 'Glossy waves',
    category: 'style-refresh',
    imageUrl: '/images/gallery/before-after.jpg',
  },
  {
    id: 'gal12',
    title: 'Skin treatment',
    category: 'other',
    imageUrl: '/images/gallery/facial-treatment.jpg',
  },
  {
    id: 'gal13',
    title: 'Hair colour transformation',
    category: 'before-after',
    imageUrl: '/images/gallery/ba-hair.jpg',
  },
  {
    id: 'gal14',
    title: 'Makeup transformation',
    category: 'before-after',
    imageUrl: '/images/gallery/ba-makeup.jpg',
  },
];
