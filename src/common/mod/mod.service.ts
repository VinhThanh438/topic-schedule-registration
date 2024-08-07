import { GenerateTime } from '@common/utils/generate-time';
import { IModConfirm, IModCreate, IModScheduling } from './mod.interface';
import Mod, { IMod } from './Mod.model';
import mongoose from 'mongoose';
import logger from '@common/logger';
import Room from '@common/room/Room.model';
import eventBus from '@common/event-bus';
import { EVENT_ROOM_CONFIRMED } from '@common/constants/mod-event.constant';
import { ModStatus } from './mod-status';
import ModSchedule from '@common/mod_schedule/Mod-schedule.model';

export class ModService {
    static async create(req: IModCreate): Promise<void> {
        try {
            await Mod.create(
                new Mod({
                    mod_name: req.mod_name,
                }),
            );
        } catch (error) {
            logger.error(error.message)
            throw new Error(error.message);
        }
    }

    static async getOnlineMod(): Promise<any> {
        try {
            return await Mod.find({ status: ModStatus.ONLINE })
        } catch (error) {
            logger.error(error.message)
            throw new Error(error.message);
        }
    }

    static async modScheduling(req: IModScheduling): Promise<any> {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            new GenerateTime(req.mod_id, req.type, req.date)
            const generateTime = GenerateTime.generate()

            const data = await ModSchedule.insertMany(generateTime)

            await session.commitTransaction();
            await session.endSession()

            return data;
        } catch (error) {
            session.abortTransaction().catch((error) => {
                logger.error(error.message);
                throw new Error(error.message);
            });

            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    // static async modConfirmed(req: IModConfirm): Promise<void> {
    //     try {
    //         const room = await Room.findOneAndUpdate({ _id: req.room_id }, { status: 'confirmed' });
    //         if (!room) throw new Error('Room not found!');
    //         // delete available time
    //         else eventBus.emit(EVENT_ROOM_CONFIRMED, { mod_id: room.mod_id, time: room.start_time });
    //     } catch (error) {
    //         logger.error(error.message);
    //         throw new Error(error.message);
    //     }
    // }

    // static async modCanceled(req: any): Promise<void> {
    //     try {
    //     } catch (error) {
    //         logger.error(error.message);
    //         throw new Error(error.message);
    //     }
    // }
}
