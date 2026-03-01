/**
 * Auth Routes — Simple admin login with JWT
 */
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@mimpibungalow.com';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'mimpi2024', 10);

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ success: false, error: 'Email and password are required' });
            return;
        }

        if (email !== ADMIN_EMAIL) {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
            return;
        }

        const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
        if (!isValid) {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { email: ADMIN_EMAIL, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            data: {
                token,
                user: { email: ADMIN_EMAIL, name: 'Admin', role: 'admin' },
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/auth/me — verify token
router.get('/me', (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, error: 'No token provided' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        res.json({
            success: true,
            data: { email: decoded.email, name: 'Admin', role: decoded.role },
        });
    } catch {
        res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
});

export default router;
