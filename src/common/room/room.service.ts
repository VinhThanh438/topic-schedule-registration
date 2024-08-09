import logger from '@common/logger';
import { IRoomCreate, IRoomGetByMod, IRoomGetByUser } from './room.interface';
import Room, { IRoom } from './Room.model';

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
            throw new Error(error.message);
        }
    }
}
