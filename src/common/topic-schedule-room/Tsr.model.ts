import { Document, model, Schema } from "mongoose";
import { RoomStatus } from "./tsr-status";

export interface ITopicScheduleRoomResponse {
    schedule_room_id: string
    mod_id: string
    user_id: string
    mod_schedule_id: string
    status: string
}

export interface ITopicScheduleRoom extends Document {
    _id: Schema.Types.ObjectId
    mod_id: string
    user_id: string
    mod_schedule_id: string
    status: string

    transform(): ITopicScheduleRoomResponse
}

const TopicScheduleRoomSchema: Schema<ITopicScheduleRoom> = new Schema({
    mod_id: { type: String, required: true },
    user_id: { type: String, required: true },
    mod_schedule_id: { type: String, required: true },
    status: { type: String, required: true, default: RoomStatus.PENDING }
})

TopicScheduleRoomSchema.method({
    transform(): ITopicScheduleRoomResponse {
        const transformed: ITopicScheduleRoomResponse = {
            schedule_room_id: this._id.toHexString(),
            mod_id: this.mod_id,
            user_id: this.user_id,
            mod_schedule_id: this.mod_schedule_id,
            status: this.status
        }

        return transformed
    }
})

export default model<ITopicScheduleRoom>('TopicScheduleRoom', TopicScheduleRoomSchema);