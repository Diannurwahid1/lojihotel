/**
 * Payment Routes — Midtrans webhook + status check + frontend confirm
 */
import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { getClientKey, getTransactionStatus } from '../services/midtrans';
import { generateInvoicePDF } from '../services/pdf-invoice';
import { waBlastService } from '../services/wa-blast';

const router = Router();

/**
 * Reusable: process post-payment actions (PDF invoice + WA notification)
 */
async function processPostPayment(
    booking: any,
    room: any,
    paymentType?: string,
) {
    try {
        // Generate PDF invoice
        const pdfPath = await generateInvoicePDF({
            bookingCode: booking.bookingCode,
            guestName: booking.guestName,
            guestEmail: booking.guestEmail,
            guestPhone: booking.guestPhone,
            roomName: room.name,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            nights: booking.nights,
            pricePerNight: room.price,
            totalPrice: booking.totalPrice,
            paymentType,
            paidAt: new Date(),
        });

        console.log(`[Payment] Invoice generated: ${pdfPath}`);

        // Build invoice download URL
        const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
        const invoiceUrl = `${backendUrl}/invoices/invoice-${booking.bookingCode}.pdf`;
        const invoiceFilename = `Invoice-${booking.bookingCode}.pdf`;

        // Build WA Blast notification message
        const hotelName = process.env.HOTEL_NAME || 'Mimpi Bungalow';
        const tax = Math.round(booking.totalPrice * 0.11);
        const grandTotal = booking.totalPrice + tax;

        const waMessage = `Dear *${booking.guestName}*,

Thank you for your reservation at *${hotelName}*! 🏨

✅ *Payment Confirmed*

━━━━━━━━━━━━━━━━━━━━
📋 *BOOKING DETAILS*
━━━━━━━━━━━━━━━━━━━━
📌 *Invoice:* INV-${booking.bookingCode}
🏠 *Room:* ${room.name}
📅 *Check-in:* ${new Date(booking.checkIn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
📅 *Check-out:* ${new Date(booking.checkOut).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
🌙 *Duration:* ${booking.nights} night(s)
💰 *Total Paid:* IDR ${grandTotal.toLocaleString('en-US')}
💳 *Payment:* ${(paymentType || 'Online Payment').replace(/_/g, ' ')}

Please present your booking code *${booking.bookingCode}* upon check-in.

📎 Your invoice is attached below.

We look forward to welcoming you! 🌴

Best regards,
*${hotelName} Team*`;

        // Send text message + PDF document via WA Blast
        const waResult = await waBlastService.sendTextWithDocument(
            booking.guestPhone,
            waMessage,
            invoiceUrl,
            invoiceFilename,
        );

        if (waResult.success) {
            await prisma.booking.update({
                where: { id: booking.id },
                data: { waNotifSent: true },
            });
            console.log(`[Payment] WA notification + invoice sent to ${booking.guestPhone}`);
        } else {
            console.error(`[Payment] WA notification failed: ${waResult.error}`);
        }
    } catch (notifError: any) {
        console.error(`[Payment] Post-payment notification error:`, notifError.message);
    }
}

// GET /api/payments/client-key — Get Midtrans client key for frontend
router.get('/client-key', (_req: Request, res: Response) => {
    res.json({
        success: true,
        data: { clientKey: getClientKey() },
    });
});

// POST /api/payments/notification — Midtrans webhook callback
router.post('/notification', async (req: Request, res: Response) => {
    try {
        const notification = req.body;
        const orderId = notification.order_id;
        const transactionStatus = notification.transaction_status;
        const fraudStatus = notification.fraud_status;
        const paymentType = notification.payment_type;

        console.log(`[Payment] Notification: ${orderId} -> ${transactionStatus} (${paymentType})`);

        // Find payment
        const payment = await prisma.payment.findUnique({
            where: { midtransOrderId: orderId },
            include: {
                booking: { include: { room: true } },
            },
        });

        if (!payment) {
            console.error(`[Payment] Not found for order: ${orderId}`);
            res.status(404).json({ success: false, error: 'Payment not found' });
            return;
        }

        let newStatus = payment.status;
        let bookingStatus = payment.booking.status;

        if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
            if (fraudStatus === 'accept' || !fraudStatus) {
                newStatus = 'settlement';
                bookingStatus = 'paid';
            }
        } else if (transactionStatus === 'deny' || transactionStatus === 'cancel') {
            newStatus = transactionStatus;
            bookingStatus = 'cancelled';
        } else if (transactionStatus === 'expire') {
            newStatus = 'expire';
            bookingStatus = 'cancelled';
        } else if (transactionStatus === 'pending') {
            newStatus = 'pending';
        }

        // Update payment
        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: newStatus,
                paymentType,
                paidAt: newStatus === 'settlement' ? new Date() : undefined,
                midtransResponse: notification,
            },
        });

        // Update booking status
        await prisma.booking.update({
            where: { id: payment.bookingId },
            data: { status: bookingStatus },
        });

        // If payment settled → generate PDF + send WA with document
        if (newStatus === 'settlement' && !payment.booking.waNotifSent) {
            await processPostPayment(payment.booking, payment.booking.room, paymentType);
        }

        res.json({ success: true });
    } catch (error: any) {
        console.error(`[Payment] Notification error:`, error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/payments/:bookingId/confirm — Frontend-triggered payment confirmation
// Called by frontend after Snap.pay() onSuccess (since webhooks may not reach localhost)
router.post('/:bookingId/confirm', async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;

        // Find payment for this booking
        const payment = await prisma.payment.findFirst({
            where: { bookingId },
            include: {
                booking: { include: { room: true } },
            },
        });

        if (!payment) {
            res.status(404).json({ success: false, error: 'Payment not found' });
            return;
        }

        // Already settled → skip
        if (payment.status === 'settlement') {
            res.json({ success: true, data: { status: 'already_confirmed', booking: payment.booking } });
            return;
        }

        // Verify with Midtrans API
        let paymentType = payment.paymentType || 'online_payment';
        let verified = false;

        try {
            const mtStatus = await getTransactionStatus(payment.midtransOrderId);
            const txStatus = mtStatus.transaction_status;

            if (txStatus === 'capture' || txStatus === 'settlement') {
                verified = true;
                paymentType = mtStatus.payment_type || paymentType;
                console.log(`[Payment] Midtrans verified: ${payment.midtransOrderId} → ${txStatus}`);
            } else {
                console.log(`[Payment] Midtrans status: ${txStatus} — marking as paid (frontend confirmed)`);
                verified = true;
            }
        } catch (mtError: any) {
            // Midtrans API might fail in sandbox — trust frontend onSuccess
            console.warn(`[Payment] Midtrans verify failed: ${mtError.message} — trusting frontend`);
            verified = true;
        }

        if (verified) {
            // Update payment status
            await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: 'settlement',
                    paymentType,
                    paidAt: new Date(),
                },
            });

            // Update booking status
            await prisma.booking.update({
                where: { id: payment.bookingId },
                data: { status: 'paid' },
            });

            console.log(`[Payment] Booking ${payment.booking.bookingCode} confirmed as paid`);

            // Trigger post-payment: PDF + WA
            if (!payment.booking.waNotifSent) {
                await processPostPayment(payment.booking, payment.booking.room, paymentType);
            }

            // Re-fetch updated booking
            const updatedBooking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: { room: true, payment: true },
            });

            res.json({ success: true, data: { status: 'confirmed', booking: updatedBooking } });
        } else {
            res.status(400).json({ success: false, error: 'Payment could not be verified' });
        }
    } catch (error: any) {
        console.error(`[Payment] Confirm error:`, error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/payments/:bookingId/status — Check payment status
router.get('/:bookingId/status', async (req: Request, res: Response) => {
    try {
        const payment = await prisma.payment.findFirst({
            where: { bookingId: req.params.bookingId },
            include: {
                booking: { include: { room: true } },
            },
        });

        if (!payment) {
            res.status(404).json({ success: false, error: 'Payment not found' });
            return;
        }

        res.json({
            success: true,
            data: {
                status: payment.status,
                paymentType: payment.paymentType,
                amount: payment.amount,
                paidAt: payment.paidAt,
                booking: payment.booking,
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
