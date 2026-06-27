import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, FileText, Ticket, Trash2, Scissors, MessageCircle, Sparkles } from 'lucide-react';
import { Service, AppointmentBooking, BookingWhatsAppNotifications } from '../types';
import { useSalonConfig } from '../context/SalonConfigContext';
import { api } from '../api/client';
import WhatsAppMessagePanel from './WhatsAppMessagePanel';
import VisitDurationSummary from './VisitDurationSummary';
import { calculateBookingPrice, REPEAT_CLIENT_DISCOUNT_PERCENT } from '../../shared/bookingPricing.ts';

interface BookingFormProps {
  selectedServices: Service[];
  onRemoveService: (service: Service) => void;
  onClearServices: () => void;
  onBookingSuccess: () => void;
}

export default function BookingForm({
  selectedServices,
  onRemoveService,
  onClearServices,
  onBookingSuccess,
}: BookingFormProps) {
  const { config } = useSalonConfig();
  const timeSlots = config.timeSlots;

  // Booking Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState<AppointmentBooking | null>(null);
  const [whatsappNotifications, setWhatsappNotifications] =
    useState<BookingWhatsAppNotifications | null>(null);
  const [isReturningClient, setIsReturningClient] = useState(false);

  useEffect(() => {
    const phone = customerPhone.replace(/\D/g, '');
    if (phone.length < 10) {
      setIsReturningClient(false);
      return;
    }

    const timer = window.setTimeout(() => {
      api.checkReturningClient(customerPhone)
        .then((data) => setIsReturningClient(data.isReturningClient))
        .catch(() => setIsReturningClient(false));
    }, 400);

    return () => window.clearTimeout(timer);
  }, [customerPhone]);

  useEffect(() => {
    if (!preferredDate) {
      setBookedSlots([]);
      return;
    }
    api.getAvailability(preferredDate)
      .then((data) => {
        setBookedSlots(data.bookedSlots);
        if (preferredTime && data.bookedSlots.includes(preferredTime)) {
          setPreferredTime('');
        }
      })
      .catch(() => setBookedSlots([]));
  }, [preferredDate, preferredTime]);

  const totalAmount = selectedServices.reduce((sum, item) => sum + item.pricePKR, 0);
  const pricing = calculateBookingPrice(totalAmount, isReturningClient);

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const validateBookingForm = (): string[] => {
    const issues: string[] = [];
    if (selectedServices.length === 0) {
      issues.push('Select at least one service from the catalog above');
    }
    if (!customerName.trim()) issues.push('Enter your full name');
    if (!customerPhone.trim()) issues.push('Enter your phone number');
    if (!preferredDate) issues.push('Choose a preferred date');
    if (!preferredTime) issues.push('Select a time slot');
    return issues;
  };

  const bookingIssues = validateBookingForm();
  const isBookingReady = bookingIssues.length === 0;

  useEffect(() => {
    if (submitError && isBookingReady) {
      setSubmitError('');
    }
  }, [submitError, isBookingReady]);

  const submitBooking = async () => {
    const issues = validateBookingForm();
    if (issues.length > 0) {
      setSubmitError(issues.join('. ') + '.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await api.createBooking({
        customerName,
        customerPhone,
        customerEmail,
        preferredDate,
        preferredTime,
        serviceIds: selectedServices.map((s) => s.id),
        notes,
      });
      setConfirmedBooking(response);
      setWhatsappNotifications(response.whatsappNotifications);
      onBookingSuccess();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookingSubmit = async () => {
    await submitBooking();
  };

  const handleWhatsAppBooking = async () => {
    await submitBooking();
  };

  const today = new Date().toISOString().split('T')[0];

  const handleReset = () => {
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setPreferredDate('');
    setPreferredTime('');
    setNotes('');
    setConfirmedBooking(null);
    setWhatsappNotifications(null);
    onClearServices();
  };

  // If appointment booking is confirmed, render the luxury Ticket checkout receipt
  if (confirmedBooking) {
    return (
      <section id="appointment" className="py-20 bg-gradient-to-b from-[#fdf8f6] via-white to-[#fdf8f6] flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-3xl bg-white/60 border border-white/80 rounded-3xl overflow-hidden shadow-xl backdrop-blur-xl relative animate-fadeIn duration-500">
          
          {/* Ticket Header Graphic Accent */}
          <div className="bg-[#501d2c] p-6 text-center relative">
            <div className="absolute top-4 right-4 text-burgundy bg-rose-pale text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full">
              {confirmedBooking.status === 'pending' ? 'Pending' : 'Confirmed'}
            </div>
            <Ticket className="w-10 h-10 text-pink-200 mx-auto mb-2 animate-bounce" />
            <h3 className="font-serif text-2xl font-black text-white leading-tight uppercase">Lumière Appointment</h3>
            <p className="font-sans text-[11px] text-pink-200 uppercase tracking-widest mt-1">Ladies Only Premium Privilege</p>
          </div>

          {/* Core Ticket Content Body */}
          <div className="p-6 sm:p-8 space-y-6 relative bg-white/30 backdrop-blur-lg">
            {/* Round notches on the side to look like a physical ticket stub */}
            <div className="absolute top-0 left-[-12px] w-6 h-6 rounded-full bg-[#fdf8f6] border-r border-pink-100" />
            <div className="absolute top-0 right-[-12px] w-6 h-6 rounded-full bg-[#fdf8f6] border-l border-pink-100" />

            <div className="text-center">
              <span className="text-xs font-sans text-pink-900/60 uppercase tracking-widest font-semibold">Appointment ID Reference</span>
              <p className="font-sans text-2xl font-black text-burgundy tracking-wider mt-0.5">{confirmedBooking.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-b border-pink-100/50 py-4.5">
              <div>
                <span className="text-[10px] font-sans text-pink-900/50 uppercase tracking-widest block">Client Name</span>
                <span className="font-serif text-sm font-bold text-pink-900">{confirmedBooking.customerName}</span>
              </div>
              <div>
                <span className="text-[10px] font-sans text-pink-900/50 uppercase tracking-widest block">Phone Number</span>
                <span className="font-mono text-sm text-burgundy font-semibold">{confirmedBooking.customerPhone}</span>
              </div>
              <div className="mt-2">
                <span className="text-[10px] font-sans text-pink-900/50 uppercase tracking-widest block">Reserved Date</span>
                <span className="font-sans text-xs font-bold text-pink-700 flex items-center gap-1 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-pink-500" />
                  {confirmedBooking.preferredDate}
                </span>
              </div>
              <div className="mt-2">
                <span className="text-[10px] font-sans text-pink-900/50 uppercase tracking-widest block">Start Time</span>
                <span className="font-sans text-xs font-bold text-pink-700 flex items-center gap-1 mt-1">
                  <Clock className="w-3.5 h-3.5 text-pink-500" />
                  {confirmedBooking.preferredTime}
                </span>
              </div>
            </div>

            {/* List booked services */}
            <div>
              <span className="text-[10px] font-sans text-pink-900/50 uppercase tracking-widest block mb-2">Booked Treatments</span>
              <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin pr-1">
                {confirmedBooking.selectedServices.map((srv) => (
                  <div key={srv.id} className="flex justify-between items-center text-xs bg-white/60 py-2 px-3 rounded-xl border border-pink-100">
                    <span className="font-serif font-black text-pink-900">{srv.name}</span>
                    <span className="font-sans text-burgundy-light font-bold">{formatPKR(srv.pricePKR)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="bg-white/70 p-4.5 rounded-2xl border border-pink-200 space-y-2">
              {confirmedBooking.discountAmount && confirmedBooking.discountAmount > 0 ? (
                <>
                  <div className="flex justify-between items-center text-xs text-pink-900/70">
                    <span>Subtotal</span>
                    <span>{formatPKR(confirmedBooking.subtotalPrice ?? confirmedBooking.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-green-700 font-semibold">
                    <span>Repeat client discount ({confirmedBooking.discountPercent}%)</span>
                    <span>-{formatPKR(confirmedBooking.discountAmount)}</span>
                  </div>
                </>
              ) : null}
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-pink-900/60 font-bold">Total Service Fee</span>
                <span className="font-sans text-xl font-extrabold text-pink-900">{formatPKR(confirmedBooking.totalPrice)}</span>
              </div>
            </div>

            {whatsappNotifications && (
              <div className="space-y-4 border-t border-pink-100/50 pt-6">
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-green-800 flex items-center justify-center gap-1.5">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp on this page
                  </p>
                  <p className="text-[11px] text-burgundy/70 font-sans leading-relaxed max-w-lg mx-auto">
                    Scan the QR code or use Open WhatsApp below. Tap <strong>Send</strong> in each
                    chat — messages are not sent automatically.
                  </p>
                </div>

                <WhatsAppMessagePanel
                  step={1}
                  title="Notify the salon"
                  description="Scan or open WhatsApp to send your booking to us."
                  message={whatsappNotifications.salonMessage}
                  whatsappUrl={whatsappNotifications.salonUrl}
                  accent="salon"
                />

                <WhatsAppMessagePanel
                  step={2}
                  title="Save your confirmation"
                  description="Scan or open WhatsApp to keep a copy on your phone."
                  message={whatsappNotifications.clientMessage}
                  whatsappUrl={whatsappNotifications.clientUrl}
                  accent="client"
                />
              </div>
            )}

            <div className="bg-pink-50 border border-[#501d2c]/10 p-4 rounded-2xl">
              <p className="text-[11px] text-burgundy/75 font-sans font-medium">
                Please arrive 10 minutes prior to your scheduled time block. Ladies Only venue.
              </p>
            </div>

            {/* Barcode representation */}
            <div className="text-center pt-2">
              <div className="h-10 w-full bg-gradient-to-r from-pink-50 via-pink-400 to-pink-50 opacity-60 rounded flex items-center justify-center overflow-hidden mb-1">
                <div className="flex gap-0.5 h-full items-center justify-center opacity-70">
                  {[...Array(35)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-pink-900 h-full"
                      style={{ width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 1 : 2)}px` }}
                    />
                  ))}
                </div>
              </div>
              <span className="text-[8px] font-mono uppercase tracking-widest text-pink-900/40 font-bold">LUMIÈRE ONLINE SYSTEM RECEIPT</span>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3.5 rounded-xl font-sans text-xs uppercase font-extrabold tracking-widest text-center bg-pink-900 hover:bg-burgundy-light text-white shadow-sm transition-all cursor-pointer"
            >
              Book Another Session
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="appointment" className="py-20 bg-gradient-to-b from-[#fdf8f6] via-white to-[#fdf8f6] border-b border-pink-100/30 scroll-mt-141">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.25em] font-sans font-extrabold text-pink-600 mb-2">Reserve Your Privileged Slot</p>
          <h2 className="font-serif text-3xl sm:text-5xl font-black text-pink-900">
            Schedule Appointment
          </h2>
          <div className="w-16 h-1 bg-pink-200 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Complete Selection Summary Receipt */}
          <div className="lg:col-span-5 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-6 sm:p-8 space-y-6 lg:sticky lg:top-28 shadow-sm">
            <div className="flex items-center justify-between border-b border-pink-100/50 pb-3">
              <h3 className="font-serif text-md font-extrabold text-pink-900 uppercase tracking-wide flex items-center gap-2">
                <Scissors className="w-4.5 h-4.5 text-pink-600" />
                Selected services
              </h3>
              {selectedServices.length > 0 && (
                <button
                  onClick={onClearServices}
                  className="text-xs text-pink-400 hover:text-pink-600 font-sans font-bold transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {selectedServices.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 rounded-full border border-rose-pale flex items-center justify-center mx-auto text-pink-300">
                  <Scissors className="w-5 h-5 animate-pulse" />
                </div>
                <p className="font-sans text-xs text-burgundy/60 leading-relaxed font-semibold">
                  Your treatment list is empty. Go to the Services catalog above to pick the beauty routines you wish to reserve.
                </p>
                <a
                  href="#services"
                  className="inline-block text-xs font-black text-pink-700 uppercase tracking-widest hover:underline"
                >
                  Browse Services Catalogue
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {/* List items with quick scroll */}
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                  {selectedServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between bg-white/60 p-3 rounded-xl border border-rose-pale text-xs hover:border-pink-200"
                    >
                      <div className="space-y-0.5">
                        <p className="font-serif font-extrabold text-pink-900">{service.name}</p>
                        <p className="text-[10px] text-pink-900/60 flex items-center gap-1 font-semibold">
                          <Clock className="w-3 h-3 text-pink-400" /> {service.estimatedDuration}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-sans text-pink-900 font-bold">{formatPKR(service.pricePKR)}</span>
                        <button
                          onClick={() => onRemoveService(service)}
                          className="p-1 text-pink-400 hover:text-pink-700 hover:bg-pink-100 rounded transition-colors cursor-pointer"
                          title="Remove service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <VisitDurationSummary services={selectedServices} className="mt-2" />

                {/* Pricing summary details */}
                <div className="border-t border-pink-100/60 pt-4.5 space-y-2.5">
                  <div className="flex justify-between items-center text-xs text-pink-900/60 font-semibold">
                    <span>Selected Services Count:</span>
                    <span className="font-bold text-pink-900">{selectedServices.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-pink-900/60 font-semibold">
                    <span>Aesthetic Consultation:</span>
                    <span className="text-pink-700 font-bold uppercase tracking-wider text-[10px] bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full">Free</span>
                  </div>
                  {isReturningClient && selectedServices.length > 0 && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-bold text-green-800">
                          Welcome back! {REPEAT_CLIENT_DISCOUNT_PERCENT}% repeat client discount
                        </p>
                        <p className="text-[10px] text-green-700/80 mt-0.5">
                          Applied to clients with a previous confirmed visit.
                        </p>
                      </div>
                    </div>
                  )}
                  {pricing.discountAmount > 0 && (
                    <>
                      <div className="flex justify-between items-center text-xs text-pink-900/60 font-semibold">
                        <span>Subtotal:</span>
                        <span className="font-bold text-pink-900">{formatPKR(pricing.subtotalPrice)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-green-700 font-semibold">
                        <span>Loyalty discount ({pricing.discountPercent}%):</span>
                        <span>-{formatPKR(pricing.discountAmount)}</span>
                      </div>
                    </>
                  )}
                  <div className="border-t border-pink-100/60 pt-3 flex justify-between items-center">
                    <span className="font-serif text-sm font-bold text-pink-900 uppercase tracking-wider">Est. Final Total</span>
                    <span className="font-sans text-xl font-extrabold text-pink-900">{formatPKR(pricing.totalPrice)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Input Reservation Details */}
          <div className="lg:col-span-7 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-serif text-lg font-extrabold text-pink-900 border-b border-pink-100/50 pb-3 mb-6 uppercase tracking-wide">
              Fill Reservation Form
            </h3>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs uppercase tracking-widest text-pink-900/70 font-bold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-pink-500" />
                    Full Name <span className="text-pink-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="Your beautiful name..."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white/70 text-pink-900 placeholder-pink-200 py-3.5 px-4 rounded-xl border border-pink-100 focus:border-pink-500 outline-none font-sans text-sm transition-all focus:ring-0 shadow-sm"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs uppercase tracking-widest text-pink-900/70 font-bold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-pink-500" />
                    Phone Number <span className="text-pink-600">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    placeholder="e.g. 0300 1234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-white/70 text-pink-900 placeholder-pink-200 py-3.5 px-4 rounded-xl border border-pink-100 focus:border-pink-500 outline-none font-sans text-sm transition-all focus:ring-0 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Date */}
                <div className="space-y-2">
                  <label htmlFor="date" className="text-xs uppercase tracking-widest text-pink-900/70 font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-pink-500" />
                    Preferred Date <span className="text-pink-600">*</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    required
                    min={today}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-white/70 text-pink-900 py-3.5 px-4 rounded-xl border border-pink-100 focus:border-pink-500 outline-none font-sans text-sm transition-all focus:ring-0 shadow-sm cursor-pointer"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs uppercase tracking-widest text-pink-900/70 font-bold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-pink-500" />
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="e.g. client@gmail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-white/70 text-pink-900 placeholder-pink-200 py-3.5 px-4 rounded-xl border border-pink-100 focus:border-pink-500 outline-none font-sans text-sm transition-all focus:ring-0 shadow-sm"
                  />
                </div>
              </div>

              {/* Preferred Time block selection */}
              <div className="space-y-2.5">
                <label className="text-xs uppercase tracking-widest text-pink-900/70 font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-pink-500" />
                  Select Hour block <span className="text-pink-600">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {timeSlots.map((slot) => {
                    const isSelected = preferredTime === slot;
                    const isBooked = bookedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setPreferredTime(slot)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold font-sans tracking-wide border text-center transition-all ${
                          isBooked
                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed line-through'
                            : isSelected
                              ? 'bg-pink-900 border-pink-900 text-white shadow-sm cursor-pointer'
                              : 'bg-white/60 border-pink-100 text-pink-900 hover:border-pink-300 cursor-pointer'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special instructions */}
              <div className="space-y-2">
                <label htmlFor="notes" className="text-xs uppercase tracking-widest text-pink-900/70 font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-pink-500" />
                  Special Instructions (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="e.g. Skin sensitives, specific styling guidelines, jewelry specifications..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white/70 text-pink-900 placeholder-pink-200 py-3.5 px-4 rounded-xl border border-pink-100 focus:border-pink-500 outline-none font-sans text-sm transition-all focus:ring-0 shadow-sm resize-none"
                />
              </div>

              {!isBookingReady && !submitError && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] text-amber-900 font-sans leading-relaxed">
                  <p className="font-bold uppercase tracking-wider text-[10px] mb-1.5">Before you book</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {bookingIssues.map((issue) => (
                      <li key={issue}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {submitError && (
                <p className="text-red-600 text-xs font-semibold text-center rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  {submitError}
                </p>
              )}

              <p className="text-[11px] text-pink-900/60 font-sans text-center leading-relaxed">
                After booking, QR codes and your message appear on this page — scan or open
                WhatsApp, then tap <strong>Send</strong> in each chat.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleBookingSubmit}
                  className="py-4.5 rounded-xl text-center font-sans uppercase font-extrabold tracking-widest text-xs border cursor-pointer transition-all bg-pink-900 hover:bg-burgundy-light text-white shadow-sm hover:shadow-md border-pink-900/10 disabled:opacity-60 disabled:cursor-wait"
                >
                  {isSubmitting ? 'Saving...' : 'Book Online'}
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleWhatsAppBooking}
                  className="py-4.5 rounded-xl text-center font-sans uppercase font-extrabold tracking-widest text-xs border cursor-pointer transition-all flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white shadow-sm hover:shadow-md border-green-600/10 disabled:opacity-60 disabled:cursor-wait"
                >
                  <MessageCircle className="w-4 h-4" />
                  {isSubmitting ? 'Saving...' : 'Book via WhatsApp'}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
