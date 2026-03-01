/**
 * WA Blast Routes — Status check and manual send
 */
import { Router, Request, Response } from 'express';
import { waBlastService } from '../services/wa-blast';

const router = Router();

// GET /api/wa-blast/status
router.get('/status', async (_req: Request, res: Response) => {
    try {
        const isConfigured = waBlastService.isConfigured();
        const sessionStatus = isConfigured
            ? await waBlastService.getSessionStatus()
            : { connected: false, status: 'NOT_CONFIGURED' };

        res.json({
            success: true,
            data: {
                configured: isConfigured,
                session: sessionStatus,
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/wa-blast/send — Manual send message
router.post('/send', async (req: Request, res: Response) => {
    try {
        const { phone, message } = req.body;

        if (!phone || !message) {
            res.status(400).json({ success: false, error: 'Phone and message are required' });
            return;
        }

        const result = await waBlastService.sendMessage(phone, message);

        if (result.success) {
            res.json({ success: true, data: result });
        } else {
            res.status(400).json({ success: false, error: result.error });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
