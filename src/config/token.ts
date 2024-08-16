import jwt from 'jsonwebtoken';
import { ACCESSTOKEN_KEY, REFRESHTOKEN_KEY } from './environment';
import { IToken } from './token.interface';
import { IUserResponse } from '@common/user/User.model';

export class Token {
    public static async getToken(data: IUserResponse): Promise<IToken> {
        const accessToken = await Token.accessToken(data);
        const refreshToken = await Token.refreshToken(data);

        return {
            accessToken,
            refreshToken,
        };
    }

    public static async accessToken(data) {
        return jwt.sign(
            {
                user_id: data.user_id,
                user_name: data.user_name,
                remaining_lessions: data.remaining_lessions,
            },
            ACCESSTOKEN_KEY,
            {
                expiresIn: '120s', // 120 seconds
            },
        );
    }

    public static async refreshToken(data) {
        return jwt.sign(
            {
                user_id: data.user_id,
                user_name: data.user_name,
                remaining_lessions: data.remaining_lessions,
            },
            REFRESHTOKEN_KEY,
            {
                expiresIn: '1d', // 1 day
            },
        );
    }
}

export const isTokenExpried = async (token) => {
    const decodeToken = await jwt.decode(token);
    const expirationTime = decodeToken.exp * 1000;
    const currentTime = Date.now().valueOf() / 1000;
    return expirationTime <= currentTime;
};
