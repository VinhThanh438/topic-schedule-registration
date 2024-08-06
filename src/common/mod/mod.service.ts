import { GenerateTime } from '@common/utils/generate-time';
import { IModCreate, IModScheduling } from './mod.interface';
import Mod, { IMod } from './Mod.model';
import mongoose from 'mongoose';
import logger from '@common/logger';

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
}
