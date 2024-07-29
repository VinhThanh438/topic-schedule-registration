import {Schema, model} from 'mongoose'

interface IMod extends Document {
    mod_id: Schema.Types.ObjectId;
    mod_name: string,
    state: string // available, busy, offline
}

const ModSchema: Schema<IMod> = new Schema(
    {
        // mod_id: { type: Schema.Types.ObjectId, require: true},
        mod_name: { type: String, require: true, default: null },
        state: { type: String, require: true, default: null },
    },
    {
        timestamps: {
            createdAt: 'create_at',
            updatedAt: 'update_at'
        }
    }
);

export default model<IMod>('Mod', ModSchema);