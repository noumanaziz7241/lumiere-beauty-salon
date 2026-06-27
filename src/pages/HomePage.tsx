import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CorePromises from '../components/CorePromises';
import AboutSection from '../components/AboutSection';
import ServiceCatalog from '../components/ServiceCatalog';
import Testimonials from '../components/Testimonials';
import BookingForm from '../components/BookingForm';
import ContactSection from '../components/ContactSection';
import ContactFooter from '../components/ContactFooter';
import { Service } from '../types';

export default function HomePage() {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleToggleService = (service: Service) => {
    setSelectedServices((prev) => {
      const exists = prev.some((item) => item.id === service.id);
      if (exists) {
        triggerNotification(`Removed: ${service.name}`);
        return prev.filter((item) => item.id !== service.id);
      }
      triggerNotification(`Added: ${service.name} to booking draft`);
      return [...prev, service];
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
      const timer = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const handleSectionClick = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-cream min-h-screen text-burgundy-dark font-sans selection:bg-rose/20 selection:text-burgundy">
      {showNotification && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 bg-burgundy border border-rose/30 py-3.5 px-5 rounded-xl shadow-2xl text-xs font-semibold tracking-wide text-rose-pale flex items-center gap-2.5 animate-slideLeft backdrop-blur duration-200">
          <div className="w-1.5 h-1.5 rounded-full bg-rose animate-ping" />
          <span>{notificationMessage}</span>
        </div>
      )}

      <Navbar onBookClick={() => handleSectionClick('appointment')} onSectionClick={handleSectionClick} />

      <main className="relative">
        <Hero
          onLearnMoreClick={() => handleSectionClick('services')}
          onBookClick={() => handleSectionClick('appointment')}
        />
        <CorePromises />
        <AboutSection />
        <ServiceCatalog
          selectedServices={selectedServices}
          onToggleService={handleToggleService}
          onContinueToBooking={() => handleSectionClick('appointment')}
        />
        <Testimonials />
        <BookingForm
          selectedServices={selectedServices}
          onRemoveService={handleRemoveService}
          onClearServices={handleClearServices}
          onBookingSuccess={() => triggerNotification('Privileged Appointment Booked Successfully!')}
        />
        <ContactSection />
      </main>

      <ContactFooter onBackToTop={() => handleSectionClick('hero')} />
    </div>
  );
}
