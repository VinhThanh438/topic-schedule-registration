import logger from "@common/logger";
import { IRoomGetByMod, IRoomGetByUser } from "./room.interface";
import Room, { IRoom } from "./Room.model";

export class RoomService {
    static async getRoomByUser(req: IRoomGetByUser): Promise<any> {
        try {
            const data = await Room.find({ user_id: req })
            return data
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    static async getRoomByMod(req: IRoomGetByMod): Promise<any> {
        try {
            const data = await Room.find({ mod_id: req })
            return data
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }
}