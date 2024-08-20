import { StatusCode } from '@config/status-code';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export class Authorization {
    public static requirePermission(role: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            const accessToken = req.headers.accesstoken as string;

            const data = jwt.decode(accessToken) as JwtPayload;

            if (role.includes(data.role)) next();

            else 
                res.status(StatusCode.REQUEST_UNAUTHORIZED).json({
                    message: `You don't have permission to use this resource!`,
                });
        };
    }
}
