import { Schema, model, Document } from 'mongoose';

export interface IUserResponse {
    user_id: string;
    user_name: string;
    remaining_lessions: number;
}

export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    user_name: string;
    remaining_lessions: number;

    transform(): IUserResponse;
}

const UserSchema: Schema<IUser> = new Schema({
    user_name: { type: String, required: true, default: null },
    remaining_lessions: { type: Number, required: true, default: 3 },
});

UserSchema.method({
    transform(): IUserResponse {
        const transformed: IUserResponse = {
            user_id: this._id.toHexString(),
            user_name: this.user_name,
            remaining_lessions: this.remaining_lessions,
        };

        return transformed;
    },
});

export default model<IUser>('User', UserSchema);
