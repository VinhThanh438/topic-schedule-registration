import logger from '@common/logger';
import { IUserScheduled } from '@common/user/user.interface';
import { UserService } from '@common/user/user.service';
import { StatusCode } from '@config/status-code';
import { NextFunction, Request, Response } from 'express';

export class UserMiddleware {
    static async checkAvailableSchedule(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const body = req.body as any;

            const check = await UserService.checkAvailableSchedule(body as IUserScheduled);

            if (!check) throw new Error('Unavailable schedule!');
            else next();
        } catch (error) {
            res.status(StatusCode.REQUEST_FORBIDDEN).json({ message: error.message });
        }
    }

    static async checkDuplicateSchedule(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const body = req.body as any;

            const check = await UserService.checkDuplicateSchedule(body as IUserScheduled);

            if (!check) throw new Error('Unavailable schedule!');
            else next();
        } catch (error) {
            res.status(StatusCode.REQUEST_FORBIDDEN).json({ message: error.message });
        }
    }
}
