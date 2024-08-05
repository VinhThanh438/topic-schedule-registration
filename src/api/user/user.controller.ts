import logger from '@common/logger';
import { StatusCode } from '@config/status-code';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '@common/user/user.service';
import { IUserCreate } from '@common/user/user.interface';

export class UserController {
    static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const body = req.body as any;
            await UserService.createUser(body as IUserCreate);
            res.status(StatusCode.CREATED).json({
                message: 'registered successfully!',
            });
        } catch (error) {
            logger.error(error.message);
            next(error);
        }
    }
}
