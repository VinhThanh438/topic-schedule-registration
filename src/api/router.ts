import express, { NextFunction, Request, Response } from 'express';
import userRoutes from './user/user.route';
import modRoutes from './mod/mod.route';
import authRoutes from './auth/auth.route';
import { StatusCode } from '@config/status-code';
const router = express.Router();

router.use('/user', userRoutes);
router.use('/mod', modRoutes);
router.use('/auth', authRoutes);
router.all('*', (req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCode.REQUEST_NOT_FOUND).json({
        message: `Failed to request: ${req.originalUrl}`,
        method: req.method,
    });
});

export default router;
