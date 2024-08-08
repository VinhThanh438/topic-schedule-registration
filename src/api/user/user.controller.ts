import logger from '@common/logger';
import { StatusCode } from '@config/status-code';
import { Request, Response } from 'express';
import { UserService } from '@common/user/user.service';
import { IUserCreate, IUserScheduling } from '@common/user/user.interface';

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

    static async userScheduling(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as any;

            const roomData = await UserService.userScheduling(body as IUserScheduling);

            res.status(StatusCode.CREATED).json({
                message: 'success!',
                // data: roomData,
            });
        } catch (error) {
            logger.error(error.message);
            res.status(StatusCode.SERVER_ERROR).json({ message: error.message });
        }
    }
}
