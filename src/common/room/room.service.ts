import logger from '@common/logger';
import { IRoomCreate } from './room.interface';
import Room from './Room.model';

export class RoomService {
    static async createRoom(req: IRoomCreate): Promise<void> {
        try {
            await Room.create(
                new Room({
                    schedule_room_id: req.schedule_room_id,
                }),
            );
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
    }
}
