import { Document, model, Schema } from 'mongoose';

export interface IModScheduleResponse {
    mod_schedule_id: string;
    mod_id: string;
    start_time: Date;
    end_time: Date;
    is_available: boolean;
    is_deleted: boolean;
}

export interface IModSchedule extends Document {
    _id: Schema.Types.ObjectId;
    mod_id: string;
    start_time: Date;
    end_time: Date;
    is_available: boolean; // (true, false)
    is_deleted: boolean;

    transform(): IModScheduleResponse;
}

const ModScheduleSchema: Schema<IModSchedule> = new Schema({
    mod_id: { type: String, required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    is_available: { type: Boolean, required: true, default: true },
    is_deleted: { type: Boolean, required: true, default: false },
});

ModScheduleSchema.method({
    transform(): IModScheduleResponse {
        const transformed: IModScheduleResponse = {
            mod_schedule_id: this._id.toHexString(),
            mod_id: this.mod_id,
            start_time: new Date(this.start_time),
            end_time: new Date(this.end_time),
            is_available: this.is_available,
            is_deleted: this.is_deleted,
        };

        return transformed;
    },
});

export default model<IModSchedule>('ModSchedule', ModScheduleSchema);
