import { RoomStatus } from './topic-schedule-room-status';
import { IGetRoomConfirmed } from './topic-schedule-room.interface';
import TopicScheduleRoom, { ITopicScheduleRoom } from './Topic-schedule-room.model';

export class TopicScheduleRoomService {
    static async getConfirmedRoom(req: IGetRoomConfirmed): Promise<ITopicScheduleRoom[]> {
        const data = await TopicScheduleRoom.find({
            _id: req.schedule_room_id,
            status: RoomStatus.CONFIRMED,
        });
        return data;
    }
}
