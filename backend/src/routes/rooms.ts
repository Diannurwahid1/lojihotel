/**
 * Room Routes
 */
import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/rooms — List all active rooms
router.get('/', async (_req: Request, res: Response) => {
    try {
        const rooms = await prisma.room.findMany({
            where: { isActive: true },
            orderBy: { price: 'asc' },
        });
        res.json({ success: true, data: rooms });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/rooms/:id — Room detail
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const room = await prisma.room.findUnique({
            where: { id: parseInt(req.params.id) },
        });
        if (!room) {
            res.status(404).json({ success: false, error: 'Room not found' });
            return;
        }
        res.json({ success: true, data: room });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/rooms — Create room (admin)
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, slug, type, price, priceUsd, description, features, image, rating, maxGuests, totalRooms } = req.body;
        const room = await prisma.room.create({
            data: {
                name,
                slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
                type,
                price,
                priceUsd: priceUsd || 0,
                description,
                features: features || [],
                image,
                rating: rating || '4.7',
                maxGuests: maxGuests || 2,
                totalRooms: totalRooms || 5,
            },
        });
        res.status(201).json({ success: true, data: room });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT /api/rooms/:id — Update room (admin)
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const room = await prisma.room.update({
            where: { id: parseInt(req.params.id) },
            data: req.body,
        });
        res.json({ success: true, data: room });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/rooms/:id — Soft-delete room (admin)
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        await prisma.room.update({
            where: { id: parseInt(req.params.id) },
            data: { isActive: false },
        });
        res.json({ success: true, message: 'Room deactivated' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
