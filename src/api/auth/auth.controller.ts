import { IAuth } from '@common/auth/auth.interface';
import { AuthService } from '@common/auth/auth.service';
import { RedisAdapter } from '@common/infrastructure/redis.adapter';
import jwt, { JwtPayload } from 'jsonwebtoken'
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
        } catch (error) {
            res.status(StatusCode.SERVER_ERROR).json({ message: error.message });
        }
    }

    static async logOut(req: Request, res: Response): Promise<void> {
        try {
            const accessToken = req.headers.accesstoken as string
            const decode = jwt.decode(accessToken) as JwtPayload
            const ip = req.ip

            // remove refresh token
            await RedisAdapter.delete(`RFT-${decode._id}-${ip}`)

            // remove access token
            req.headers.accesstoken = null;

            res.status(StatusCode.OK).json({
                message: 'loged out sucessfully!',
            });
        } catch (error) {
            res.status(StatusCode.SERVER_ERROR).json(error);
        }
    }
}
