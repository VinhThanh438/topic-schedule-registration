import { Schema, model, Document } from 'mongoose';

interface IRoomResponse {
    room_id: string;
    mod_id: string;
    user_id: string;
    start_time: Date;
    end_time: Date;
    status: string;
}

interface IRoom extends Document {
    _id: Schema.Types.ObjectId;
    mod_id: Schema.Types.ObjectId;
    user_id: Schema.Types.ObjectId;
    start_time: Date;
    end_time: Date;
    status: string; // booked, confirmed, in progress, canceled

    transform(): IRoomResponse;
}

const RoomSchema: Schema<IRoom> = new Schema(
    {
        mod_id: { type: Schema.Types.ObjectId, require: true },
        user_id: { type: Schema.Types.ObjectId },
        start_time: { type: Date },
        end_time: { type: Date },
        status: { type: String, required: true, default: 'booked' }, 
    },
    {
        timestamps: {
            createdAt: 'start_time',
            updatedAt: 'update_at',
        },
    },
);

RoomSchema.methods.transform = function (): IRoomResponse {
    return {
        room_id: this._id.toString(),
        mod_id: this.mod_id.toString(),
        user_id: this.user_id.toString(),
        start_time: this.start_time,
        end_time: this.end_time,
        status: this.status,
    };
};

export default model<IRoom>('Room', RoomSchema);
