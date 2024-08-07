import { Schema, model, Document } from 'mongoose';

export interface IRoomResponse {
    room_id: string;
    schedule_room_id: string;
    start_time: Date;
    end_time: Date;
}

export interface IRoom extends Document {
    _id: Schema.Types.ObjectId;
    schedule_room_id: string;
    start_time: Date;
    end_time: Date;

    transform(): IRoomResponse;
}

const RoomSchema: Schema<IRoom> = new Schema(
    {
        schedule_room_id: { type: String, required: true },
        start_time: { type: Date },
        end_time: { type: Date },
    },
    {
        timestamps: {
            createdAt: 'create_at',
            updatedAt: 'update_at',
        },
    },
);

RoomSchema.methods.transform = function (): IRoomResponse {
    return {
        room_id: this._id.toString(),
        schedule_room_id: this.schedule_room_id,
        start_time: this.start_time,
        end_time: this.end_time,
    };
};

export default model<IRoom>('Room', RoomSchema);
