import { EVENT_MOD_SCHEDULED } from '@common/constants/event.constant';
import eventBus from '@common/event-bus';
import {
    IModCanceled,
    IModConfirm,
    IModCreate,
    IModSchedules,
    IModScheduling,
} from '@common/mod/mod.interface';
import { ModService } from '@common/mod/mod.service';
import { StatusCode } from '@config/status-code';
import { Request, Response } from 'express';

export class ModController {
    static async getOnlines(req: Request, res: Response): Promise<void> {
        try {
            let data = await ModService.getOnlines();

            data = data.map((element) => (element = element.transform()));

            res.status(StatusCode.OK).json({
                message: 'success!',
                data,
            });
        } catch (error) {
            res.status(StatusCode.REQUEST_FORBIDDEN).json({ message: error.message });
        }
    }

    static async getModSchedules(req: Request, res: Response): Promise<void> {
        try {
            const mod_id = req.params.modid;

            const data = await ModService.getModeSchedules(mod_id as string);

            if (data.length === 0)
                res.status(StatusCode.REQUEST_NOT_FOUND).json({
                    message: 'cannot found mod schedule',
                });

            res.status(StatusCode.OK).json({
                message: 'success!',
                data,
            });
        } catch (error) {
            res.status(StatusCode.REQUEST_FORBIDDEN).json({ message: error.message });
        }
    }

    static async modScheduled(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as any;

            const data = await ModService.modScheduled(body as IModScheduling);

            if (data.upserted.length === 0) throw new Error('Mod has been scheduled this time!');

            // store in redis caching
            eventBus.emit(EVENT_MOD_SCHEDULED, body as IModScheduling);

            res.status(StatusCode.CREATED).json({ message: 'success', data: data.upserted });
        } catch (error) {
            res.status(StatusCode.REQUEST_FORBIDDEN).json({ error: error.message });
        }
    }

    static async confirmTopicScheduleRoom(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as any;

            await ModService.confirmTopicScheduleRoom(body as IModConfirm);

            res.status(StatusCode.CREATED).json({
                message: 'Mod confirmed successfully!',
            });
        } catch (error) {
            res.status(StatusCode.REQUEST_FORBIDDEN).json({ error: error.message });
        }
    }

    static async cancelTopicScheduleRoom(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as any;

            const data = await ModService.cancelTopicScheduleRoom(body as IModCanceled);

            res.status(StatusCode.CREATED).json({
                message: 'Mod canceled successfully!',
                data,
            });
        } catch (error) {
            res.status(StatusCode.REQUEST_FORBIDDEN).json({ error: error.message });
        }
    }

    static async cancelConfirmation(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as any;

            const data = await ModService.cancelConfirmation(body as IModCanceled);

            res.status(StatusCode.CREATED).json({
                message: 'Mod canceled successfully!',
                data,
            });
        } catch (error) {
            res.status(StatusCode.REQUEST_FORBIDDEN).json({ error: error.message });
        }
    }

    static async cancelModSchedule(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as any;

            const check = await ModService.cancelModSchedule(body as IModSchedules);
            if (check)
                res.status(StatusCode.OK).json({
                    message: 'Mod schedule canceled successfully!',
                });
            else
                res.status(StatusCode.REQUEST_NOT_FOUND).json({
                    message: 'Mod schedule not found!',
                });
        } catch (error) {
            res.status(StatusCode.REQUEST_FORBIDDEN).json({ error: error.message });
        }
    }
}
