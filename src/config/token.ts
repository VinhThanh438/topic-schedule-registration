import jwt, { JwtPayload } from 'jsonwebtoken';
import { ACCESSTOKEN_KEY, REFRESHTOKEN_KEY } from './environment';
import { IToken, ITokenResponse } from './token.interface';

export class Token {
    public static async getToken(data: ITokenResponse): Promise<IToken> {
        const accessToken = await Token.accessToken(data);
        const refreshToken = await Token.refreshToken(data);

        return {
            accessToken,
            refreshToken,
        };
    }

    public static async accessToken(data: ITokenResponse) {
        return jwt.sign(
            {
                _id: data._id,
                role: data.role,
            },
            ACCESSTOKEN_KEY,
            {
                expiresIn: '120s', // 120 seconds
            },
        );
    }

    public static async refreshToken(data: ITokenResponse) {
        return jwt.sign(
            {
                _id: data._id,
                role: data.role,
            },
            REFRESHTOKEN_KEY,
            {
                expiresIn: '1d', // 1 day
            },
        );
    }
}

export const isTokenExpried = (token: string) => {
    const decodeToken = jwt.decode(token) as JwtPayload;
    const expirationTime = decodeToken.exp * 1000;
    const currentTime = Date.now().valueOf() / 1000;
    return expirationTime <= currentTime;
};
