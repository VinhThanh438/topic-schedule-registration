import { Schema, model } from "mongoose"

interface IRoomResponse {
    room_id: string,
    mod_id: string,
    user_id: string
    status: string
}

interface IRoom extends Document {
    _id: Schema.Types.ObjectId
    mod_id: Schema.Types.ObjectId
    user_id: Schema.Types.ObjectId
    // end_time: Date
    status: string // pending, confirmed, in progress, canceled

    transform(): IRoomResponse
}

const RoomSchema: Schema<IRoom> = new Schema(
    {
        mod_id: { type: String, require: true,},
        user_id: { type: String},
        // end_time: { type: Date},
        status: { type: String, required: true}
    },
    {
        timestamps: {
            createdAt: 'start_time',
            updatedAt: 'update_at',    
        }
    }
);

export default model<IRoom>('Room', RoomSchema);