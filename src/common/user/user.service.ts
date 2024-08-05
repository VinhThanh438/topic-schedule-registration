import { StatusCode } from '@config/status-code';
import { IUserCreate } from './user.interface';
import User from './User.model';

export class UserService {
    static async createUser(req: IUserCreate): Promise<void> {
        try {
            await User.create(
                new User({
                    user_name: req.user_name,
                }),
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
