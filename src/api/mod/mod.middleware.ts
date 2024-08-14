import logger from '@common/logger';
import { IUserScheduling } from '@common/user/user.interface';
import { UserService } from '@common/user/user.service';
import { StatusCode } from '@config/status-code';
import { NextFunction, Request, Response } from 'express';

export class ModMiddleware {
    static async checkRemainingLessions(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const userId = req.params.userid;

            const check = await UserService.checkRemainingLession(userId as any);

            if (!check) throw new Error('user has no lessions left!');
            else next();
        } catch (error) {
            logger.error(error.message);
            res.status(StatusCode.REQUEST_FORBIDDEN).json({ message: error.message });
        }
    }
}
