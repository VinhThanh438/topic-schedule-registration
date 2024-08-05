import { Schema, model, Document } from 'mongoose';

interface IUserResponse {
    user_id: string,
    user_name: string
}

interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    user_name: string;

    transform(): IUserResponse
}

const UserSchema: Schema<IUser> = new Schema(
    {
        user_name: { type: String, required: true, default: null },
    },
);

UserSchema.method({
    transform(): IUserResponse {
        const transformed: IUserResponse = {
            user_id: this._id.toHexString(),
            user_name: this.user_name
        }

        return transformed
    }
})

export default model<IUser>('User', UserSchema);
