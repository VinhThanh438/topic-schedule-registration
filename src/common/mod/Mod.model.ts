import { Schema, model, Document } from 'mongoose';

interface IMod extends Document {
    _id: Schema.Types.ObjectId;
    mod_name: string;
    state: string; // available, busy, offline
}

const ModSchema: Schema<IMod> = new Schema(
    {
        mod_name: { type: String, require: true },
        state: { type: String, require: true, default: 'offline' },
    },
    {
        timestamps: {
            createdAt: 'create_at',
            updatedAt: 'update_at',
        },
    },
);

export default model<IMod>('Mod', ModSchema);
