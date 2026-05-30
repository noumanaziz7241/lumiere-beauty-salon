import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CorePromises from './components/CorePromises';
import ServiceCatalog from './components/ServiceCatalog';
import BookingForm from './components/BookingForm';
import ContactFooter from './components/ContactFooter';
import { Service } from './types';
import { Calendar, ShieldAlert } from 'lucide-react';

export default function App() {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Handle service addition/removal from catalog selection
  const handleToggleService = (service: Service) => {
    setSelectedServices((prev) => {
      const exists = prev.some((item) => item.id === service.id);
      if (exists) {
        triggerNotification(`Removed: ${service.name}`);
        return prev.filter((item) => item.id !== service.id);
      } else {
        triggerNotification(`Added: ${service.name} to booking draft`);
        return [...prev, service];
      }
    });
  };

  const handleRemoveService = (service: Service) => {
    setSelectedServices((prev) => prev.filter((item) => item.id !== service.id));
    triggerNotification(`Removed: ${service.name}`);
  };

  const handleClearServices = () => {
    setSelectedServices([]);
    triggerNotification('All services cleared');
  };

  const triggerNotification = (msg: string) => {
    setNotificationMessage(msg);
    setShowNotification(true);
  };

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  // Smooth scroll helper
  const handleSectionClick = (sectionId: string) => {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBookNowClick = () => {
    handleSectionClick('appointment');
  };

  const handleBookingSuccess = () => {
    triggerNotification('Privileged Appointment Booked Successfully! ✨');
  };

  return (
    <div className="bg-stone-950 min-h-screen text-stone-100 font-sans selection:bg-amber-500/30 selection:text-amber-100">
      
      {/* Dynamic Pop notification toast for system responses */}
      {showNotification && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 bg-stone-900 border border-amber-500/30 py-3.5 px-5 rounded-xl shadow-2xl text-xs font-semibold tracking-wide text-amber-400 flex items-center gap-2.5 animate-slideLeft backdrop-blur duration-200">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          <span>{notificationMessage}</span>
        </div>
      )}

      {/* Elegant Header Navigation */}
      <Navbar
        onBookClick={handleBookNowClick}
        onSectionClick={handleSectionClick}
      />

      {/* Main Home Screen Segment */}
      <main className="relative">
        
        {/* Cinematic Hero visual stage */}
        <Hero
          onLearnMoreClick={() => handleSectionClick('services')}
          onBookClick={handleBookNowClick}
        />

        {/* Quality Promises Segment */}
        <CorePromises />

        {/* Dynamic searchable service catalog list */}
        <ServiceCatalog
          selectedServices={selectedServices}
          onToggleService={handleToggleService}
          onContinueToBooking={handleBookNowClick}
        />

        {/* Booking slot scheduler containing invoice summaries */}
        <BookingForm
          selectedServices={selectedServices}
          onRemoveService={handleRemoveService}
          onClearServices={handleClearServices}
          onBookingSuccess={handleBookingSuccess}
        />

      </main>

      {/* Contact mapping & Slogans Footer segment */}
      <ContactFooter onBackToTop={() => handleSectionClick('hero')} />

    </div>
  );
}
