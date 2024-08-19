import { RedisAdapter } from '@common/infrastructure/redis.adapter';
import { StatusCode } from '@config/status-code';
import { isTokenExpried, Token } from '@config/token';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export class Authentication {
    public static async requireAuth(req: Request, res: Response, next: NextFunction) {
        try {
            const accessToken = req.headers.accesstoken as string;

            if (!accessToken) {
                res.status(StatusCode.SERVER_AUTH_ERROR).json({
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

                    res.status(StatusCode.VERIFY_FAILED).json({
                        message: 'user needs to log in again!',
                    });
                } else {
                    // create new access token
                    const newAccessToken = await Token.accessToken({
                        _id: data._id,
                        role: data.role,
                    });

                    req.headers.accessToken = newAccessToken;

                    next();
                }
            } else {
                next();
            }
        } catch (error) {
            next(error);
        }
    }
}
