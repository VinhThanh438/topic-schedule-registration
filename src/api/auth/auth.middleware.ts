import { StatusCode } from '@config/status-code';
import { NextFunction, Request, Response } from 'express';
import { RedisAdapter } from '@common/infrastructure/redis.adapter';
import { isTokenExpried, Token } from '@config/token';
import jwt, { JwtPayload } from 'jsonwebtoken';

export class AuthMiddleware {
    public static async requireAuth(req: Request, res: Response, next: NextFunction) {
        try {
            const accessToken = req.headers.accesstoken as string;

            if (!accessToken) {
                res.status(StatusCode.REQUEST_UNAUTHORIZED).json({
                    message: 'token is missing',
                });
            }

            const isAccessTokenExpired = isTokenExpried(accessToken as string);
            if (isAccessTokenExpired) {
                // if access token is expired
                // decode access token
                const data = jwt.decode(accessToken) as JwtPayload;

                // get refresh token
                const ip = req.socket.remoteAddress;
                const refreshToken = await RedisAdapter.get(`RFT-${data._id}-${ip}`);
                const isRefreshTokenExpired = isTokenExpried(refreshToken as string);

                // check refresh token expired time
                if (isRefreshTokenExpired) {
                    await RedisAdapter.delete(`RFT-${data._id}-${ip}`);

                    req.headers.accessToken = null;

                    res.status(StatusCode.REQUEST_FORBIDDEN).json({
                        message: 'user needs to log in again!',
                    });
                } else {
                    // create new access token
                    const newAccessToken = await Token.accessToken({
                        _id: data._id,
                        role: data.role,
                    });

                    req.headers.accesstoken = newAccessToken;

                    next();
                }
            } else {
                next();
            }
        } catch (error) {
            next(error);
        }
    }

    public static requirePermission(role: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            const accessToken = req.headers.accesstoken as string;

            const data = jwt.decode(accessToken) as JwtPayload;

            if (role.includes(data.role)) next();
            else
                res.status(StatusCode.REQUEST_FORBIDDEN).json({
                    message: `You don't have permission to use this resource!`,
                });
        };
    }
}
