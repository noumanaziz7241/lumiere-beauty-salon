import React, { useState } from 'react';
import {
  Scissors,
  Sparkles,
  Heart,
  Flame,
  Package,
  Search,
  Clock,
  Plus,
  Check,
  ShoppingBag,
  HelpCircle,
} from 'lucide-react';
import { SALON_SERVICES, Service, ServiceCategory, ServiceSubcategory } from '../types';

interface ServiceCatalogProps {
  selectedServices: Service[];
  onToggleService: (service: Service) => void;
  onContinueToBooking: () => void;
}

export default function ServiceCatalog({
  selectedServices,
  onToggleService,
  onContinueToBooking,
}: ServiceCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceSubcategory>('Hair');
  const [searchQuery, setSearchQuery] = useState('');

  // Icon mapping for high aesthetic consistency
  const getCategoryIcon = (categoryName: ServiceSubcategory) => {
    switch (categoryName) {
      case 'Hair':
        return <Scissors className="w-4 h-4" />;
      case 'Makeup':
        return <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />;
      case 'Facial & Skin':
        return <Heart className="w-4 h-4 text-rose-400" />;
      case 'Hand & Foot':
        return <NailFileIcon className="w-4 h-4 text-pink-400" />;
      case 'Waxing':
        return <Flame className="w-4 h-4 text-amber-500" />;
      case 'Threading':
        return <ThreadIcon className="w-4 h-4 text-emerald-400" />;
      case 'Other':
        return <Package className="w-4 h-4 text-purple-400" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const categories = SALON_SERVICES;

  // Filter services based on search query
  const allServicesFiltered = categories.flatMap((cat) =>
    cat.services.map((srv) => ({ ...srv, categoryName: cat.name }))
  ).filter((srv) => {
    const searchMatch = srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (srv.description && srv.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return searchMatch;
  });

  const currentCategoryData = categories.find((cat) => cat.name === activeCategory);

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some((item) => item.id === serviceId);
  };

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-white via-[#fdf8f6] to-white border-b border-pink-100/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Grid */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.25em] font-sans font-extrabold text-pink-600 mb-2">Our Signature Offerings</p>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-pink-900 leading-tight">
              Aesthetic Therapies
            </h2>
            <p className="font-sans text-pink-955/70 text-sm mt-3 font-medium">
              Explore our curated selection. Pick multiple treatments to compose your custom look, then book your appointment seamlessly.
            </p>
          </div>

          {/* Elegant Search Bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search services (e.g. Keratin)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/70 text-pink-900 placeholder-pink-300 py-3.5 pl-11 pr-4 rounded-xl border border-pink-100 focus:border-pink-500/70 outline-none font-sans text-sm transition-all shadow-sm"
            />
            <Search className="w-4 h-4 text-pink-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {searchQuery ? (
          // Search results view
          <div className="space-y-6">
            <div className="flex items-baseline justify-between">
              <h3 className="font-sans text-pink-900 text-sm font-semibold">
                Search Results for "{searchQuery}" ({allServicesFiltered.length} matches)
              </h3>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-pink-600 font-bold hover:underline"
              >
                Clear Search
              </button>
            </div>

            {allServicesFiltered.length === 0 ? (
              <div className="bg-pink-50/30 rounded-2xl p-12 border border-pink-100/60 text-center">
                <p className="text-pink-900/80 font-sans text-sm font-semibold">No services matched your search parameters.</p>
                <p className="text-pink-800/80 font-sans text-xs mt-1">Try typing a keyword like 'Full Body Wax', 'Facial', 'Lashes', or 'Makeup'.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allServicesFiltered.map((service) => {
                  const selected = isServiceSelected(service.id);
                  return (
                    <div
                      key={service.id}
                      className={`bg-white/40 p-5 rounded-2xl border transition-all duration-300 flex justify-between items-start gap-4 ${
                        selected
                          ? 'border-pink-500/30 bg-white/90 shadow-lg'
                          : 'border-pink-100 hover:border-pink-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-pink-700 bg-pink-50 border border-pink-200 px-1.5 py-0.5 rounded">
                            {service.categoryName}
                          </span>
                          <h4 className="font-serif text-base font-bold text-pink-900">{service.name}</h4>
                        </div>
                        {service.description && (
                          <p className="font-sans text-xs text-pink-955/70 leading-relaxed max-w-sm">
                            {service.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 pt-2 text-pink-900/60 font-sans text-[10px] font-semibold uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-pink-400" />
                            {service.estimatedDuration}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between h-full min-h-[70px] min-w-[100px]">
                        <span className="font-sans text-pink-900 text-sm font-bold">
                          {formatPKR(service.pricePKR)}
                        </span>
                        <button
                          onClick={() => onToggleService(service)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer border transition-all ${
                            selected
                              ? 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200/50'
                              : 'bg-pink-900 text-white border-pink-900/10 hover:bg-pink-850'
                          }`}
                        >
                          {selected ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-pink-600" />
                              Added
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5 text-pink-300" />
                              Add
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          // Category-based grid layout tabs
          <div className="space-y-8">
            {/* Horizontal Scrollable/Flex Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 scrollbar-none border-b border-pink-100/30">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.name)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wide border whitespace-nowrap cursor-pointer transition-all duration-300 ${
                    activeCategory === category.name
                      ? 'bg-pink-900 border-pink-900 text-white shadow-sm'
                      : 'bg-white/50 border-pink-100/70 text-pink-900/80 hover:text-pink-900 hover:bg-white'
                  }`}
                >
                  {getCategoryIcon(category.name)}
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Current Category Header Description */}
            <div className="flex items-center justify-between text-pink-900/80 text-xs sm:text-sm pt-2">
              <p className="italic font-serif max-w-xl text-pink-900">
                "{currentCategoryData?.description}"
              </p>
              {activeCategory === 'Waxing' && (
                <span className="text-[10px] sm:text-xs font-sans font-bold bg-pink-50 border border-pink-200 text-pink-700 px-2.5 py-1 rounded-lg">
                  No Bikini or Chocolate Wax
                </span>
              )}
            </div>

            {/* Standard Service Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {currentCategoryData?.services.map((service) => {
                const selected = isServiceSelected(service.id);
                return (
                  <div
                    key={service.id}
                    className={`bg-white/45 p-5 sm:p-6 rounded-2xl border transition-all duration-300 flex justify-between items-start gap-4 ${
                      selected
                        ? 'border-pink-300 bg-white shadow-md translate-y-[-2px]'
                        : 'border-pink-100 hover:border-pink-200'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <h4 className="font-serif text-base sm:text-lg font-extrabold text-pink-900">{service.name}</h4>
                      {service.description && (
                        <p className="font-sans text-xs text-pink-955/70 leading-relaxed max-w-sm">
                          {service.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 pt-2 text-pink-900/60 font-sans text-[10px] font-semibold uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-pink-400" />
                          {service.estimatedDuration}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between h-full min-h-[70px] min-w-[100px]">
                      <span className="font-sans text-pink-900 text-sm font-bold">
                        {formatPKR(service.pricePKR)}
                      </span>
                      <button
                        onClick={() => onToggleService(service)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer border transition-all ${
                          selected
                            ? 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200/50'
                            : 'bg-pink-900 text-white border-pink-900/10 hover:bg-pink-850'
                        }`}
                      >
                        {selected ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-pink-600" />
                            Added
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-pink-300" />
                            Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Specific notice boundary for waxing restriction */}
            {activeCategory === 'Waxing' && (
              <div className="bg-pink-50/50 border border-pink-200/60 rounded-2xl p-5 mt-6 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-serif text-pink-900 text-sm font-extrabold">Waxing Services Policy Message</h5>
                  <p className="font-sans text-xs text-pink-955/70 mt-1 leading-relaxed">
                    At KOMSL Beauty Salon, we offer high-grade, hygienic strip and face waxing designed for sensitive and delicate female skin. Please note that **we strictly do not provide Bikini Wax or Chocolate Wax** services. Safe alternative wax treatments are available above.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating summary bar when items are in queue */}
        {selectedServices.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-40 bg-white/90 border border-pink-200 p-4 rounded-2xl shadow-xl backdrop-blur-xl flex items-center justify-between gap-4 animate-slideUp">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-pink-700 flex items-center justify-center">
                <ShoppingBag className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <p className="text-xs font-sans text-pink-900 uppercase tracking-widest font-bold">
                  {selectedServices.length} {selectedServices.length === 1 ? 'Service' : 'Services'} Chosen
                </p>
                <p className="text-[11px] font-sans text-pink-700 font-extrabold">
                  Est. Total: {formatPKR(selectedServices.reduce((sum, item) => sum + item.pricePKR, 0))}
                </p>
              </div>
            </div>
            <button
              onClick={onContinueToBooking}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-pink-900 hover:bg-pink-850 text-white shadow border border-pink-700/15 cursor-pointer"
            >
              Confirm Now
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

// Custom simple Lucide-like icons for Thread or Nail File
function ThreadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
      <path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" />
    </svg>
  );
}

function NailFileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="m14 4 8 8" />
      <path d="M4 14l8-8 8 8-8 8z" />
    </svg>
  );
}
