import logger from '@common/logger';
import { IAuth } from './auth.interface';
import User from '@common/user/User.model';
import Mod from '@common/mod/Mod.model';
import bcrypt from 'bcrypt';
import { Role } from '@common/constants/role';
import { Token } from '@config/token';
import { IToken, ITokenResponse } from '@config/token.interface';
import eventBus from '@common/event-bus';
import { EVENT_LOGIN } from '@common/constants/event.constant';

export class AuthService {
    static async logIn(req: IAuth, ip: string): Promise<IToken> {
        let token: IToken;
        let checkPassword: boolean;
        let dataObject: ITokenResponse;

        try {
            if (req.role === Role.USER) {
                const userData = await User.findOne({ user_name: req.name });

                // check existed data
                if (!userData) throw new Error('User not found!');

                // check password
                checkPassword = await bcrypt.compare(req.password, userData.password);
                if (!checkPassword) throw new Error('Incorrect password!');

                dataObject = {
                    _id: userData.transform().user_id,
                    role: userData.role,
                };

                token = await Token.getToken(dataObject);
            } else {
                const modData = await Mod.findOne({ mod_name: req.name });
                if (!modData) throw new Error('Mod not found!');

                checkPassword = await bcrypt.compare(req.password, modData.password);
                if (!checkPassword) throw new Error('Incorrect password!');

                dataObject = {
                    _id: modData.transform().mod_id,
                    role: modData.role,
                };

                token = await Token.getToken(dataObject);
            }

            eventBus.emit(EVENT_LOGIN, {
                id: dataObject._id,
                ip: ip,
                refreshToken: token.refreshToken,
            });

            return token;
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
    }

    static async signUp(req: IAuth): Promise<Object> {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.password, salt);

            if (req.role === Role.USER) {
                const userData = await User.create(
                    new User({
                        user_name: req.name,
                        password: hashed,
                    }),
                );
                return userData.transform();
            } else {
                const modData = await Mod.create(
                    new Mod({
                        mod_name: req.name,
                        password: hashed,
                    }),
                );
                return modData.transform();
            }
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
    }
}
