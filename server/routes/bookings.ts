import { Router } from 'express';
import { requireAuth } from '../middleware/auth.ts';
import {
  getPublicConfig,
  getBookings,
  saveBookings,
  findServiceById,
  getBookedSlotsForDate,
  createBookingId,
} from '../store/index.ts';
import type { AppointmentBooking } from '../../src/types.ts';

const router = Router();

router.get('/availability', (req, res) => {
  const date = req.query.date as string;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: 'Valid date query param required (YYYY-MM-DD)' });
    return;
  }
  const config = getPublicConfig();
  const bookedSlots = getBookedSlotsForDate(date);
  const availableSlots = config.timeSlots.filter((slot) => !bookedSlots.includes(slot));
  res.json({ date, availableSlots, bookedSlots });
});

router.post('/', (req, res) => {
  const {
    customerName,
    customerPhone,
    customerEmail,
    preferredDate,
    preferredTime,
    serviceIds,
    notes,
  } = req.body as {
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    preferredDate?: string;
    preferredTime?: string;
    serviceIds?: string[];
    notes?: string;
  };

  if (!customerName?.trim() || !customerPhone?.trim() || !preferredDate || !preferredTime) {
    res.status(400).json({ error: 'Name, phone, date, and time are required' });
    return;
  }
  if (!serviceIds?.length) {
    res.status(400).json({ error: 'At least one service is required' });
    return;
  }

  const config = getPublicConfig();
  if (!config.timeSlots.includes(preferredTime)) {
    res.status(400).json({ error: 'Invalid time slot' });
    return;
  }

  const bookedSlots = getBookedSlotsForDate(preferredDate);
  if (bookedSlots.includes(preferredTime)) {
    res.status(409).json({ error: 'This time slot is already booked' });
    return;
  }

  const selectedServices = [];
  for (const id of serviceIds) {
    const found = findServiceById(id);
    if (!found) {
      res.status(400).json({ error: `Unknown service: ${id}` });
      return;
    }
    selectedServices.push(found.service);
  }

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.pricePKR, 0);

  const booking: AppointmentBooking = {
    id: createBookingId(),
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
    customerEmail: customerEmail?.trim() || '',
    preferredDate,
    preferredTime,
    selectedServices,
    totalPrice,
    status: 'pending',
    notes: notes?.trim(),
  };

  const bookings = getBookings();
  bookings.push(booking);
  saveBookings(bookings);

  res.status(201).json(booking);
});

router.get('/', requireAuth, (req, res) => {
  let bookings = getBookings();
  const date = req.query.date as string | undefined;
  const status = req.query.status as string | undefined;

  if (date) bookings = bookings.filter((b) => b.preferredDate === date);
  if (status) bookings = bookings.filter((b) => b.status === status);

  bookings.sort((a, b) => {
    const dateCompare = b.preferredDate.localeCompare(a.preferredDate);
    if (dateCompare !== 0) return dateCompare;
    return b.id.localeCompare(a.id);
  });

  res.json({ bookings });
});

router.patch('/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body as { status?: AppointmentBooking['status'] };

  if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
    res.status(400).json({ error: 'Valid status required: pending, confirmed, or cancelled' });
    return;
  }

  const bookings = getBookings();
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  bookings[index] = { ...bookings[index], status };
  saveBookings(bookings);
  res.json(bookings[index]);
});

export default router;
