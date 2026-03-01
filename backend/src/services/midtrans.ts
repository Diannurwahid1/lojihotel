/**
 * Midtrans Service — Snap integration for payment
 */
import midtransClient from 'midtrans-client';

const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY || '',
    clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
});

export interface CreateTransactionParams {
    orderId: string;
    amount: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    itemName: string;
    itemQuantity: number;
    itemPrice: number;
}

export async function createSnapTransaction(params: CreateTransactionParams) {
    const parameter = {
        transaction_details: {
            order_id: params.orderId,
            gross_amount: params.amount,
        },
        item_details: [
            {
                id: 'room-booking',
                price: params.itemPrice,
                quantity: params.itemQuantity,
                name: params.itemName.substring(0, 50),
            },
        ],
        customer_details: {
            first_name: params.customerName,
            email: params.customerEmail,
            phone: params.customerPhone,
        },
        callbacks: {
            finish: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/booking/success`,
        },
    };

    const transaction = await snap.createTransaction(parameter);
    return {
        token: transaction.token,
        redirectUrl: transaction.redirect_url,
    };
}

export async function getTransactionStatus(orderId: string) {
    const apiClient = new midtransClient.CoreApi({
        isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
        serverKey: process.env.MIDTRANS_SERVER_KEY || '',
        clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
    });
    return apiClient.transaction.status(orderId);
}

export function getClientKey(): string {
    return process.env.MIDTRANS_CLIENT_KEY || '';
}
