import logger from '@common/logger';
import { IUserCreate, IUserEvent, IUserScheduling } from './user.interface';
import User from './User.model';
import eventBus from '@common/event-bus';
import { EVENT_TOPIC_ROOM_CREATED } from '@common/constants/event.constant';
import TopicScheduleRoom, {
    ITopicScheduleRoom,
} from '@common/topic-schedule-room/Topic-schedule-room.model';
import mongoose from 'mongoose';
import ModSchedule from '@common/mod_schedule/Mod-schedule.model';

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

    static async checkRemainingLession(userId: string): Promise<Boolean> {
        try {
            const userData = await User.findOne({
                _id: userId,
                remaining_lessions: { $lte: 0 },
            });

            if (userData) return false;
            else return true;
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    static async checkDuplicateSchedule(req: IUserScheduling): Promise<Boolean> {
        try {
            const modScheduleId = req.mod_schedule_id;

            const checkData = await ModSchedule.find({ _id: modScheduleId, is_available: false });

            if (checkData.length !== 0) return false;
            else return true;
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    static async userScheduling(req: IUserScheduling): Promise<ITopicScheduleRoom> {
        try {
            const userData = await User.findOneAndUpdate(
                { _id: req.user_id },
                { $inc: { remaining_lessions: -1 } },
            );

            if (userData) {
                const data = await TopicScheduleRoom.create(
                    new TopicScheduleRoom({
                        mod_id: req.mod_id,
                        user_id: req.user_id,
                        mod_schedule_id: req.mod_schedule_id,
                    }),
                );

                return data;
            } else {
                logger.info('userData not found');
            }

            eventBus.emit(EVENT_TOPIC_ROOM_CREATED, {
                // user_id: req.user_id,
                mod_schedule_id: req.mod_schedule_id,
            });
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    // static async updateRemainingLession(req: IUserEvent): Promise<void> {
    //     try {
    //     } catch (error) {
    //         logger.error(error.message);
    //         throw new Error(error.message);
    //     }
    // }
}
