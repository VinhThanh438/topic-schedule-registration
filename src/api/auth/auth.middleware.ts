import { RedisAdapter } from '@common/infrastructure/redis.adapter';
import { StatusCode } from '@config/status-code';
import { isTokenExpried, Token } from '@config/token';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export class AuthMidleware {
    public static async requireAuth(req: Request, res: Response, next: NextFunction) {
        try {
            const accessToken = req.headers.accesstoken;

            if (!accessToken) {
                res.status(StatusCode.SERVER_AUTH_ERROR).json({
                    message: 'token is missing',
                });
            }

            const isAccessTokenExpired = await isTokenExpried(accessToken);
            if (isAccessTokenExpired) {
                // if access token is expired
                // decode access token
                const data = jwt.decode(accessToken);

                // get refresh token
                const ip = req.socket.remoteAddress;
                const refreshToken = await RedisAdapter.get(`RFT-${data.user_id}-${ip}`);
                const isRefreshTokenExpired = await isTokenExpried(refreshToken);

                // check refresh token expired time
                if (isRefreshTokenExpired) {
                    await RedisAdapter.delete(`RFT-${data.user_id}-${ip}`);

                    req.headers.accessToken = null;
                    res.status(StatusCode.VERIFY_FAILED).json({
                        message: 'user needs to log in again!',
                    });
                } else {
                    // create new access token
                    const newAccessToken = await Token.accessToken({
                        user_id: data.user_id,
                        user_name: data.user_name,
                        balance: data.balance,
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
