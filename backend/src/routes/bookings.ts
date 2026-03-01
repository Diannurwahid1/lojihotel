/**
 * Booking Routes — 3-step booking flow
 */
import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { createSnapTransaction } from '../services/midtrans';

const router = Router();

function generateBookingCode(): string {
    const prefix = 'MBR';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

// GET /api/bookings — List all bookings (admin)
router.get('/', async (req: Request, res: Response) => {
    try {
        const { status, page = '1', limit = '20' } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const where: any = {};
        if (status && status !== 'all') {
            where.status = status;
        }

        const [bookings, total] = await Promise.all([
            prisma.booking.findMany({
                where,
                include: { room: true, payment: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit as string),
            }),
            prisma.booking.count({ where }),
        ]);

        res.json({
            success: true,
            data: bookings,
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total,
                totalPages: Math.ceil(total / parseInt(limit as string)),
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/bookings/stats — Dashboard stats
router.get('/stats', async (_req: Request, res: Response) => {
    try {
        const [totalBookings, pendingBookings, paidBookings, totalRevenue] = await Promise.all([
            prisma.booking.count(),
            prisma.booking.count({ where: { status: 'pending' } }),
            prisma.booking.count({ where: { status: 'paid' } }),
            prisma.booking.aggregate({
                where: { status: 'paid' },
                _sum: { totalPrice: true },
            }),
        ]);

        const todayBookings = await prisma.booking.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        });

        res.json({
            success: true,
            data: {
                totalBookings,
                pendingBookings,
                paidBookings,
                todayBookings,
                totalRevenue: totalRevenue._sum.totalPrice || 0,
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/bookings/:id — Booking detail
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: req.params.id },
            include: { room: true, payment: true },
        });
        if (!booking) {
            res.status(404).json({ success: false, error: 'Booking not found' });
            return;
        }
        res.json({ success: true, data: booking });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/bookings — Create booking + Snap token (Step 2 → 3 transition)
router.post('/', async (req: Request, res: Response) => {
    try {
        const {
            roomId,
            guestName,
            guestEmail,
            guestPhone,
            checkIn,
            checkOut,
            guests,
            notes,
        } = req.body;

        // Validate required fields
        if (!roomId || !guestName || !guestEmail || !guestPhone || !checkIn || !checkOut) {
            res.status(400).json({
                success: false,
                error: 'Missing required fields: roomId, guestName, guestEmail, guestPhone, checkIn, checkOut',
            });
            return;
        }

        // Get room
        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room) {
            res.status(404).json({ success: false, error: 'Room not found' });
            return;
        }

        // Calculate nights
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

        if (nights < 1) {
            res.status(400).json({ success: false, error: 'Check-out must be after check-in' });
            return;
        }

        const totalPrice = room.price * nights;
        const bookingCode = generateBookingCode();
        const midtransOrderId = `ORDER-${bookingCode}-${Date.now()}`;

        // Create booking
        const booking = await prisma.booking.create({
            data: {
                bookingCode,
                roomId,
                guestName,
                guestEmail,
                guestPhone,
                checkIn: checkInDate,
                checkOut: checkOutDate,
                nights,
                guests: guests || 1,
                totalPrice,
                notes,
            },
            include: { room: true },
        });

        // Create payment record
        const payment = await prisma.payment.create({
            data: {
                bookingId: booking.id,
                midtransOrderId,
                amount: totalPrice,
            },
        });

        // Create Midtrans Snap token
        const snap = await createSnapTransaction({
            orderId: midtransOrderId,
            amount: totalPrice,
            customerName: guestName,
            customerEmail: guestEmail,
            customerPhone: guestPhone,
            itemName: `${room.name} - ${nights} night(s)`,
            itemQuantity: nights,
            itemPrice: room.price,
        });

        // Update payment with snap token
        await prisma.payment.update({
            where: { id: payment.id },
            data: { snapToken: snap.token },
        });

        res.status(201).json({
            success: true,
            data: {
                booking: {
                    ...booking,
                    payment: {
                        ...payment,
                        snapToken: snap.token,
                    },
                },
                snapToken: snap.token,
                redirectUrl: snap.redirectUrl,
            },
        });
    } catch (error: any) {
        console.error('[Booking] Create error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// PATCH /api/bookings/:id/status — Update booking status (admin)
router.patch('/:id/status', async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'paid', 'cancelled', 'checked_in', 'checked_out'];

        if (!validStatuses.includes(status)) {
            res.status(400).json({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
            return;
        }

        const booking = await prisma.booking.update({
            where: { id: req.params.id },
            data: { status },
            include: { room: true, payment: true },
        });

        res.json({ success: true, data: booking });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
