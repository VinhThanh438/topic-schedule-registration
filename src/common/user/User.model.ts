import { Role } from '@common/constants/role';
import { Schema, model, Document } from 'mongoose';

export interface IUserResponse {
    user_id: string;
    user_name: string;
    role: string;
    remaining_lessions: number;
}

export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    user_name: string;
    role: string;
    password: string;
    remaining_lessions: number;

    transform(): IUserResponse;
}

const UserSchema: Schema<IUser> = new Schema({
    user_name: { type: String, required: true },
    role: { type: String, required: true, default: Role.USER },
    password: { type: String, required: true },
    remaining_lessions: { type: Number, required: true, default: 3 },
});

UserSchema.method({
    transform(): IUserResponse {
        const transformed: IUserResponse = {
            user_id: this._id.toHexString(),
            user_name: this.user_name,
            role: this.role,
            remaining_lessions: this.remaining_lessions,
        };

        return transformed;
    },
});

export default model<IUser>('User', UserSchema);
