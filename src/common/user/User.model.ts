import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
    user_id: string;
    user_name: string;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        user_name: { type: String, required: true, default: null },
    },
    {
        timestamps: {
            createdAt: 'create_at',
            updatedAt: 'update_at',
        },
    },
);

export default model<IUser>('User', UserSchema);
