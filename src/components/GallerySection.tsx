import React, { useState } from 'react';
import { Images } from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';
import type { GalleryImage } from '../config/marketingDefaults';

const FILTERS: Array<GalleryImage['category'] | 'all'> = [
  'all',
  'bridal',
  'hair',
  'makeup',
  'before-after',
  'style-refresh',
  'salon',
  'other',
];

function categoryLabel(cat: GalleryImage['category'] | 'all') {
  if (cat === 'all') return 'All';
  return cat.replace(/-/g, ' ');
}

export default function GallerySection() {
  const { config } = useSalonConfig();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all');

  const images =
    filter === 'all' ? config.gallery : config.gallery.filter((g) => g.category === filter);

  if (!config.gallery.length) return null;

  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-white to-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-[0.25em] font-sans font-extrabold text-rose mb-2">
            Our work
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-burgundy">Gallery</h2>
          <p className="text-sm text-burgundy/60 mt-3 font-sans">
            Bridal transformations, hair artistry, and salon moments
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-rose to-gold mx-auto mt-4 rounded-full" />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {FILTERS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider border cursor-pointer transition-colors ${
                filter === cat
                  ? 'bg-burgundy text-white border-burgundy'
                  : 'bg-white text-burgundy/70 border-rose-pale'
              }`}
            >
              {categoryLabel(cat)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <figure
              key={img.id}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-rose-pale/50 shadow-sm bg-rose-pale/20"
            >
              <img
                src={img.imageUrl}
                alt={img.title}
                className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ${
                  img.category === 'before-after'
                    ? 'object-cover object-center'
                    : 'object-cover'
                }`}
                loading="lazy"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-burgundy/90 to-transparent p-3">
                <p className="text-white text-xs font-serif font-bold">{img.title}</p>
                <p className="text-rose-pale/80 text-[10px] uppercase tracking-wider">
                  {categoryLabel(img.category)}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-16 text-burgundy/50">
            <Images className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No photos in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
