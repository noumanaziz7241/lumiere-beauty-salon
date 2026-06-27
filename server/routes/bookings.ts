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
  hasConfirmedBookingForPhone,
  ADMIN_BOOKINGS_DAYS,
} from '../store/index.ts';
import type { AppointmentBooking, BookingCreateResponse } from '../../src/types.ts';
import {
  bookingToWhatsAppDetails,
  buildBookingNotificationUrls,
} from '../../shared/whatsappBooking.ts';
import {
  calculateBookingPrice,
  REPEAT_CLIENT_DISCOUNT_PERCENT,
} from '../../shared/bookingPricing.ts';
import { sendBookingCreatedEmails, sendBookingConfirmedEmail } from '../services/emailService.ts';

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

router.get('/returning-client', async (req, res, next) => {
  try {
    const phone = req.query.phone as string;
    if (!phone?.trim()) {
      res.status(400).json({ error: 'Phone query param required' });
      return;
    }

    const isReturningClient = await hasConfirmedBookingForPhone(phone);
    res.json({
      isReturningClient,
      discountPercent: isReturningClient ? REPEAT_CLIENT_DISCOUNT_PERCENT : 0,
    });
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

    const subtotal = selectedServices.reduce((sum, s) => sum + s.pricePKR, 0);
    const isReturningClient = await hasConfirmedBookingForPhone(customerPhone.trim());
    const pricing = calculateBookingPrice(subtotal, isReturningClient);

    const booking: AppointmentBooking = {
      id: createBookingId(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail?.trim() || '',
      preferredDate,
      preferredTime,
      selectedServices,
      subtotalPrice: pricing.subtotalPrice,
      discountPercent: pricing.discountPercent,
      discountAmount: pricing.discountAmount,
      totalPrice: pricing.totalPrice,
      isReturningClient: pricing.isReturningClient,
      status: 'pending',
      notes: notes?.trim(),
    };

    const saved = await insertBooking(booking);
    const whatsappNotifications = buildBookingNotificationUrls(
      config.contact.whatsapp,
      bookingToWhatsAppDetails(saved),
    );

    const response: BookingCreateResponse = {
      ...saved,
      whatsappNotifications,
    };

    void sendBookingCreatedEmails(saved, config).catch((err) =>
      console.error('[email] booking created:', err),
    );

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const date = req.query.date as string | undefined;
    const status = req.query.status as string | undefined;
    const daysBackParam = req.query.daysBack as string | undefined;
    const daysBack = daysBackParam ? parseInt(daysBackParam, 10) : ADMIN_BOOKINGS_DAYS;

    const bookings = await getBookings({
      date,
      status,
      daysBack: Number.isFinite(daysBack) && daysBack > 0 ? daysBack : ADMIN_BOOKINGS_DAYS,
    });
    res.json({ bookings, daysBack: daysBack || ADMIN_BOOKINGS_DAYS });
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

    if (status === 'confirmed') {
      const config = await getPublicConfig();
      void sendBookingConfirmedEmail(updated, config).catch((err) =>
        console.error('[email] booking confirmed:', err),
      );
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

export default router;
