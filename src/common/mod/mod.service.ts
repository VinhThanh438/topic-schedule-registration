import { GenerateTime } from '@common/utils/generate-time';
import { IModConfirm, IModCreate, IModScheduling } from './mod.interface';
import Mod, { IMod } from './Mod.model';
import mongoose from 'mongoose';
import logger from '@common/logger';
import Room from '@common/room/Room.model';
import eventBus from '@common/event-bus';
import { EVENT_ROOM_CONFIRMED } from '@common/constants/mod-event.constant';

export class ModService {
    static async create(req: IModCreate): Promise<void> {
        try {
            await Mod.create(
                new Mod({
                    mod_name: req.mod_name,
                }),
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async modScheduling(req: IModScheduling): Promise<IMod> {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            //  generate available time for mod
            new GenerateTime(req.type, new Date(req.date));
            const gen = GenerateTime.generate();

            const modData = await Mod.findById(req.mod_id);

            // check for duplicate scheduling
            if (modData.available_time.length === 0) {
                gen.forEach((newTime) => {
                    modData.available_time.push(newTime);
                });
            } else {
                gen.forEach((newTime) => {
                    modData.available_time.forEach((oldTime) => {
                        if (oldTime.time.getTime() === newTime.time.getTime())
                            throw new Error('mod has scheduled this time!');
                    });
                    modData.available_time.push(newTime);
                });
            }

            await modData.save();

            session.commitTransaction();

            return modData;
        } catch (error) {
            session.abortTransaction().catch((error) => {
                logger.error(error.message);
                throw new Error(error.message);
            });

            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    static async modConfirmed(req: IModConfirm): Promise<void> {
        try {
            const room = await Room.findOneAndUpdate({ _id: req.room_id }, { status: 'confirmed' });
            if (!room) throw new Error('Room not found!');
            // delete available time
            else eventBus.emit(EVENT_ROOM_CONFIRMED, { mod_id: room.mod_id, time: room.start_time });
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    static async modCanceled(req: any): Promise<void> {
        try {
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }
}
