import logger from '@common/logger';
import { IUserCreate, IUserScheduling } from './user.interface';
import User from './User.model';
import Room, { IRoom } from '@common/room/Room.model';
import Mod from '@common/mod/Mod.model';
import eventBus from '@common/event-bus';
import { EVENT_ROOM_CREATED } from '@common/constants/user-event.constant';
import mongoose from 'mongoose';

export class UserService {
    static async createUser(req: IUserCreate): Promise<void> {
        try {
            await User.create(
                new User({
                    user_name: req.user_name,
                }),
            );
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    // static async checkRemainingLession(req: IUserScheduling): Promise<Boolean> {
    //     try {
    //         const userData = await User.findOne({
    //             _id: req.user_id,
    //             remaining_lessions: { $lte: 0 },
    //         });

    //         if (userData) return false;
    //         else return true;
    //     } catch (error) {
    //         logger.error(error.message);
    //         throw new Error(error.message);
    //     }
    // }

    // static async checkDuplicateSchedule(req: IUserScheduling): Promise<Boolean> {
    //     try {
    //         const getModData = await Mod.findOne(
    //             {
    //                 _id: req.mod_id,
    //                 'available_time._id': req.time_id,
    //             },
    //             {
    //                 'available_time.$': 1,
    //             },
    //         );

    //         const check = await Room.findOne({
    //             start_time: getModData.available_time[0].time.getTime(),
    //         });

    //         if (check) return false;
    //         else return true;
    //     } catch (error) {
    //         logger.error(error.message);
    //         throw new Error(error.message);
    //     }
    // }

    // static async userScheduling(req: IUserScheduling): Promise<IRoom> {
    //     const session = await mongoose.startSession();
    //     try {
    //         session.startTransaction();

    //         // get time
    //         const modData = await Mod.findOne(
    //             {
    //                 _id: req.mod_id,
    //                 'available_time._id': req.time_id,
    //             },
    //             {
    //                 'available_time.$': 1,
    //             },
    //         );

    //         if (!modData) throw new Error('user or time does not exist');
    //         else {
    //             const time = modData.available_time[0].time;

    //             // create new room
    //             const roomData = await Room.create(
    //                 new Room({
    //                     mod_id: req.mod_id,
    //                     user_id: req.user_id,
    //                     start_time: time,
    //                 }),
    //             );

    //             await session.commitTransaction();
    //             await session.endSession();

    //             // update remaining lession of user
    //             eventBus.emit(EVENT_ROOM_CREATED, { user_id: req.user_id });

    //             return roomData;
    //         }
    //     } catch (error) {
    //         session.abortTransaction().catch((err) => {
    //             logger.error(err.message);
    //             throw new Error(err.message);
    //         });
    //         logger.error(error.message);
    //         throw new Error(error.message);
    //     }
    // }
}
