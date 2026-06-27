import React from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-4 h-4 ${n <= Math.round(rating) ? 'fill-gold text-gold' : 'text-rose-pale'}`}
        />
      ))}
    </div>
  );
}

export default function GoogleReviewsSection() {
  const { config } = useSalonConfig();
  const { googleReviews } = config;

  if (!googleReviews.enabled) return null;

  return (
    <section id="google-reviews" className="py-20 bg-white border-t border-rose-pale/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-sans font-extrabold text-rose mb-2">
                Google Reviews
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-burgundy">
                Loved on Google
              </h2>
            </div>

            <div className="inline-flex items-center gap-4 bg-cream rounded-2xl border border-rose-pale/50 px-6 py-4">
              <div className="text-4xl font-black text-burgundy">{googleReviews.averageRating.toFixed(1)}</div>
              <div>
                <Stars rating={googleReviews.averageRating} />
                <p className="text-xs text-burgundy/60 mt-1 font-sans">
                  Based on {googleReviews.totalReviews.toLocaleString()} Google reviews
                </p>
              </div>
            </div>

            {googleReviews.reviewsUrl && (
              <a
                href={googleReviews.reviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-burgundy text-white text-xs uppercase font-bold tracking-wider hover:bg-burgundy-light transition-colors"
              >
                Read all on Google
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <div className="space-y-4">
              {googleReviews.snippets.map((review) => (
                <blockquote
                  key={review.id}
                  className="rounded-2xl border border-rose-pale/50 bg-cream/50 p-4"
                >
                  <Stars rating={review.rating} />
                  <p className="text-sm text-burgundy/80 mt-2 font-sans leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                  <footer className="mt-2 text-xs font-bold text-burgundy">
                    {review.author}
                    {review.relativeTime && (
                      <span className="font-normal text-burgundy/50"> · {review.relativeTime}</span>
                    )}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>

          {googleReviews.embedUrl ? (
            <div className="rounded-2xl overflow-hidden border border-rose-pale/50 shadow-lg min-h-[400px]">
              <iframe
                src={googleReviews.embedUrl}
                title="Google Maps reviews"
                className="w-full h-full min-h-[400px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-rose-pale bg-cream/30 p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
              <Star className="w-12 h-12 text-gold mb-4" />
              <p className="text-sm text-burgundy/70 font-sans max-w-sm">
                Add your Google Maps embed URL in Admin → Marketing to show live reviews here.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
