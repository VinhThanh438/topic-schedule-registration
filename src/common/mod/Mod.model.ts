import { Schema, model, Document } from 'mongoose';

interface IAvailableTimeSchema extends Document {
    time: Date;
}

interface IModResponse {
    mod_id: string;
    mod_name: string;
    available_time: {
        time: Date;
    }[];
}

interface IMod extends Document {
    _id: Schema.Types.ObjectId;
    mod_name: string;
    status: string; // available, busy, offline
    available_time: {
        time: Date;
    }[];

    transform(): IModResponse;
}

const AvailableTimeSchema: Schema<IAvailableTimeSchema> = new Schema({
    time: { type: Date, required: true },
});

const ModSchema: Schema<IMod> = new Schema(
    {
        mod_name: { type: String, require: true },
        status: { type: String, require: true, default: 'offline' },
        available_time: [AvailableTimeSchema],
    },
);

ModSchema.method({
    transform(): IModResponse {
        const transformed: IModResponse = {
            mod_id: this._id.toHexString(),
            mod_name: this.mod_name,
            available_time: this.available_time,
        };
        return transformed;
    },
});

export default model<IMod>('Mod', ModSchema);
