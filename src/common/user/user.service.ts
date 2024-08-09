import logger from '@common/logger';
import { IUserCreate, IUserScheduling } from './user.interface';
import User from './User.model';
import eventBus from '@common/event-bus';
import { EVENT_TOPIC_ROOM_CREATED } from '@common/constants/event.constant';
import TopicScheduleRoom, { ITopicScheduleRoom } from '@common/topic-schedule-room/Topic-schedule-room.model';
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

    static async checkRemainingLession(req: IUserScheduling): Promise<Boolean> {
        try {
            const userData = await User.findOne({
                _id: req.user_id,
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
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const data = await TopicScheduleRoom.create(
                new TopicScheduleRoom({
                    mod_id: req.mod_id,
                    user_id: req.user_id,
                    mod_schedule_id: req.mod_schedule_id,
                }),
            );

            await session.commitTransaction();
            session.endSession();

            eventBus.emit(EVENT_TOPIC_ROOM_CREATED, {
                user_id: req.user_id,
                mod_schedule_id: req.mod_schedule_id,
            });

            return data;
        } catch (error) {
            session.abortTransaction().catch((err) => {
                logger.error(err.message);
                throw new Error(err.message);
            });
            logger.error(error.message);
            throw new Error(error.message);
        }
    }
}
