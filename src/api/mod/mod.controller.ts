import logger from '@common/logger';
import { IModConfirm, IModCreate, IModSchedules, IModScheduling } from '@common/mod/mod.interface';
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

    static async getOnlineMod(req: Request, res: Response): Promise<void> {
        try {
            const data = await ModService.getOnlineMod();

            res.status(StatusCode.OK).json({
                message: 'success!',
                data,
            });
        } catch (error) {
            logger.error(error.message);
            res.status(StatusCode.REQUEST_FORBIDDEN).json({ message: error.message });
        }
    }

    static async getModSchedules(req: Request, res: Response): Promise<void> {
        try {
            const mod_id = req.params.modid;

            const data = await ModService.getModeSchedules(mod_id as any);

            if (data.length === 0)
                res.status(StatusCode.REQUEST_NOT_FOUND).json({
                    message: 'cannot found mod schedule',
                });

            res.status(StatusCode.OK).json({
                message: 'success!',
                data,
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

            const data = await ModService.modConfirmed(body as IModConfirm);

            res.status(StatusCode.CREATED).json({
                message: 'Mod confirmed successfully!',
                data,
            });
        } catch (error) {
            logger.error(error.message);
            res.status(StatusCode.REQUEST_FORBIDDEN).json({ error: error.message });
        }
    }

    static async topicScheduleRoomCanceled(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as any;

            const data = await ModService.topicScheduleRoomCanceled(body as any);

            res.status(StatusCode.CREATED).json({
                message: 'Mod canceled successfully!',
                data,
            });
        } catch (error) {
            logger.error(error.message);
            res.status(StatusCode.REQUEST_FORBIDDEN).json({ error: error.message });
        }
    }
}
