/**
 * WA Blast Service
 * Handles WhatsApp messaging via WA Blast API v1
 * Supports text, image, and document messages
 */

const WA_BLAST_API_URL = process.env.WA_BLAST_API_URL || '';
const WA_BLAST_SESSION_ID = process.env.WA_BLAST_SESSION_ID || '';
const WA_BLAST_TOKEN = process.env.WA_BLAST_TOKEN || '';

export interface SendMessageResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

interface TextMessage {
    recipient_type: 'individual';
    to: string;
    type: 'text';
    text: { body: string };
}

interface DocumentMessage {
    recipient_type: 'individual';
    to: string;
    type: 'document';
    document: {
        link: string;
        mimetype: string;
        filename: string;
    };
}

interface ImageMessage {
    recipient_type: 'individual';
    to: string;
    type: 'image';
    image: {
        link: string;
        caption?: string;
    };
}

type WAMessage = TextMessage | DocumentMessage | ImageMessage;

class WABlastService {
    isConfigured(): boolean {
        return !!(WA_BLAST_API_URL && WA_BLAST_SESSION_ID && WA_BLAST_TOKEN);
    }

    private formatPhoneNumber(phone: string): string {
        let cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.substring(1);
        }
        if (!cleaned.startsWith('62')) {
            cleaned = '62' + cleaned;
        }
        return cleaned;
    }

    /**
     * Send a single text message
     */
    async sendMessage(to: string, body: string): Promise<SendMessageResult> {
        if (!this.isConfigured()) {
            console.warn('[WABlast] Not configured, skipping message');
            return { success: false, error: 'WA Blast not configured' };
        }

        try {
            const formattedPhone = this.formatPhoneNumber(to);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const response = await fetch(
                `${WA_BLAST_API_URL}/messages?sessionId=${WA_BLAST_SESSION_ID}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${WA_BLAST_TOKEN}`,
                    },
                    body: JSON.stringify({
                        to: formattedPhone,
                        type: 'text',
                        text: { body },
                    }),
                    signal: controller.signal,
                }
            );

            clearTimeout(timeoutId);
            const result = await response.json() as any;
            const data = Array.isArray(result) ? result[0] : result;

            if (data?.status === 'success') {
                console.log(`[WABlast] Message sent to ${formattedPhone}`);
                return { success: true, messageId: data.messageId };
            } else {
                console.error(`[WABlast] Failed:`, data?.message || result);
                return { success: false, error: data?.message || 'Unknown error' };
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                return { success: false, error: 'Request timeout' };
            }
            console.error(`[WABlast] Error:`, error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send multiple messages (text + document + image) as a batch to the same recipient.
     * The WA Blast API accepts an array of message objects.
     */
    async sendBatchMessages(messages: WAMessage[]): Promise<SendMessageResult> {
        if (!this.isConfigured()) {
            console.warn('[WABlast] Not configured, skipping batch message');
            return { success: false, error: 'WA Blast not configured' };
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000);

            const response = await fetch(
                `${WA_BLAST_API_URL}/messages?sessionId=${WA_BLAST_SESSION_ID}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${WA_BLAST_TOKEN}`,
                    },
                    body: JSON.stringify(messages),
                    signal: controller.signal,
                }
            );

            clearTimeout(timeoutId);
            const result = await response.json() as any;

            // Check if all messages were sent successfully
            if (Array.isArray(result)) {
                const allSuccess = result.every((r: any) => r.status === 'success');
                if (allSuccess) {
                    console.log(`[WABlast] Batch of ${messages.length} messages sent successfully`);
                    return { success: true };
                } else {
                    const failedCount = result.filter((r: any) => r.status !== 'success').length;
                    console.error(`[WABlast] Batch partially failed: ${failedCount}/${messages.length} failed`);
                    return { success: false, error: `${failedCount} message(s) failed to send` };
                }
            }

            // Single response
            if (result?.status === 'success') {
                console.log(`[WABlast] Batch messages sent`);
                return { success: true, messageId: result.messageId };
            } else {
                console.error(`[WABlast] Batch failed:`, result?.message || result);
                return { success: false, error: result?.message || 'Unknown error' };
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                return { success: false, error: 'Request timeout' };
            }
            console.error(`[WABlast] Batch error:`, error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send a text message + PDF document to a recipient.
     * Sends as two separate API calls to ensure both are delivered.
     */
    async sendTextWithDocument(
        to: string,
        textBody: string,
        documentUrl: string,
        documentFilename: string,
    ): Promise<SendMessageResult> {
        const formattedPhone = this.formatPhoneNumber(to);

        // Step 1: Send text message
        console.log(`[WABlast] Sending text message to ${formattedPhone}...`);
        const textResult = await this.sendMessage(to, textBody);
        if (!textResult.success) {
            console.error(`[WABlast] Text message failed: ${textResult.error}`);
            return textResult;
        }

        // Small delay between messages
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Step 2: Send document
        console.log(`[WABlast] Sending document to ${formattedPhone}: ${documentUrl}`);
        const docResult = await this.sendDocument(to, documentUrl, documentFilename);
        if (!docResult.success) {
            console.error(`[WABlast] Document send failed: ${docResult.error}`);
            // Text was sent successfully, return partial success
            return { success: true, error: `Text sent, but document failed: ${docResult.error}` };
        }

        console.log(`[WABlast] Text + document sent successfully to ${formattedPhone}`);
        return { success: true };
    }

    /**
     * Send a document (PDF) to a recipient
     */
    async sendDocument(
        to: string,
        documentUrl: string,
        filename: string,
        mimetype: string = 'application/pdf',
    ): Promise<SendMessageResult> {
        if (!this.isConfigured()) {
            console.warn('[WABlast] Not configured, skipping document');
            return { success: false, error: 'WA Blast not configured' };
        }

        try {
            const formattedPhone = this.formatPhoneNumber(to);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const payload = {
                recipient_type: 'individual',
                to: formattedPhone,
                type: 'document',
                document: {
                    link: documentUrl,
                    mimetype,
                    filename,
                },
            };

            console.log(`[WABlast] Document payload:`, JSON.stringify(payload, null, 2));

            const response = await fetch(
                `${WA_BLAST_API_URL}/messages?sessionId=${WA_BLAST_SESSION_ID}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${WA_BLAST_TOKEN}`,
                    },
                    body: JSON.stringify(payload),
                    signal: controller.signal,
                }
            );

            clearTimeout(timeoutId);
            const result = await response.json() as any;
            const data = Array.isArray(result) ? result[0] : result;

            console.log(`[WABlast] Document response:`, JSON.stringify(data));

            if (data?.status === 'success') {
                console.log(`[WABlast] Document sent to ${formattedPhone}`);
                return { success: true, messageId: data.messageId };
            } else {
                console.error(`[WABlast] Document failed:`, data?.message || result);
                return { success: false, error: data?.message || 'Unknown error' };
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                return { success: false, error: 'Request timeout' };
            }
            console.error(`[WABlast] Document error:`, error.message);
            return { success: false, error: error.message };
        }
    }

    async getSessionStatus(): Promise<{ connected: boolean; status: string; detail?: string }> {
        if (!WA_BLAST_API_URL || !WA_BLAST_SESSION_ID) {
            return { connected: false, status: 'NOT_CONFIGURED' };
        }

        try {
            const response = await fetch(
                `${WA_BLAST_API_URL}/sessions/${WA_BLAST_SESSION_ID}/status`,
                {
                    headers: { 'Authorization': `Bearer ${WA_BLAST_TOKEN}` },
                }
            );

            const result = await response.json() as any;

            if (result.status === 'error') {
                return { connected: false, status: 'ERROR', detail: result.message };
            }

            const data = result.data || result;
            const sessionStatus = data.status || 'UNKNOWN';
            const isConnected = data.isConnected === true || sessionStatus === 'CONNECTED';

            return {
                connected: isConnected,
                status: sessionStatus,
                detail: isConnected ? 'Session connected' : 'Scan QR code to connect',
            };
        } catch (error: any) {
            return { connected: false, status: 'ERROR', detail: error.message };
        }
    }
}

export const waBlastService = new WABlastService();

