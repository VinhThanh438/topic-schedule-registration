import logger from '@common/logger';
import { NextFunction, Request, Response } from 'express';

export class RoomController {
    static async createRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
        } catch (error) {
            logger.error(error.message);
            next(error);
        }
    }
}
