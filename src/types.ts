export interface Service {
  id: string;
  name: string;
  estimatedDuration: string;
  pricePKR: number; // In Pakistani Rupees (PKR) since the salon is in Lahore, Pakistan.
  description?: string;
}

export type ServiceSubcategory =
  | 'Hair'
  | 'Makeup'
  | 'Facial & Skin'
  | 'Hand & Foot'
  | 'Waxing'
  | 'Threading'
  | 'Other';

export interface ServiceCategory {
  id: string;
  name: ServiceSubcategory;
  description: string;
  services: Service[];
  icon: string; // Lucide icon identifier
}

export interface AppointmentBooking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  preferredDate: string;
  preferredTime: string;
  selectedServices: Service[];
  totalPrice: number;
  status: 'pending' | 'confirmed';
  notes?: string;
}

// Highly accurate service list based strictly on the user flyer, 
// excluding Chocolate Wax and Bikini Wax from Waxing Services.
export const SALON_SERVICES: ServiceCategory[] = [
  {
    id: 'hair',
    name: 'Hair',
    description: 'Expert crowns, rebonding, cuts, and transformations performed by professional artists.',
    icon: 'Scissors',
    services: [
      { id: 'hair-cut', name: 'Hair Cutting', estimatedDuration: '45 mins', pricePKR: 1500, description: 'Professional face-framing cuts and trims.' },
      { id: 'hair-style', name: 'Hair Styling', estimatedDuration: '30 mins', pricePKR: 1200, description: 'Gorgeous curls, sleek styling, and formal buns.' },
      { id: 'hair-straight', name: 'Hair Straightening', estimatedDuration: '60 mins', pricePKR: 2500, description: 'Silky smooth temporary straight style.' },
      { id: 'hair-rebond', name: 'Hair Rebonding', estimatedDuration: '180 mins', pricePKR: 12000, description: 'Long-lasting structural hair straightening treatment.' },
      { id: 'hair-smooth', name: 'Hair Smoothening', estimatedDuration: '120 mins', pricePKR: 8500, description: 'Frizz-free natural smoothening technique.' },
      { id: 'hair-color', name: 'Hair Coloring', estimatedDuration: '120 mins', pricePKR: 4500, description: 'Rich all-over global color using premium safe hair products.' },
      { id: 'hair-highlights', name: 'Highlights', estimatedDuration: '150 mins', pricePKR: 7500, description: 'Elegant dimensions and multi-tonal highlights.' },
      { id: 'hair-keratin', name: 'Keratin Treatment', estimatedDuration: '150 mins', pricePKR: 9500, description: 'Deep nourishing therapy to restore hair keratin & glass finish.' },
      { id: 'hair-spa', name: 'Hair Spa', estimatedDuration: '60 mins', pricePKR: 2800, description: 'Exfoliating and conditioning treatment with gentle steam.' },
      { id: 'hair-blowdry', name: 'Blow Dry', estimatedDuration: '25 mins', pricePKR: 1000, description: 'Classic voluminous or sleek blow-out finish.' },
      { id: 'hair-wash', name: 'Hair Wash', estimatedDuration: '15 mins', pricePKR: 600, description: 'Relaxing hot/cold scalp wash with premium shampoo and conditioner.' },
    ],
  },
  {
    id: 'makeup',
    name: 'Makeup',
    description: 'Stunning HD, bridal, and party wear aesthetics to make you feel like royalty.',
    icon: 'Sparkles',
    services: [
      { id: 'makeup-bridal', name: 'Bridal Makeup', estimatedDuration: '180 mins', pricePKR: 35000, description: 'Exquisite, full-glam traditional or contemporary bridal look with jewelry setting.' },
      { id: 'makeup-party', name: 'Party Makeup', estimatedDuration: '90 mins', pricePKR: 8000, description: 'Radiant, localized glam perfect for festive family events.' },
      { id: 'makeup-engagement', name: 'Engagement Makeup', estimatedDuration: '120 mins', pricePKR: 18000, description: 'Chic, luminous look designed for pre-wedding celebrations.' },
      { id: 'makeup-hd', name: 'HD Makeup', estimatedDuration: '100 mins', pricePKR: 12000, description: 'Camera-ready flawless makeup with high-definition pigments.' },
      { id: 'makeup-matte', name: 'Matte Makeup', estimatedDuration: '90 mins', pricePKR: 9000, description: 'Long-lasting shine-free velvet matte presentation.' },
      { id: 'makeup-eye', name: 'Eye Makeup', estimatedDuration: '30 mins', pricePKR: 3500, description: 'Dramatic smokey eyes or precise winged liner with lashes.' },
      { id: 'makeup-saree', name: 'Saree / Dupatta Setting', estimatedDuration: '20 mins', pricePKR: 1500, description: 'Impeccable structural pinning and drape adjustment for your events.' },
    ],
  },
  {
    id: 'facial',
    name: 'Facial & Skin',
    description: 'Rejuvenating skin facials, gold masks, and anti-aging care for a healthy, glowing look.',
    icon: 'Heart',
    services: [
      { id: 'skin-facial', name: 'Facial', estimatedDuration: '60 mins', pricePKR: 2000, description: 'Standard deep pore extraction and nourishing massage.' },
      { id: 'skin-cleanup', name: 'Cleanup', estimatedDuration: '30 mins', pricePKR: 1200, description: 'Quick express dirt removal, scrub, and soothing hydration.' },
      { id: 'skin-white', name: 'Whitening Facial', estimatedDuration: '75 mins', pricePKR: 3500, description: 'Lightening facial mask targeting pigmentation and dark spots.' },
      { id: 'skin-gold', name: 'Gold Facial', estimatedDuration: '90 mins', pricePKR: 5000, description: 'Luxurious anti-line active treatment using real gold particles.' },
      { id: 'skin-acne', name: 'Acne Treatment Facial', estimatedDuration: '75 mins', pricePKR: 4000, description: 'Deep calming salicylic pore relief for sensitive and breakout-prone skin.' },
      { id: 'skin-antiaging', name: 'Anti-Aging Facial', estimatedDuration: '80 mins', pricePKR: 4500, description: 'Hyaluronic hydration and peptide-boosted skin firming massage.' },
      { id: 'skin-bleach', name: 'Bleach', estimatedDuration: '20 mins', pricePKR: 800, description: 'Mild skin safe tone brightening and face hair matching.' },
      { id: 'skin-polish', name: 'Face Polish', estimatedDuration: '35 mins', pricePKR: 1500, description: 'Dermabrasion-style gentle skin polishing for absolute silkiness.' },
    ],
  },
  {
    id: 'hands-feet',
    name: 'Hand & Foot',
    description: 'Impeccable manicures, pedicures, extensions, and custom gel nails design.',
    icon: 'Sparkle',
    services: [
      { id: 'care-mani', name: 'Manicure', estimatedDuration: '45 mins', pricePKR: 1800, description: 'Hand massage, nail shaping, cuticle cleanup, and hydration.' },
      { id: 'care-pedi', name: 'Pedicure', estimatedDuration: '50 mins', pricePKR: 2200, description: 'Relaxing warm salt water foot bath, callus removal, and nail shaping.' },
      { id: 'care-nailart', name: 'Nail Art', estimatedDuration: '30 mins', pricePKR: 1500, description: 'Elegant handcrafted floral, classic French or glitter nail motifs.' },
      { id: 'care-gel', name: 'Gel Nails', estimatedDuration: '45 mins', pricePKR: 3000, description: 'Durable shine UV-baked long lasting gel color coats.' },
      { id: 'care-extension', name: 'Nail Extension', estimatedDuration: '90 mins', pricePKR: 5000, description: 'Premium visual acrylic tips customized to desired length & style.' },
      { id: 'care-paint', name: 'Nail Paint Application', estimatedDuration: '15 mins', pricePKR: 500, description: 'Classic nail polish application with quick-dry top coat.' },
    ],
  },
  {
    id: 'waxing',
    name: 'Waxing',
    description: 'Hygienic and smooth wax treatments (We do not provide Bikini Wax or Chocolate Wax).',
    icon: 'FlameKindling',
    services: [
      { id: 'wax-fullbody', name: 'Full Body Wax', estimatedDuration: '90 mins', pricePKR: 6000, description: 'Gentle, efficient overall hair removal targeting body zones.' },
      { id: 'wax-arms', name: 'Arms Wax', estimatedDuration: '25 mins', pricePKR: 1500, description: 'Smooth arm hair extraction up to shoulders.' },
      { id: 'wax-legs', name: 'Legs Wax', estimatedDuration: '35 mins', pricePKR: 2200, description: 'Lower and upper-thigh full leg silky smooth treatment.' },
      { id: 'wax-face', name: 'Face Wax', estimatedDuration: '15 mins', pricePKR: 1000, description: 'Delicate peach fuzz extraction for full-face smoothness.' },
    ],
  },
  {
    id: 'threading',
    name: 'Threading',
    description: 'Accurate and sanitary thread profiling for framing your eyes and forehead.',
    icon: 'Sparkle',
    services: [
      { id: 'thread-eyebrow', name: 'Eyebrow Threading', estimatedDuration: '12 mins', pricePKR: 250, description: 'Precision organic dynamic thread arch shaping.' },
      { id: 'thread-upperlip', name: 'Upper Lip Threading', estimatedDuration: '8 mins', pricePKR: 150, description: 'Fast, smooth upper lip area hair removal.' },
      { id: 'thread-forehead', name: 'Forehead Threading', estimatedDuration: '10 mins', pricePKR: 200, description: 'Clean brow alignment and forehead hair clearing.' },
      { id: 'thread-fullface', name: 'Full Face Threading', estimatedDuration: '30 mins', pricePKR: 800, description: 'Overall face cleaning, leaving your skin soft and clear.' },
    ],
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Seasonal packages, traditional mehndi, eyelash extensions, and modern hijab styling.',
    icon: 'Package',
    services: [
      { id: 'other-mehndi', name: 'Mehndi / Henna', estimatedDuration: '45 mins', pricePKR: 1500, description: 'Intricate traditional floral or bridal organic henna hands art.' },
      { id: 'other-lashes', name: 'Eyelash Extensions', estimatedDuration: '90 mins', pricePKR: 4500, description: 'Meticulous, gorgeous synthetic lash strands customized in lengths.' },
      { id: 'other-hijab', name: 'Hijab Styling', estimatedDuration: '20 mins', pricePKR: 1200, description: 'Modern, elegant drapery with active headpin anchoring.' },
      { id: 'other-skintone', name: 'Skin Treatments', estimatedDuration: '75 mins', pricePKR: 4000, description: 'Custom specialist consultations and serums for flawless textures.' },
      { id: 'other-bridalpkg', name: 'Bridal Packages', estimatedDuration: '240 mins', pricePKR: 45000, description: 'Complete luxury bridal bundle including haircut, massage, makeup & details.' },
      { id: 'other-groompkg', name: 'Groom Packages', estimatedDuration: '120 mins', pricePKR: 15000, description: 'Custom packages for male attendees (Groom/Family styling, by appointment).' },
    ],
  },
];
