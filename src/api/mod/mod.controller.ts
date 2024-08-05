import logger from '@common/logger';
import { IModCreate, IModScheduling } from '@common/mod/mod.interface';
import { ModService } from '@common/mod/mod.service';
import { StatusCode } from '@config/status-code';
import { NextFunction, Request, Response } from 'express';

export class ModController {
    static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const body = req.body as any;
            await ModService.create(body as IModCreate);
            res.status(StatusCode.CREATED).json({
                message: 'registered successfully!',
            });
        } catch (error) {
            logger.error(error.message);
            next(error);
        }
    }

    static async modScheduling(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const body = req.body as any;

            const data = await ModService.modScheduling(body as IModScheduling);

            res.status(StatusCode.CREATED).json(data);
        } catch (error) {
            logger.error(error.message);
            next(error);
        }
    }
}
