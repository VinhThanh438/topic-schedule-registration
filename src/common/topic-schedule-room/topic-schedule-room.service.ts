import logger from '@common/logger';
import { RoomStatus } from './topic-schedule-room-status';
import { IGetRoomConfirmed } from './topic-schedule-room.interface';
import TopicScheduleRoom, { ITopicScheduleRoom } from './Topic-schedule-room.model';

export class TopicScheduleRoomService {
    static async getConfirmedRoom(req: IGetRoomConfirmed): Promise<ITopicScheduleRoom> {
        try {
            const data = await TopicScheduleRoom.findOneAndUpdate({
                _id: req,
                status: RoomStatus.SYSTEM_CONFIRMED,
            }, {
                status: RoomStatus.ENDED
            });
            return data;
        } catch (error) {
            logger.error(error.message);
        }
    }
}
