/**
 * PDF Invoice Service
 * Generates professional PDF invoices for hotel bookings
 * International standard format with logo
 */
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

interface InvoiceData {
    bookingCode: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    roomName: string;
    checkIn: Date;
    checkOut: Date;
    nights: number;
    pricePerNight: number;
    totalPrice: number;
    paymentType?: string;
    paidAt?: Date;
}

function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function formatDateShort(date: Date): string {
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatCurrency(amount: number): string {
    return `IDR ${amount.toLocaleString('en-US')}`;
}

export async function generateInvoicePDF(data: InvoiceData): Promise<string> {
    const invoicesDir = path.join(process.cwd(), 'invoices');
    if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const filename = `invoice-${data.bookingCode}.pdf`;
    const filepath = path.join(invoicesDir, filename);

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50,
            info: {
                Title: `Invoice INV-${data.bookingCode}`,
                Author: process.env.HOTEL_NAME || 'Mimpi Bungalow',
                Subject: 'Booking Invoice',
            },
        });

        const writeStream = fs.createWriteStream(filepath);
        doc.pipe(writeStream);

        const hotelName = process.env.HOTEL_NAME || 'Mimpi Bungalow';
        const hotelAddress = process.env.HOTEL_ADDRESS || 'Jl. Pantai Berawa No. 88, Canggu, Bali 80361, Indonesia';
        const hotelPhone = process.env.HOTEL_PHONE || '+62 361 847 6888';
        const hotelEmail = process.env.HOTEL_EMAIL || 'reservations@mimpibungalow.com';
        const hotelWebsite = process.env.HOTEL_WEBSITE || 'www.mimpibungalow.com';

        // ── Header Background ──
        doc.rect(0, 0, doc.page.width, 130).fill('#0EA5E9');

        // ── Logo ──
        const logoPath = path.join(process.cwd(), 'assets', 'logo.png');
        if (fs.existsSync(logoPath)) {
            try {
                doc.image(logoPath, 50, 20, { width: 90, height: 90 });
            } catch (e) {
                // Fallback: text-only if logo fails
                console.warn('[Invoice] Logo load failed, using text fallback');
            }
        }

        // Hotel name & details
        const headerTextX = fs.existsSync(logoPath) ? 155 : 50;
        doc.fillColor('#FFFFFF')
            .fontSize(24)
            .font('Helvetica-Bold')
            .text(hotelName.toUpperCase(), headerTextX, 30);

        doc.fontSize(9)
            .font('Helvetica')
            .text(hotelAddress, headerTextX, 60)
            .text(`Tel: ${hotelPhone}  |  Email: ${hotelEmail}`, headerTextX, 75)
            .text(hotelWebsite, headerTextX, 90);

        // Invoice label (top-right)
        doc.fontSize(22)
            .font('Helvetica-Bold')
            .fillColor('#FFFFFF')
            .text('INVOICE', 0, 35, { width: doc.page.width - 50, align: 'right' });

        doc.fontSize(10)
            .font('Helvetica')
            .fillColor('#E0F2FE')
            .text(`INV-${data.bookingCode}`, 0, 63, { width: doc.page.width - 50, align: 'right' });

        // ── Invoice Meta Info ──
        let y = 150;
        const invoiceDate = data.paidAt ? formatDateShort(data.paidAt) : formatDateShort(new Date());

        doc.fillColor('#64748B')
            .fontSize(8)
            .font('Helvetica-Bold')
            .text('INVOICE DATE', 350, y)
            .text('INVOICE NO.', 350, y + 25)
            .text('BOOKING CODE', 350, y + 50);

        doc.fillColor('#1E293B')
            .fontSize(9)
            .font('Helvetica')
            .text(invoiceDate, 450, y)
            .text(`INV-${data.bookingCode}`, 450, y + 25)
            .text(data.bookingCode, 450, y + 50);

        // ── Bill To ──
        doc.fillColor('#0EA5E9')
            .fontSize(9)
            .font('Helvetica-Bold')
            .text('BILL TO', 50, y);

        y += 18;
        doc.fillColor('#1E293B')
            .fontSize(11)
            .font('Helvetica-Bold')
            .text(data.guestName, 50, y);

        y += 16;
        doc.fontSize(9)
            .font('Helvetica')
            .fillColor('#64748B')
            .text(data.guestEmail, 50, y)
            .text(data.guestPhone, 50, y + 14);

        // ── Booking Details Section ──
        y = 255;
        doc.rect(50, y, 500, 28).fill('#F0F9FF');
        doc.fillColor('#0EA5E9')
            .fontSize(9)
            .font('Helvetica-Bold')
            .text('RESERVATION DETAILS', 60, y + 9);

        y += 38;
        const col1X = 60;
        const col2X = 180;
        const col3X = 310;
        const col4X = 430;

        doc.fillColor('#64748B').fontSize(8).font('Helvetica-Bold');
        doc.text('CHECK-IN', col1X, y);
        doc.text('CHECK-OUT', col2X, y);
        doc.text('DURATION', col3X, y);
        doc.text('GUESTS', col4X, y);

        y += 15;
        doc.fillColor('#1E293B').fontSize(9).font('Helvetica');
        doc.text(formatDateShort(data.checkIn), col1X, y);
        doc.text(formatDateShort(data.checkOut), col2X, y);
        doc.text(`${data.nights} night${data.nights > 1 ? 's' : ''}`, col3X, y);
        doc.text('2 Adults', col4X, y);

        // ── Line Items Table ──
        y = 340;
        // Table header
        doc.rect(50, y, 500, 30).fill('#0EA5E9');
        doc.fillColor('#FFFFFF')
            .fontSize(8)
            .font('Helvetica-Bold')
            .text('DESCRIPTION', 65, y + 10)
            .text('QTY', 300, y + 10, { width: 50, align: 'center' })
            .text('UNIT PRICE', 355, y + 10, { width: 90, align: 'right' })
            .text('AMOUNT', 455, y + 10, { width: 85, align: 'right' });

        // Table row (alternating)
        y += 30;
        doc.rect(50, y, 500, 30).fill('#F8FAFC');
        doc.fillColor('#1E293B')
            .fontSize(9)
            .font('Helvetica')
            .text(`${data.roomName} — Accommodation`, 65, y + 9)
            .text(String(data.nights), 300, y + 9, { width: 50, align: 'center' })
            .text(formatCurrency(data.pricePerNight), 340, y + 9, { width: 105, align: 'right' })
            .text(formatCurrency(data.totalPrice), 450, y + 9, { width: 90, align: 'right' });

        // ── Totals Section ──
        y += 50;
        const totalsX = 350;
        const totalsValX = 455;
        const totalsWidth = 85;

        // Subtotal
        doc.fillColor('#64748B')
            .fontSize(9)
            .font('Helvetica')
            .text('Subtotal', totalsX, y, { width: 95, align: 'right' })
            .fillColor('#1E293B')
            .text(formatCurrency(data.totalPrice), totalsValX, y, { width: totalsWidth, align: 'right' });

        // Tax (11%)
        const tax = Math.round(data.totalPrice * 0.11);
        y += 20;
        doc.fillColor('#64748B')
            .text('Tax (PPN 11%)', totalsX, y, { width: 95, align: 'right' })
            .fillColor('#1E293B')
            .text(formatCurrency(tax), totalsValX, y, { width: totalsWidth, align: 'right' });

        // Separator
        y += 18;
        doc.moveTo(totalsX, y).lineTo(540, y).strokeColor('#CBD5E1').lineWidth(0.5).stroke();

        // Grand Total
        const grandTotal = data.totalPrice + tax;
        y += 10;
        doc.rect(totalsX - 5, y - 3, 200, 32).fill('#0EA5E9');
        doc.fillColor('#FFFFFF')
            .fontSize(10)
            .font('Helvetica-Bold')
            .text('GRAND TOTAL', totalsX, y + 6, { width: 95, align: 'right' })
            .fontSize(12)
            .text(formatCurrency(grandTotal), totalsValX, y + 5, { width: totalsWidth, align: 'right' });

        // ── Payment Status ──
        y += 55;
        doc.fillColor('#1E293B')
            .fontSize(9)
            .font('Helvetica-Bold')
            .text('PAYMENT INFORMATION', 50, y);

        y += 18;

        // Status badge
        doc.roundedRect(50, y, 70, 22, 4).fill('#10B981');
        doc.fillColor('#FFFFFF')
            .fontSize(8)
            .font('Helvetica-Bold')
            .text('PAID', 50, y + 6, { width: 70, align: 'center' });

        // Payment details
        doc.fillColor('#64748B')
            .fontSize(9)
            .font('Helvetica');

        if (data.paymentType) {
            doc.text(`Method: ${data.paymentType.replace(/_/g, ' ').toUpperCase()}`, 135, y + 2);
        }
        if (data.paidAt) {
            doc.text(`Date: ${formatDate(data.paidAt)}`, 135, y + 16);
        }

        // ── Terms & Notes ──
        y += 55;
        doc.moveTo(50, y).lineTo(550, y).strokeColor('#E2E8F0').lineWidth(0.5).stroke();
        y += 12;

        doc.fillColor('#94A3B8')
            .fontSize(7)
            .font('Helvetica-Bold')
            .text('TERMS & CONDITIONS', 50, y);

        y += 12;
        doc.fillColor('#94A3B8')
            .fontSize(7)
            .font('Helvetica')
            .text('• Check-in time: 14:00 (2:00 PM) | Check-out time: 12:00 (12:00 PM)', 50, y)
            .text('• Please present this invoice or your booking code upon check-in.', 50, y + 11)
            .text('• Prices are in Indonesian Rupiah (IDR) and inclusive of applicable taxes.', 50, y + 22)
            .text('• This is a computer-generated invoice and does not require a signature.', 50, y + 33);

        // ── Footer ──
        y = 720;
        doc.moveTo(50, y).lineTo(550, y).strokeColor('#E2E8F0').lineWidth(0.5).stroke();
        y += 12;
        doc.fillColor('#94A3B8')
            .fontSize(8)
            .font('Helvetica')
            .text(`Thank you for choosing ${hotelName}! We look forward to welcoming you.`, 50, y, { width: 500, align: 'center' })
            .text(`${hotelAddress}  |  ${hotelPhone}  |  ${hotelEmail}`, 50, y + 14, { width: 500, align: 'center' });

        doc.end();

        writeStream.on('finish', () => resolve(filepath));
        writeStream.on('error', reject);
    });
}
