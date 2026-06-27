import { Router } from 'express';
import { requireAuth } from '../middleware/auth.ts';
import {
  getPublicConfig,
  getBookings,
  insertBooking,
  patchBookingStatus,
  findServiceById,
  getBookedSlotsForDate,
  createBookingId,
} from '../store/index.ts';
import type { AppointmentBooking } from '../../src/types.ts';

const router = Router();

router.get('/availability', async (req, res, next) => {
  try {
    const date = req.query.date as string;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ error: 'Valid date query param required (YYYY-MM-DD)' });
      return;
    }
    const config = await getPublicConfig();
    const bookedSlots = await getBookedSlotsForDate(date);
    const availableSlots = config.timeSlots.filter((slot) => !bookedSlots.includes(slot));
    res.json({ date, availableSlots, bookedSlots });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
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

    const config = await getPublicConfig();
    if (!config.timeSlots.includes(preferredTime)) {
      res.status(400).json({ error: 'Invalid time slot' });
      return;
    }

    const bookedSlots = await getBookedSlotsForDate(preferredDate);
    if (bookedSlots.includes(preferredTime)) {
      res.status(409).json({ error: 'This time slot is already booked' });
      return;
    }

    const selectedServices = [];
    for (const id of serviceIds) {
      const found = await findServiceById(id);
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

    const saved = await insertBooking(booking);
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const date = req.query.date as string | undefined;
    const status = req.query.status as string | undefined;
    const bookings = await getBookings({ date, status });
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status?: AppointmentBooking['status'] };

    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      res.status(400).json({ error: 'Valid status required: pending, confirmed, or cancelled' });
      return;
    }

    const updated = await patchBookingStatus(id, status);
    if (!updated) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

export default router;
