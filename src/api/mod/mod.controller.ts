import logger from '@common/logger';
import { IModConfirm, IModCreate, IModScheduling } from '@common/mod/mod.interface';
import { ModService } from '@common/mod/mod.service';
import { StatusCode } from '@config/status-code';
import { Request, Response } from 'express';

export class ModController {
    static async create(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as any;
            await ModService.create(body as IModCreate);
            res.status(StatusCode.CREATED).json({
                message: 'success!',
            });
        } catch (error) {
            logger.error(error.message);
            res.status(StatusCode.REQUEST_FORBIDDEN).json({ message: error.message });
        }
    }

    static async modScheduling(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as any;

            const data = await ModService.modScheduling(body as IModScheduling);

            res.status(StatusCode.CREATED).json({ message: 'success', data });
        } catch (error) {
            logger.error(error.message);
            res.status(StatusCode.REQUEST_FORBIDDEN).json({ error: error.message });
        }
    }

    static async modConfirmed(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as any;
            await ModService.modConfirmed(body as IModConfirm);
            res.send('oke');
        } catch (error) {
            logger.error(error.message);
            res.status(StatusCode.REQUEST_FORBIDDEN).json({ error: error.message });
        }
    }

    static async modCanceled(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as any;
        } catch (error) {
            logger.error(error.message);
            res.status(StatusCode.REQUEST_FORBIDDEN).json({ error: error.message });
        }
    }
}
