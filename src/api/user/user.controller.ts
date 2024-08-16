import logger from '@common/logger';
import { StatusCode } from '@config/status-code';
import { Request, Response } from 'express';
import { UserService } from '@common/user/user.service';
import { IUserCreate, IUserScheduled } from '@common/user/user.interface';
import { ITopicScheduleRoom } from '@common/topic-schedule-room/Topic-schedule-room.model';

export class UserController {
    static async createUser(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as any;

            await UserService.createUser(body as IUserCreate);

            res.status(StatusCode.CREATED).json({
                message: 'success!',
            });
        } catch (error) {
            logger.error(error.message);
            res.status(StatusCode.SERVER_ERROR).json({ message: error.message });
        }
    }

    static async userScheduled(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as any;

            const roomData = await UserService.userScheduled(body as IUserScheduled);

            res.status(StatusCode.CREATED).json({
                message: 'success!',
                data: roomData.transform(),
            });
        } catch (error) {
            logger.error(error.message);
            res.status(StatusCode.SERVER_ERROR).json({ message: error.message });
        }
    }

    static async cancelSchedule(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as any;

            const data = await UserService.cancelSchedule(body as any);

            if (data)
                res.status(StatusCode.OK).json({
                    message: 'User canceled successfully!',
                    data: data.transform(),
                });
            else {
                res.status(StatusCode.REQUEST_FORBIDDEN).json({
                    message: 'User cannot cancel!',
                });
            }
        } catch (error) {
            logger.error(error.message);
            res.status(StatusCode.SERVER_ERROR).json({ message: error.message });
        }
    }
}
