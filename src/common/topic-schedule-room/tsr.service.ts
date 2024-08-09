import { RoomStatus } from './tsr-status';
import { IGetRoomConfirmed } from './tsr.interface';
import TopicScheduleRoom, { ITopicScheduleRoom } from './Tsr.model';

export class TopicScheduleRoomService {
    static async getConfirmedRoom(req: IGetRoomConfirmed): Promise<ITopicScheduleRoom[]> {
        const data = await TopicScheduleRoom.find({
            _id: req.schedule_room_id,
            status: RoomStatus.CONFIRMED,
        });
        return data;
    }
}
