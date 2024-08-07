import { Document, model, Schema } from "mongoose";

export interface IModScheduleResponse {
    mod_schedule_id: string
    mod_id: string
    start_time: number
    end_time: number
    is_available: boolean
}

export interface IModSchedule extends Document {
    _id: Schema.Types.ObjectId
    mod_id: string
    start_time: number
    end_time: number
    is_available: boolean // (true, false)

    transform(): IModScheduleResponse
}

const ModScheduleSchema: Schema<IModSchedule> = new Schema({
    mod_id: { type: String, required: true },
    start_time: { type: Number, required: true },
    end_time: { type: Number, required: true },
    is_available: { type: Boolean, required: true, default: true}
})

ModScheduleSchema.method({
    transform(): IModScheduleResponse {
        const transformed: IModScheduleResponse = {
            mod_schedule_id: this._id.toHexString(),
            mod_id: this.mod_id,
            start_time: this.start_time,
            end_time: this.end_time,
            is_available: this.is_available
        }

        return transformed
    }
})

export default model<IModSchedule>('ModSchedule', ModScheduleSchema);