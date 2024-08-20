import { IAuth } from '@common/auth/auth.interface';
import { AuthService } from '@common/auth/auth.service';
import { StatusCode } from '@config/status-code';
import { NextFunction, Request, Response } from 'express';

export class AuthController {
    public static async logIn(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const body = req.body as any;
            const ip = req.socket.remoteAddress;

            const token = await AuthService.logIn(body as IAuth, ip as string);

            if (token)
                res.status(StatusCode.OK).json({
                    message: 'Loged in successfully!',
                    accessToken: token.accessToken,
                });
        } catch (error) {
            res.status(StatusCode.SERVER_ERROR).json({ message: error.message });
        }
    }

    public static async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const body = req.body as any;

            const data = await AuthService.signUp(body as IAuth);

            if (data)
                res.status(StatusCode.CREATED).json({
                    message: 'Registed successfully!',
                    data,
                });
            res.send(body);
        } catch (error) {
            res.status(StatusCode.SERVER_ERROR).json({ message: error.message });
        }
    }
}
