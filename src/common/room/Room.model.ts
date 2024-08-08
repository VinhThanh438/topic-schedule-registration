import { Schema, model, Document } from 'mongoose';

export interface IRoomResponse {
    room_id: string;
    schedule_room_id: string;
}

export interface IRoom extends Document {
    _id: Schema.Types.ObjectId;
    schedule_room_id: string;

    transform(): IRoomResponse;
}

const RoomSchema: Schema<IRoom> = new Schema(
    {
        schedule_room_id: { type: String, required: true },
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
    };
};

export default model<IRoom>('Room', RoomSchema);
