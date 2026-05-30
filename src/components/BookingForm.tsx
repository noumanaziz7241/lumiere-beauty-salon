import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, FileText, CheckCircle, Ticket, Trash2, Scissors, MapPin } from 'lucide-react';
import { Service, AppointmentBooking } from '../types';

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
  // Booking Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<AppointmentBooking | null>(null);

  // Time slots for booking
  const timeSlots = [
    '10:30 AM', '11:30 AM', '12:30 PM', '01:30 PM', '02:30 PM', 
    '03:30 PM', '04:30 PM', '05:30 PM', '06:30 PM', '07:30 PM'
  ];

  const totalAmount = selectedServices.reduce((sum, item) => sum + item.pricePKR, 0);

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !preferredDate || !preferredTime) {
      alert('Please fill out all required fields: Name, Phone, Date, and Time.');
      return;
    }
    if (selectedServices.length === 0) {
      alert('Please select at least one beauty service first.');
      return;
    }

    setIsSubmitting(true);

    // Simulate reliable API/Server delay
    setTimeout(() => {
      const referenceId = 'KM-' + Math.floor(100000 + Math.random() * 900000);
      const newBooking: AppointmentBooking = {
        id: referenceId,
        customerName,
        customerPhone,
        customerEmail,
        preferredDate,
        preferredTime,
        selectedServices: [...selectedServices],
        totalPrice: totalAmount,
        status: 'confirmed',
        notes,
      };

      setConfirmedBooking(newBooking);
      setIsSubmitting(false);
      onBookingSuccess();
    }, 1500);
  };

  const handleReset = () => {
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setPreferredDate('');
    setPreferredTime('');
    setNotes('');
    setConfirmedBooking(null);
    onClearServices();
  };

  // If appointment booking is confirmed, render the luxury Ticket checkout receipt
  if (confirmedBooking) {
    return (
      <section id="appointment" className="py-20 bg-gradient-to-b from-[#fdf8f6] via-white to-[#fdf8f6] flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-xl bg-white/60 border border-white/80 rounded-3xl overflow-hidden shadow-xl backdrop-blur-xl relative animate-fadeIn duration-500">
          
          {/* Ticket Header Graphic Accent */}
          <div className="bg-[#501d2c] p-6 text-center relative">
            <div className="absolute top-4 right-4 text-pink-900 bg-pink-100 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full">
              Confirmed
            </div>
            <Ticket className="w-10 h-10 text-pink-200 mx-auto mb-2 animate-bounce" />
            <h3 className="font-serif text-2xl font-black text-white leading-tight uppercase">KOMSL Appointment</h3>
            <p className="font-sans text-[11px] text-pink-200 uppercase tracking-widest mt-1">Ladies Only Premium Privilege</p>
          </div>

          {/* Core Ticket Content Body */}
          <div className="p-6 sm:p-8 space-y-6 relative bg-white/30 backdrop-blur-lg">
            {/* Round notches on the side to look like a physical ticket stub */}
            <div className="absolute top-0 left-[-12px] w-6 h-6 rounded-full bg-[#fdf8f6] border-r border-pink-100" />
            <div className="absolute top-0 right-[-12px] w-6 h-6 rounded-full bg-[#fdf8f6] border-l border-pink-100" />

            <div className="text-center">
              <span className="text-xs font-sans text-pink-900/60 uppercase tracking-widest font-semibold">Appointment ID Reference</span>
              <p className="font-sans text-2xl font-black text-pink-905 tracking-wider mt-0.5">{confirmedBooking.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-b border-pink-100/50 py-4.5">
              <div>
                <span className="text-[10px] font-sans text-pink-900/50 uppercase tracking-widest block">Client Name</span>
                <span className="font-serif text-sm font-bold text-pink-900">{confirmedBooking.customerName}</span>
              </div>
              <div>
                <span className="text-[10px] font-sans text-pink-900/50 uppercase tracking-widest block">Phone Number</span>
                <span className="font-mono text-sm text-pink-955 font-semibold">{confirmedBooking.customerPhone}</span>
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
                    <span className="font-sans text-pink-850 font-bold">{formatPKR(srv.pricePKR)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="bg-white/70 p-4.5 rounded-2xl border border-pink-200 flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-pink-900/60 font-bold">Total Service Fee</span>
              <span className="font-sans text-xl font-extrabold text-pink-900">{formatPKR(confirmedBooking.totalPrice)}</span>
            </div>

            {/* Venue Address info */}
            <div className="bg-pink-50 border border-[#501d2c]/10 p-4 rounded-2xl flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-pink-900 uppercase tracking-wide">KOMSL Salon Venue</p>
                <p className="text-[11px] text-pink-955/75 mt-1 font-sans font-medium">
                  365 Rachna Block, Iqbal Town, Lahore, Pakistan
                </p>
                <p className="text-[10px] text-pink-600 font-sans italic mt-1.5 font-semibold">
                  *Please arrive 10 minutes prior to your time block. Ladies Only venue.
                </p>
              </div>
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
              <span className="text-[8px] font-mono uppercase tracking-widest text-pink-900/40 font-bold">KOMSL ONLINE SYSTEM RECEIPT</span>
            </div>

            {/* reset button */}
            <button
              onClick={handleReset}
              className="w-full py-3.5 rounded-xl font-sans text-xs uppercase font-extrabold tracking-widest text-center bg-pink-900 hover:bg-pink-850 text-white shadow-sm transition-all cursor-pointer"
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
                <div className="w-12 h-12 rounded-full border border-pink-150 flex items-center justify-center mx-auto text-pink-300">
                  <Scissors className="w-5 h-5 animate-pulse" />
                </div>
                <p className="font-sans text-xs text-pink-955/60 leading-relaxed font-semibold">
                  Your treatment list is empty. Go to the **Services catalog** above to pick the beauty routines you wish to reserve.
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
                      className="flex items-center justify-between bg-white/60 p-3 rounded-xl border border-pink-105 text-xs hover:border-pink-200"
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
                  <div className="border-t border-pink-100/60 pt-3 flex justify-between items-center">
                    <span className="font-serif text-sm font-bold text-pink-900 uppercase tracking-wider">Est. Final Total</span>
                    <span className="font-sans text-xl font-extrabold text-pink-900">{formatPKR(totalAmount)}</span>
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

            <form onSubmit={handleBookingSubmit} className="space-y-6">
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
                    placeholder="e.g. 0321 469 6272"
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
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setPreferredTime(slot)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold font-sans tracking-wide border cursor-pointer text-center transition-all ${
                          isSelected
                            ? 'bg-pink-900 border-pink-900 text-white shadow-sm'
                            : 'bg-white/60 border-pink-100 text-pink-900 hover:border-pink-300'
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

              {/* Big booking Submit */}
              <button
                type="submit"
                disabled={isSubmitting || selectedServices.length === 0}
                className={`w-full py-4.5 rounded-xl text-center font-sans uppercase font-extrabold tracking-widest text-xs border cursor-pointer transition-all ${
                  selectedServices.length === 0
                    ? 'bg-pink-50 text-pink-300 border-pink-100 cursor-not-allowed'
                    : 'bg-pink-900 hover:bg-pink-850 text-white shadow-sm hover:shadow-md border-pink-900/10'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Filing Appt Record...
                  </span>
                ) : (
                  'File Appointment Slot'
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
